import { NextRequest, NextResponse } from 'next/server';
import { saveFormSubmission, updateFormSubmission } from '@/lib/storage';
import { WebhookService } from '@/lib/webhook-service';
import { getFormSubmission } from '@/lib/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const AudienceArchitectSchema = z.object({
  targetMarket: z.string().min(1, 'targetMarket is required'),
  product: z.string().min(1, 'product is required'),
  generateLandingPage: z.boolean().optional().default(false),
  // Landing page required fields
  eventName: z.string().optional(),
  eventDates: z.string().optional(),
  eventLocation: z.string().optional(),
  uniqueSellingPoints: z.string().optional(),
  ticketTiers: z.string().optional(),
  // Landing page optional fields
  speakers: z.string().optional(),
  keyTransformations: z.string().optional(),
  testimonials: z.string().optional(),
  leadCaptureStrategy: z.string().optional(),
  // Hyphenated versions for n8n compatibility
  'event-name': z.string().optional(),
  'event-dates': z.string().optional(),
  'event-location': z.string().optional(),
  'unique-selling-points': z.string().optional(),
  'ticket-tiers': z.string().optional(),
  'key-transformations': z.string().optional(),
  'lead-capture-strategy': z.string().optional(),
  timestamp: z.string().optional(),
}).refine(
  (data) => {
    // If generateLandingPage is true, required fields must be provided
    if (data.generateLandingPage) {
      return (
        data.eventName && data.eventName.trim().length > 0 &&
        data.eventDates && data.eventDates.trim().length > 0 &&
        data.eventLocation && data.eventLocation.trim().length > 0 &&
        data.uniqueSellingPoints && data.uniqueSellingPoints.trim().length > 0 &&
        data.ticketTiers && data.ticketTiers.trim().length > 0
      );
    }
    return true;
  },
  {
    message: 'Event name, dates, location, unique selling points, and ticket tiers are required when generating landing page',
    path: ['eventName'],
  }
);

export async function POST(request: NextRequest) {
  // Get authenticated user session
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as { id?: string }).id : null;

  const body = await request.json();
  const parsed = AudienceArchitectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { 
    targetMarket, 
    product, 
    generateLandingPage, 
    eventName, 
    eventDates, 
    eventLocation,
    uniqueSellingPoints,
    ticketTiers,
    speakers,
    keyTransformations,
    testimonials,
    leadCaptureStrategy,
    timestamp 
  } = parsed.data;

  // Determine component statuses based on whether landing page is EXPLICITLY requested
  const componentStatus = {
    audienceArchitect: 'pending' as const,
    contentCompass: 'pending' as const,
    messageMultiplier: 'pending' as const,
    // Only generate if EXPLICITLY requested via checkbox
    eventFunnel: generateLandingPage ? 'pending' as const : 'not_requested' as const,
    landingPage: generateLandingPage ? 'pending' as const : 'not_requested' as const
  };

  // Create a submission
  const submission = await saveFormSubmission({
    userId: userId || null,
    kind: 'icp',
    title: `Audience Architect: ${product}`,
    inputs: { 
      targetMarket, 
      product, 
      generateLandingPage,
      ...(generateLandingPage ? { 
        eventName, 
        eventDates, 
        eventLocation,
        uniqueSellingPoints,
        ticketTiers,
        speakers,
        keyTransformations,
        testimonials,
        leadCaptureStrategy
      } : {}),
      timestamp: timestamp || new Date().toISOString() 
    },
    status: 'pending',
    components: {
      componentStatus
    }
  });

  logger.info('Form submission saved', { submissionId: submission.id });

  // Return immediately
  const response = NextResponse.json({
    id: submission.id,
    message: 'Form submitted successfully. Results will be available shortly.',
  });

  // Background processing (progressive chaining)
  logger.info('Starting background webhook processing', { submissionId: submission.id });
  processWebhookInBackground(
    submission.id, 
    targetMarket, 
    product, 
    generateLandingPage || false,
    eventName,
    eventDates,
    eventLocation,
    uniqueSellingPoints,
    ticketTiers,
    speakers,
    keyTransformations,
    testimonials,
    leadCaptureStrategy,
    timestamp
  ).catch(async (error) => {
    logger.error('Background webhook processing failed', { error, submissionId: submission.id });
        
    try {
      // Update submission to failed status so users can see and retry
      await updateFormSubmission(submission.id, {
        status: 'failed',
        webhookResponse: JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          failedAt: new Date().toISOString(),
          stage: 'background_processing'
        })
      });
          
      logger.info('Marked submission as failed', { submissionId: submission.id });
    } catch (updateError) {
      logger.error('Failed to update submission status', { updateError, submissionId: submission.id });
    }
  });

  return response;
}

// Process webhook in the background without blocking the response
async function processWebhookInBackground(
  submissionId: string, 
  targetMarket: string, 
  product: string, 
  generateLandingPage: boolean,
  _eventName?: string,
  _eventDates?: string,
  _eventLocation?: string,
  _uniqueSellingPoints?: string,
  _ticketTiers?: string,
  _speakers?: string,
  _keyTransformations?: string,
  _testimonials?: string,
  _leadCaptureStrategy?: string,
  _timestamp?: string
) {
  try {
    logger.info('Starting webhook processing', { submissionId });
    
    // Submit only the Audience Architect step to N8N
    const aa = await WebhookService.submitStepToN8N({
      step: 'audienceArchitect',
      submissionId,
      inputs: { targetMarket, product }
    });

    logger.info('Audience Architect step completed', { submissionId });

    const initialComponents = {
      audienceArchitect: aa.payload,
      componentStatus: {
        audienceArchitect: aa.status,
        contentCompass: 'pending',
        messageMultiplier: 'pending',
        eventFunnel: generateLandingPage ? 'pending' : 'not_requested',
        landingPage: generateLandingPage ? 'pending' : 'not_requested'
      }
    } as Record<string, unknown>;

    // Update the submission with the initial results; keep overall status pending
    await updateFormSubmission(submissionId, {
      output: JSON.stringify(aa.payload, null, 2),
      components: initialComponents,
      status: 'pending'
    });

    logger.info('Initial results saved', { submissionId, generateLandingPage });

    // Fetch latest submission to merge components progressively
    const current = await getFormSubmission(submissionId);
    let components = (current?.components || {}) as Record<string, unknown>;
    let statusMap = (components as { componentStatus?: Record<string, string> }).componentStatus || {};

    // Content Compass (depends on AA)
    logger.info('Starting Content Compass generation', { timestamp: new Date().toISOString() });
    const cc = await WebhookService.submitStepToN8N({
      step: 'contentCompass',
      submissionId,
      inputs: { targetMarket, product },
      previousOutput: { audienceArchitect: aa.payload }
    });

    components = {
      ...components,
      contentCompass: cc.payload,
      componentStatus: { ...statusMap, contentCompass: cc.status }
    };
    statusMap = { ...statusMap, contentCompass: cc.status }; // Update local statusMap immediately
    await updateFormSubmission(submissionId, { components, status: 'pending' });
    logger.info('Content Compass completed and saved', { status: cc.status, timestamp: new Date().toISOString() });

    // Message Multiplier (depends on CC)
    logger.info('Starting Message Multiplier generation', { timestamp: new Date().toISOString() });

    let mm;
    try {
      mm = await WebhookService.submitStepToN8N({
        step: 'messageMultiplier',
        submissionId,
        inputs: { targetMarket, product },
        previousOutput: { contentCompass: cc.payload }
      });

      logger.info('Message Multiplier webhook response', { 
        status: mm.status, 
        hasPayload: !!mm.payload,
        payloadKeys: mm.payload ? Object.keys(mm.payload).slice(0, 10) : [],
        timestamp: new Date().toISOString() 
      });
    } catch (mmError) {
      logger.error('Message Multiplier webhook failed', { 
        error: mmError,
        message: mmError instanceof Error ? mmError.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      // Mark as failed and update submission
      components = {
        ...components,
        componentStatus: { ...statusMap, messageMultiplier: 'failed' }
      };
      await updateFormSubmission(submissionId, { components, status: 'failed' });
      throw mmError; // Re-throw to stop the chain
    }

    components = {
      ...components,
      messageMultiplier: mm.payload,
      componentStatus: { ...statusMap, messageMultiplier: mm.status }
    };
    statusMap = { ...statusMap, messageMultiplier: mm.status }; // Update local statusMap immediately
    await updateFormSubmission(submissionId, { components, status: 'pending' });
    logger.info('Message Multiplier completed and saved', { 
      status: mm.status, 
      componentStatus: statusMap,
      timestamp: new Date().toISOString() 
    });

    // Check if user requested Event Funnel + Landing Page generation
    if (generateLandingPage) {
      logger.info('User requested landing page - generating Event Funnel + Landing Page');
      
      // Set status to pending before generating
      components = {
        ...components,
        messageMultiplier: mm.payload,
        componentStatus: { 
          ...statusMap, 
          messageMultiplier: mm.status,
          eventFunnel: 'pending',
          landingPage: 'pending'
        }
      };
      await updateFormSubmission(submissionId, { components, status: 'pending' });

      // Event Funnel (depends on MM)

      const ef = await WebhookService.submitStepToN8N({
        step: 'eventFunnel',
        submissionId,
        inputs: { 
          targetMarket, 
          product,
          eventName: _eventName,
          eventDates: _eventDates,
          eventLocation: _eventLocation,
          uniqueSellingPoints: _uniqueSellingPoints,
          ticketTiers: _ticketTiers,
          ..._speakers ? { speakers: _speakers } : {},
          ..._keyTransformations ? { keyTransformations: _keyTransformations } : {},
          ..._testimonials ? { testimonials: _testimonials } : {},
          ..._leadCaptureStrategy ? { leadCaptureStrategy: _leadCaptureStrategy } : {}
        },
        previousOutput: { messageMultiplier: mm.payload }
      });

      components = {
        ...components,
        eventFunnel: ef.payload,
        componentStatus: { ...statusMap, eventFunnel: ef.status }
      };
      statusMap = { ...statusMap, eventFunnel: ef.status }; // Update local statusMap immediately
      await updateFormSubmission(submissionId, { components, status: 'pending' });

      logger.info('Event Funnel completed, now generating Landing Page');

      // Landing Page (depends on Event Funnel)

      const lp = await WebhookService.submitStepToN8N({
        step: 'landingPage',
        submissionId,
        inputs: { 
          targetMarket,
          'target-market': targetMarket,
          product,
          eventName: _eventName,
          'event-name': _eventName,
          eventDates: _eventDates,
          'event-dates': _eventDates,
          eventLocation: _eventLocation,
          'event-location': _eventLocation,
          uniqueSellingPoints: _uniqueSellingPoints,
          'unique-selling-points': _uniqueSellingPoints,
          ticketTiers: _ticketTiers,
          'ticket-tiers': _ticketTiers,
          ..._speakers ? { speakers: _speakers } : {},
          ..._keyTransformations ? { keyTransformations: _keyTransformations, 'key-transformations': _keyTransformations } : {},
          ..._testimonials ? { testimonials: _testimonials } : {},
          ..._leadCaptureStrategy ? { leadCaptureStrategy: _leadCaptureStrategy, 'lead-capture-strategy': _leadCaptureStrategy } : {}
        },
        previousOutput: { eventFunnel: ef.payload }
      });

      components = {
        ...components,
        landingPage: lp.payload,
        componentStatus: { ...statusMap, landingPage: lp.status }
      };
      await updateFormSubmission(submissionId, { components, status: 'completed' });

      logger.info('Full chain (AA → CC → MM → EF → LP) completed', { submissionId });
    } else {
      // Finalize chain at Message Multiplier; defer funnel and landing to user-triggered flow
      components = {
        ...components,
        messageMultiplier: mm.payload,
        componentStatus: { 
          ...statusMap, 
          messageMultiplier: mm.status,
          eventFunnel: 'not_requested',
          landingPage: 'not_requested'
        }
      };

      await updateFormSubmission(submissionId, { components, status: 'completed' });

      logger.info('Initial chain (AA → CC → MM) completed', { submissionId });
    }
  } catch (webhookError) {
    const errorMessage = webhookError instanceof Error ? webhookError.message : 'Unknown error occurred';
    logger.error('Webhook processing failed', { error: webhookError, submissionId });
    
    // Update submission with error status
    await updateFormSubmission(submissionId, {
      status: 'failed',
      webhookResponse: JSON.stringify({ error: errorMessage }) // Store error info
    });
  }
}
