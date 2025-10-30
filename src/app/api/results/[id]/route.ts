import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmission, updateFormSubmission } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function GET(_request: NextRequest, { params }: { params: any }) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      logger.error('Missing submission ID in params', { params: resolvedParams });
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      );
    }

    // Require authentication and enforce ownership
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sessionUserId = (session.user as { id?: string }).id as string;

    // Get submission from storage
    const submission = await getFormSubmission(id);

    if (process.env.NODE_ENV === 'development') {
      const componentStatus = (submission?.components as { componentStatus?: Record<string, string> })?.componentStatus;
      logger.debug('Submission debug', {
        submissionId: id,
        found: !!submission,
        status: submission?.status,
        componentKeys: Object.keys(submission?.components || {}),
        componentStatus: componentStatus,
        messageMultiplierStatus: componentStatus?.messageMultiplier,
        hasMessageMultiplierData: !!(submission?.components as Record<string, unknown>)?.messageMultiplier,
        hasLandingPage: !!(submission?.components as Record<string, unknown>)?.landingPage
      });
    }

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Enforce ownership: only the owner can view their submission
    // If submission has no userId (legacy/anonymous), allow any authenticated user to view it
    if (submission.userId && submission.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Return the submission data
    return NextResponse.json({
      id: submission.id,
      userId: submission.userId,
      kind: submission.kind,
      inputs: submission.inputs,
      output: submission.output,
      components: submission.components,
      webhookResponse: submission.webhookResponse, // Include the raw webhook response
      status: submission.status,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt
    });

  } catch (error) {
    logger.error('Error fetching submission', { error, stack: error instanceof Error ? error.stack : undefined });
    return NextResponse.json(
      { error: 'Failed to fetch submission', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function PATCH(request: NextRequest, { params }: { params: any }) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id) {
      logger.error('Missing submission ID in PATCH params', { params: resolvedParams });
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sessionUserId = (session.user as { id?: string }).id as string;

    const existing = await getFormSubmission(id);
    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    if (existing.userId && existing.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updatePayload: {
      output?: string;
      components?: Record<string, unknown>;
      title?: string;
      inputs?: Record<string, unknown>;
      status?: 'pending' | 'completed' | 'failed';
    } = {};

    if (typeof body.output === 'string') updatePayload.output = body.output;
    if (body.components && typeof body.components === 'object') updatePayload.components = body.components;
    if (typeof body.title === 'string') updatePayload.title = body.title;
    if (body.inputs && typeof body.inputs === 'object') updatePayload.inputs = body.inputs;
    if (typeof body.status === 'string') updatePayload.status = body.status;

    const updated = await updateFormSubmission(id, updatePayload);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
    }

    return NextResponse.json({
      id: updated.id,
      userId: updated.userId,
      kind: updated.kind,
      inputs: updated.inputs,
      output: updated.output,
      components: updated.components,
      webhookResponse: updated.webhookResponse,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  } catch (error) {
    logger.error('Error updating submission', { error, stack: error instanceof Error ? error.stack : undefined });
    return NextResponse.json({ 
      error: 'Failed to update submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}