import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmission, updateFormSubmission } from '@/lib/storage';
import { WebhookService } from '@/lib/webhook-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const LandingPageSchema = z.object({
  submissionId: z.string().min(1, 'submissionId is required'),
  eventName: z.string().min(1, 'Event name is required'),
  eventDates: z.string().min(1, 'Event dates are required'),
  eventLocation: z.string().min(1, 'Event location is required'),
  uniqueSellingPoints: z.string().min(1, 'Unique selling points are required'),
  ticketTiers: z.string().min(1, 'Ticket tiers are required'),
  speakers: z.string().optional(),
  keyTransformations: z.string().optional(),
  testimonials: z.string().optional(),
  leadCaptureStrategy: z.string().optional(),
  generateLandingPage: z.boolean().optional().default(true), // Default to true for backward compatibility
});

export async function POST(request: NextRequest) {
  // Get authenticated user session
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as { id?: string }).id : null;

  const body = await request.json();
  const parsed = LandingPageSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    submissionId,
    eventName,
    eventDates,
    eventLocation,
    uniqueSellingPoints,
    ticketTiers,
    speakers,
    keyTransformations,
    testimonials,
    leadCaptureStrategy,
    generateLandingPage,
  } = parsed.data;

  // Get the existing submission
  const submission = await getFormSubmission(submissionId);
  
  if (!submission) {
    return NextResponse.json(
      { error: 'Submission not found' },
      { status: 404 }
    );
  }

  // Verify ownership
  if (submission.userId !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  // CRITICAL: Save event data to inputs for retry capability
  const updatedInputs = {
    ...(submission.inputs as Record<string, unknown>),
    eventName,
    eventDates,
    eventLocation,
    uniqueSellingPoints,
    ticketTiers,
    ...(speakers ? { speakers } : {}),
    ...(keyTransformations ? { keyTransformations } : {}),
    ...(testimonials ? { testimonials } : {}),
    ...(leadCaptureStrategy ? { leadCaptureStrategy } : {}),
  };

  // Persist event data immediately before starting background processing
  await updateFormSubmission(submissionId, {
    inputs: updatedInputs
  });

  logger.info('Event data saved to submission inputs for retry capability', { submissionId });

  // Return immediately
  const response = NextResponse.json({
    id: submissionId,
    message: generateLandingPage 
      ? 'Landing page generation started. Results will be available shortly.'
      : 'Event funnel generation started. Results will be available shortly.',
  });

  // Background processing
  logger.info('Starting landing page generation', { submissionId });
  generateLandingPageInBackground(
    submissionId,
    submission.inputs as Record<string, unknown>,
    (submission.components || {}) as Record<string, unknown>,
    eventName,
    eventDates,
    eventLocation,
    uniqueSellingPoints,
    ticketTiers,
    speakers,
    keyTransformations,
    testimonials,
    leadCaptureStrategy,
    generateLandingPage
  ).catch(async (error) => {
    logger.error('Landing page generation failed', { error, submissionId });
    
    try {
      const currentComponents = (await getFormSubmission(submissionId))?.components as Record<string, unknown> || {};
      const currentStatusMap = (currentComponents as { componentStatus?: Record<string, string> }).componentStatus || {};
      
      await updateFormSubmission(submissionId, {
        components: {
          ...currentComponents,
          componentStatus: {
            ...currentStatusMap,
            landingPage: 'failed'
          }
        }
      });
      
      logger.info('Marked landing page as failed', { submissionId });
    } catch (updateError) {
      logger.error('Failed to update landing page status', { updateError, submissionId });
    }
  });

  return response;
}

async function generateLandingPageInBackground(
  submissionId: string,
  inputs: Record<string, unknown>,
  existingComponents: Record<string, unknown>,
  eventName: string,
  eventDates: string,
  eventLocation: string,
  uniqueSellingPoints: string,
  ticketTiers: string,
  speakers?: string,
  keyTransformations?: string,
  testimonials?: string,
  leadCaptureStrategy?: string,
  generateLandingPage = true // Default to true for backward compatibility
) {
  logger.info('Background generation started', { submissionId, generateLandingPage });
  
  try {
    const targetMarket = inputs.targetMarket as string;
    const product = inputs.product as string;
    
    // Update status to pending
    const statusMap = (existingComponents as { componentStatus?: Record<string, string> }).componentStatus || {};
    await updateFormSubmission(submissionId, {
      components: {
        ...existingComponents,
        componentStatus: {
          ...statusMap,
          eventFunnel: 'pending',
          ...(generateLandingPage ? { landingPage: 'pending' } : {})
        }
      }
    });
    
    logger.info('Status set to pending, calling eventFunnel webhook with event details');

    // Call Event Funnel webhook with event details, chaining from MessageMultiplier
    const ef = await WebhookService.submitStepToN8N({
      step: 'eventFunnel',
      submissionId,
      inputs: {
        targetMarket,
        product,
        eventName,
        eventDates,
        eventLocation,
        uniqueSellingPoints,
        ticketTiers,
        ...(speakers ? { speakers } : {}),
        ...(keyTransformations ? { keyTransformations } : {}),
        ...(testimonials ? { testimonials } : {}),
        ...(leadCaptureStrategy ? { leadCaptureStrategy } : {})
      },
      previousOutput: { messageMultiplier: (existingComponents as Record<string, unknown>).messageMultiplier }
    });

    logger.info('Funnel webhook response received', {
      status: ef.status,
      hasPayload: !!ef.payload,
      payloadType: typeof ef.payload
    });

    // Update with event funnel result (re-fetch current state)
    let currentSubmission = await getFormSubmission(submissionId);
    let currentComponents = (currentSubmission?.components || {}) as Record<string, unknown>;
    let currentStatusMap = (currentComponents as { componentStatus?: Record<string, string> }).componentStatus || {};

    currentComponents = {
      ...currentComponents,
      eventFunnel: ef.payload,
      componentStatus: {
        ...currentStatusMap,
        eventFunnel: ef.status
      }
    };
    await updateFormSubmission(submissionId, {
      components: currentComponents,
      status: 'pending'
    });

    logger.info('Calling landingPage webhook with funnel previousOutput');

    // Only call Landing Page webhook if explicitly requested
    if (generateLandingPage) {

    // Call Landing Page webhook chained from event funnel
    const lp = await WebhookService.submitStepToN8N({
      step: 'landingPage',
      submissionId,
      inputs: {
        targetMarket,
        'target-market': targetMarket,
        product,
        eventName,
        'event-name': eventName,
        eventDates,
        'event-dates': eventDates,
        eventLocation,
        'event-location': eventLocation,
        uniqueSellingPoints,
        'unique-selling-points': uniqueSellingPoints,
        ticketTiers,
        'ticket-tiers': ticketTiers,
        ...(speakers ? { speakers } : {}),
        ...(keyTransformations ? { keyTransformations, 'key-transformations': keyTransformations } : {}),
        ...(testimonials ? { testimonials } : {}),
        ...(leadCaptureStrategy ? { leadCaptureStrategy, 'lead-capture-strategy': leadCaptureStrategy } : {})
      },
      previousOutput: { eventFunnel: ef.payload }
    });

    // Update with landing page result (use latest state)
    currentSubmission = await getFormSubmission(submissionId);
    currentComponents = (currentSubmission?.components || {}) as Record<string, unknown>;
    currentStatusMap = (currentComponents as { componentStatus?: Record<string, string> }).componentStatus || {};

    const updatedComponents = {
      ...currentComponents,
      landingPage: lp.payload,
      componentStatus: {
        ...currentStatusMap,
        landingPage: lp.status
      }
    };

    await updateFormSubmission(submissionId, {
      components: updatedComponents,
      status: 'completed'
    });

    logger.info('Successfully updated submission', { submissionId, status: lp.status });
    } else {
      // Event Funnel only - mark as completed without generating landing page
      logger.info('Event Funnel generation complete without landing page');
      await updateFormSubmission(submissionId, {
        status: 'completed'
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error('Landing page generation failed', { error: errorMessage, submissionId });
    throw error;
  }
}
