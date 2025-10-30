import { NextRequest, NextResponse } from 'next/server';
import { updateFormSubmission, getFormSubmission } from '@/lib/storage';
import { logger } from '@/lib/logger';

/**
 * Webhook callback endpoint for N8N to send completed component results
 * 
 * Expected payload format:
 * {
 *   submissionId: string,
 *   step: 'audienceArchitect' | 'contentCompass' | 'messageMultiplier' | 'eventFunnel' | 'landingPage',
 *   payload: { ...component data... },
 *   status: 'completed' | 'failed',
 *   timestamp: string (ISO)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    logger.info('Webhook callback received', { 
      hasSubmissionId: !!body.submissionId,
      hasStep: !!body.step,
      hasPayload: !!body.payload,
      status: body.status 
    });

    const { submissionId, step, payload, status, timestamp } = body;

    // Validate required fields
    if (!submissionId || !step || !payload) {
      logger.warn('Callback validation failed', { submissionId, step, hasPayload: !!payload });
      return NextResponse.json(
        { error: 'Missing required fields: submissionId, step, payload' },
        { status: 400 }
      );
    }

    // Validate step is one of the known components
    const validSteps = ['audienceArchitect', 'contentCompass', 'messageMultiplier', 'eventFunnel', 'landingPage'];
    if (!validSteps.includes(step)) {
      logger.warn('Invalid step received', { step });
      return NextResponse.json(
        { error: `Invalid step: ${step}. Must be one of ${validSteps.join(', ')}` },
        { status: 400 }
      );
    }

    // Get current submission to merge with existing data
    const currentSubmission = await getFormSubmission(submissionId);
    if (!currentSubmission) {
      logger.error('Submission not found', { submissionId });
      return NextResponse.json(
        { error: `Submission not found: ${submissionId}` },
        { status: 404 }
      );
    }

    // Special handling for Message Multiplier to ensure proper data structure
    let processedPayload = payload;
    if (step === 'messageMultiplier') {
      logger.info('Processing Message Multiplier payload', {
        hasPayload: !!payload,
        payloadType: typeof payload,
        payloadKeys: payload ? Object.keys(payload).slice(0, 10) : []
      });
      
      // Handle various wrapper structures
      if (payload?.role === 'assistant' && payload?.content) {
        logger.info('Unwrapping assistant/content structure for Message Multiplier');
        processedPayload = payload.content;
      } else if (payload?.content && typeof payload.content === 'object' && !payload.sub_topics && !payload.milestone) {
        logger.info('Unwrapping content structure for Message Multiplier');
        processedPayload = payload.content;
      } else if (payload?.payload && typeof payload.payload === 'object') {
        logger.info('Unwrapping payload structure for Message Multiplier');
        processedPayload = payload.payload;
      }
      
      // Validate that we have the expected content structure
      const hasExpectedStructure = processedPayload?.sub_topics || processedPayload?.milestone || processedPayload?.topics;
      if (!hasExpectedStructure) {
        logger.warn('Message Multiplier payload missing expected structure', {
          hasSubTopics: !!processedPayload?.sub_topics,
          hasMilestone: !!processedPayload?.milestone,
          hasTopics: !!processedPayload?.topics,
          payloadKeys: processedPayload ? Object.keys(processedPayload).slice(0, 10) : []
        });
      }
    }

    // Get existing components and componentStatus
    const existingComponents = (currentSubmission.components || {}) as Record<string, unknown>;
    const existingStatus = (existingComponents as { componentStatus?: Record<string, string> }).componentStatus || {};

    // Update the specific component with the new data
    const updatedComponents = {
      ...existingComponents,
      [step]: processedPayload, // Store the actual component data
      componentStatus: {
        ...existingStatus,
        [step]: status || 'completed' // Update the status for this specific component
      }
    };

    logger.info('Updating submission with webhook data', {
      submissionId,
      step,
      newStatus: status || 'completed',
      timestamp,
      hasExpectedDataStructure: step === 'messageMultiplier' 
        ? !!(processedPayload?.sub_topics || processedPayload?.milestone || processedPayload?.topics)
        : true
    });

    // Check if all components are completed
    const allComponentStatuses = updatedComponents.componentStatus as Record<string, string>;
    const pendingComponents = Object.entries(allComponentStatuses)
      .filter(([_key, value]) => value === 'pending');
    const isFullyCompleted = pendingComponents.length === 0;

    // Update the submission with the new component data
    await updateFormSubmission(submissionId, {
      components: updatedComponents,
      status: status === 'failed' 
        ? 'failed' 
        : isFullyCompleted 
          ? 'completed' 
          : 'pending',
      output: JSON.stringify(payload, null, 2) // Store latest component output as main output
    });

    logger.info('Submission updated successfully', {
      submissionId,
      step,
      componentStatus: status || 'completed',
      overallStatus: isFullyCompleted ? 'completed' : 'pending',
      remainingPending: pendingComponents.map(([key]) => key)
    });

    return NextResponse.json({ 
      ok: true,
      submissionId,
      step,
      componentStatus: status || 'completed',
      overallStatus: isFullyCompleted ? 'completed' : 'pending'
    });

  } catch (error) {
    logger.error('Callback API error', { 
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
