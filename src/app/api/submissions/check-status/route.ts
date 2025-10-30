import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getFormSubmission } from '@/lib/storage';

/**
 * Quick status check endpoint
 * GET /api/submissions/check-status?id={submissionId}
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const submissionId = searchParams.get('id');

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }

    const submission = await getFormSubmission(submissionId);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const components = (submission.components || {}) as Record<string, unknown>;
    const statusMap = (components as { componentStatus?: Record<string, string> }).componentStatus || {};

    // Count components by status
    const statusCounts = {
      pending: 0,
      completed: 0,
      failed: 0
    };

    Object.values(statusMap).forEach((status: string) => {
      if (status === 'pending') statusCounts.pending++;
      else if (status === 'completed') statusCounts.completed++;
      else if (status === 'failed') statusCounts.failed++;
    });

    return NextResponse.json({
      submissionId: submission.id,
      overallStatus: submission.status,
      componentStatus: statusMap,
      statusCounts,
      hasData: {
        audienceArchitect: Boolean(components.audienceArchitect),
        contentCompass: Boolean(components.contentCompass),
        messageMultiplier: Boolean(components.messageMultiplier),
        eventFunnel: Boolean(components.eventFunnel),
        landingPage: Boolean(components.landingPage),
      },
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      recommendation: statusCounts.pending > 0 && statusCounts.completed === 0 
        ? 'All components are pending. Try using the retry endpoint: /api/submissions/retry'
        : statusCounts.pending > 0 && statusCounts.completed > 0
        ? 'Some components completed, others pending. Use retry to complete remaining.'
        : statusCounts.failed > 0
        ? 'Some components failed. Use retry to reprocess failed components.'
        : 'All components completed successfully!'
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
