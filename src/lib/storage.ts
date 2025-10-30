import { prisma } from './prisma';
import type { Prisma } from '@prisma/client';
import { FormKind } from './types';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger';

export interface FormSubmissionData {
  id: string;
  userId: string | null;
  kind: FormKind;
  title?: string;
  inputs: Record<string, unknown>;
  output?: string;
  components?: Record<string, unknown>;
  webhookResponse?: string;
  n8nId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export async function saveFormSubmission(data: {
  userId: string | null;
  kind: FormKind;
  title?: string;
  inputs: Record<string, unknown>;
  components?: Record<string, unknown>;
  n8nId?: string;
  status?: 'pending' | 'completed' | 'failed';
}): Promise<FormSubmissionData> {
  try {
    const createData = {
      kind: data.kind,
      title: data.title,
      inputs: data.inputs as unknown as Prisma.InputJsonValue,
      components: data.components as unknown as Prisma.InputJsonValue,
      n8nId: data.n8nId,
      status: data.status || 'pending',
      completedAt: data.status === 'completed' ? new Date() : null,
      ...(data.userId && { user: { connect: { id: data.userId } } })
    } as Prisma.FormSubmissionCreateInput;
    
    const submission = await prisma.formSubmission.create({ data: createData });
    return submission as FormSubmissionData;
  } catch {
    logger.warn('Database not available, using file storage');
    const id = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const submissionData: FormSubmissionData = {
      id,
      userId: data.userId,
      kind: data.kind,
      title: data.title,
      inputs: data.inputs,
      components: data.components,
      n8nId: data.n8nId,
      status: data.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: data.status === 'completed' ? new Date() : undefined,
    };

    const resultsDir = path.join('/tmp', 'submissions');
    await fs.mkdir(resultsDir, { recursive: true });
    const filePath = path.join(resultsDir, `submission-${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(submissionData, null, 2));
    return submissionData;
  }
}

/**
 * Update an existing form submission
 * Falls back to file storage if database is unavailable
 * @param id - The submission ID to update
 * @param data - The fields to update
 * @returns The updated form submission or null if not found
 */
export async function updateFormSubmission(
  id: string,
  data: {
    output?: string;
    components?: Record<string, unknown>;
    webhookResponse?: string; // Raw webhook response data
    n8nId?: string;
    status?: 'pending' | 'completed' | 'failed';
    title?: string;
    inputs?: Record<string, unknown>; // Allow updating inputs for retry capability
  }
): Promise<FormSubmissionData | null> {
  try {
    // Try to update database first (without webhookResponse field which may not exist)
    const updateData = {
      ...(data.output && { output: data.output }),
      ...(data.components && { components: data.components as unknown as Prisma.InputJsonValue }),
      ...(data.inputs && { inputs: data.inputs as unknown as Prisma.InputJsonValue }),
      ...(data.n8nId && { n8nId: data.n8nId }),
      ...(data.status && { status: data.status }),
      ...(data.title && { title: data.title }),
      completedAt: data.status === 'completed' ? new Date() : undefined,
    } as Prisma.FormSubmissionUpdateInput;

    const submission = await prisma.formSubmission.update({
      where: { id },
      data: updateData,
    });

    return submission as FormSubmissionData;
  } catch (dbError) {
    logger.warn('Database update failed, falling back to file storage', { error: dbError });
    
    // Fallback to file storage
    try {
      const TMP_DIR = '/tmp';
      const RESULTS_DIR = path.join(TMP_DIR, 'submissions');
      const filePath = path.join(RESULTS_DIR, `submission-${id}.json`);
      
      // Read existing data
      const existingData = await fs.readFile(filePath, 'utf-8');
      const submissionData = JSON.parse(existingData);
      
      // Update with new data
      const updatedData = {
        ...submissionData,
        ...data,
        updatedAt: new Date(),
        completedAt: data.status === 'completed' ? new Date() : submissionData.completedAt,
      };
      
      // Save updated data
      await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));
      
      return updatedData as FormSubmissionData;
    } catch (fileError) {
      logger.error('File storage update failed', { error: fileError });
      return null;
    }
  }
}

/**
 * Get a form submission by ID
 * Falls back to file storage if database is unavailable
 * @param id - The submission ID to retrieve
 * @returns The form submission or null if not found
 */
export async function getFormSubmission(id: string): Promise<FormSubmissionData | null> {
  try {
    const submission = await prisma.formSubmission.findUnique({ where: { id } });

    if (submission) {
      let components = submission.components;
      if (typeof components === 'string') {
        try {
          components = JSON.parse(components);
        } catch (e) {
          logger.error('Failed to parse components', { error: e });
        }
      }
      return { ...submission, components: components as Record<string, unknown> } as FormSubmissionData;
    }
    return null;
  } catch {
    logger.warn('Database not available, trying file storage');
    try {
      const filePath = path.join('/tmp/submissions', `submission-${id}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}

/**
 * Get all form submissions for a user with optional filtering
 * @param userId - The user ID to filter by (null for anonymous submissions)
 * @param options - Optional filtering and pagination options
 * @returns Array of form submissions matching the criteria
 */
export async function getUserFormSubmissions(
  userId: string | null,
  options?: {
    kind?: FormKind;
    status?: 'pending' | 'completed' | 'failed';
    limit?: number;
    offset?: number;
  }
): Promise<FormSubmissionData[]> {
  const where: Prisma.FormSubmissionWhereInput = {
    ...(options?.kind && { kind: options.kind }),
    ...(options?.status && { status: options.status }),
  };
  
  // Only filter by userId if provided
  if (userId) {
    where.userId = userId;
  }
  
  try {
    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });

    return submissions as FormSubmissionData[];
  } catch (error) {
    logger.error('Database query failed', { error });
    
    // If database is unreachable, return empty array instead of throwing
    // This allows the app to function even when database is temporarily unavailable
    if (error instanceof Error && error.message.includes("Can't reach database")) {
      logger.warn('Database unreachable, returning empty submissions list');
      return [];
    }
    
    // For other errors, throw to be handled by the API route
    throw error;
  }
}

/**
 * Delete a form submission by ID
 * Only allows deletion if the userId matches (prevents unauthorized deletions)
 * @param id - The submission ID to delete
 * @param userId - The user ID for authorization (null for anonymous)
 * @returns True if deleted successfully, false otherwise
 */
export async function deleteFormSubmission(id: string, userId: string | null): Promise<boolean> {
  try {
    const where: Prisma.FormSubmissionWhereUniqueInput = { id };
    
    // Only filter by userId if provided (to ensure user can only delete their own submissions)
    if (userId) {
      where.userId = userId;
    }
    
    await prisma.formSubmission.delete({
      where,
    });
    return true;
  } catch {
    return false;
  }
}

