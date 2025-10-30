import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmission } from '@/lib/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'id parameter required' }, { status: 400 });
    }

    const submission = await getFormSubmission(id);
    
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const components = submission.components as Record<string, unknown>;
    const componentStatus = (components as { componentStatus?: Record<string, string> })?.componentStatus;

    // Return detailed debug information
    return NextResponse.json({
      id: submission.id,
      status: submission.status,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
      completedAt: submission.completedAt,
      componentStatus,
      hasAudienceArchitect: Boolean(components?.audienceArchitect),
      hasContentCompass: Boolean(components?.contentCompass),
      hasMessageMultiplier: Boolean(components?.messageMultiplier),
      hasEventFunnel: Boolean(components?.eventFunnel),
      hasLandingPage: Boolean(components?.landingPage),
      inputs: submission.inputs,
      webhookResponse: submission.webhookResponse,
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
