import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmission, updateFormSubmission } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

/**
 * Fix submission componentStatus for submissions that have webhook data
 * but incorrect status fields
 * 
 * Usage: POST /api/submissions/fix-status
 * Body: { submissionId: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submissionId' },
        { status: 400 }
      );
    }

    logger.info('Fixing submission status', { submissionId });

    // Get the submission
    const submission = await getFormSubmission(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Parse components
    const components = (submission.components || {}) as Record<string, unknown>;
    const componentStatus = (components as { componentStatus?: Record<string, string> })?.componentStatus || {};

    // Check which components have data
    const componentKeys = ['audienceArchitect', 'contentCompass', 'messageMultiplier', 'eventFunnel', 'landingPage'];
    const hasData: Record<string, boolean> = {};
    const updates: string[] = [];

    componentKeys.forEach((key) => {
      hasData[key] = Boolean(components[key] && typeof components[key] === 'object');
    });

    // Update componentStatus for any component that has data but status is 'pending'
    let needsUpdate = false;
    const updatedStatus = { ...componentStatus };

    Object.keys(hasData).forEach((key) => {
      if (hasData[key] && updatedStatus[key] === 'pending') {
        logger.info(`Updating ${key}: pending → completed`);
        updatedStatus[key] = 'completed';
        updates.push(`${key}: pending → completed`);
        needsUpdate = true;
      }
    });

    // Try to parse output field (old webhook format)
    if (submission.output && typeof submission.output === 'string') {
      try {
        const outputData = JSON.parse(submission.output);
        
        // Try to determine which component this data belongs to
        let componentKey: string | null = null;

        // Heuristic detection based on data structure
        if (outputData.funnel || outputData.stages || outputData.touchpoints) {
          componentKey = 'eventFunnel';
        } else if (outputData.sections || outputData.hero || outputData.cta) {
          componentKey = 'landingPage';
        } else if (outputData.milestones || outputData.sub_topics) {
          componentKey = 'messageMultiplier';
        } else if (outputData.topics || outputData.channels) {
          componentKey = 'contentCompass';
        } else if (outputData.icp || outputData.segments || outputData.demographics) {
          componentKey = 'audienceArchitect';
        }

        if (componentKey && !components[componentKey]) {
          logger.info(`Migrating output data to ${componentKey}`);
          components[componentKey] = outputData;
          updatedStatus[componentKey] = 'completed';
          updates.push(`Migrated output data to ${componentKey}`);
          needsUpdate = true;
        }
      } catch (e) {
        logger.warn('Could not parse output field as JSON', { error: e });
      }
    }

    if (needsUpdate) {
      // Update the componentStatus
      components.componentStatus = updatedStatus;

      // Check if all requested components are completed
      const allCompleted = Object.entries(updatedStatus).every(
        ([_key, status]) => status === 'completed' || status === 'not_requested'
      );

      await updateFormSubmission(submissionId, {
        components,
        status: allCompleted ? 'completed' : 'pending'
      });

      logger.info('Submission status fixed', {
        submissionId,
        updates,
        newOverallStatus: allCompleted ? 'completed' : 'pending'
      });

      return NextResponse.json({
        success: true,
        submissionId,
        updates,
        componentStatus: updatedStatus,
        overallStatus: allCompleted ? 'completed' : 'pending'
      });
    } else {
      return NextResponse.json({
        success: true,
        submissionId,
        message: 'No updates needed - submission status is already correct',
        componentStatus: updatedStatus
      });
    }

  } catch (error) {
    logger.error('Fix status API error', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
