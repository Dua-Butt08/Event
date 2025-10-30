import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Check for stale submissions and mark them as failed
 * A submission is considered stale if it's been pending for more than 10 minutes
 * 
 * GET /api/submissions/check-stale
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find submissions that have been pending for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const staleSubmissions = await prisma.formSubmission.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: tenMinutesAgo
        }
      },
      select: {
        id: true,
        createdAt: true,
        components: true,
      }
    });

    // Update stale submissions to failed status
    const results = await Promise.all(
      staleSubmissions.map(async (submission: { id: string; createdAt: Date; components: unknown | null }) => {
        const components = (submission.components || {}) as Record<string, unknown>;
        const statusMap = (components as { componentStatus?: Record<string, string> }).componentStatus || {};
        
        // Mark pending components as failed
        const updatedStatusMap = { ...statusMap };
        Object.keys(updatedStatusMap).forEach(key => {
          if (updatedStatusMap[key] === 'pending') {
            updatedStatusMap[key] = 'failed';
          }
        });

        // Update the submission
        await prisma.formSubmission.update({
          where: { id: submission.id },
          data: {
            status: 'failed',
            components: {
              ...components,
              componentStatus: updatedStatusMap
            } as Prisma.InputJsonValue,
          }
        });

        return {
          id: submission.id,
          age: Math.floor((Date.now() - submission.createdAt.getTime()) / 1000 / 60), // age in minutes
          action: 'marked_as_failed'
        };
      })
    );

    return NextResponse.json({
      checked: staleSubmissions.length,
      updated: results.length,
      submissions: results
    });

  } catch (error) {
    console.error('Check stale submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to check stale submissions' },
      { status: 500 }
    );
  }
}
