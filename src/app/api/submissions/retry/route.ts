import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmission, updateFormSubmission } from '@/lib/storage';
import { WebhookService } from '@/lib/webhook-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { submissionId } = await request.json();
    
    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
    }

    const submission = await getFormSubmission(submissionId);
    
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const inputs = submission.inputs as Record<string, unknown>;
    const { targetMarket, product } = inputs as { targetMarket: string; product: string };
    
    // Extract event data if available (for landing page retry)
    const eventData = {
      eventName: inputs.eventName as string | undefined,
      eventDates: inputs.eventDates as string | undefined,
      eventLocation: inputs.eventLocation as string | undefined,
      uniqueSellingPoints: inputs.uniqueSellingPoints as string | undefined,
      ticketTiers: inputs.ticketTiers as string | undefined,
      speakers: inputs.speakers as string | undefined,
      keyTransformations: inputs.keyTransformations as string | undefined,
      testimonials: inputs.testimonials as string | undefined,
      leadCaptureStrategy: inputs.leadCaptureStrategy as string | undefined,
    };
    
    console.log('🔄 Retrying webhook processing for submission:', submissionId);
    
    // CRITICAL: Reset submission status to pending immediately so UI updates
    await updateFormSubmission(submissionId, {
      status: 'pending'
    });
    
    // Start retry in background
    retryWebhookProcessing(submissionId, targetMarket, product, eventData).catch(error => {
      console.error('Retry failed:', error);
    });

    return NextResponse.json({ 
      message: 'Retry initiated successfully. Processing will resume in the background.',
      submissionId 
    });

  } catch (error) {
    console.error('Retry API error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate retry' },
      { status: 500 }
    );
  }
}

async function retryWebhookProcessing(
  submissionId: string, 
  targetMarket: string, 
  product: string,
  eventData?: {
    eventName?: string;
    eventDates?: string;
    eventLocation?: string;
    uniqueSellingPoints?: string;
    ticketTiers?: string;
    speakers?: string;
    keyTransformations?: string;
    testimonials?: string;
    leadCaptureStrategy?: string;
  }
) {
  try {
    const current = await getFormSubmission(submissionId);
    const components = (current?.components || {}) as Record<string, unknown>;
    let statusMap = (components as { componentStatus?: Record<string, string> }).componentStatus || {};
    
    // CRITICAL: Reset failed component statuses to pending so UI shows processing state
    const resetMap: Record<string, string> = {};
    for (const [key, status] of Object.entries(statusMap)) {
      if (status === 'failed') {
        resetMap[key] = 'pending';
      } else {
        resetMap[key] = status;
      }
    }
    statusMap = resetMap;
    components.componentStatus = statusMap;
    
    // Update submission with reset statuses
    await updateFormSubmission(submissionId, {
      status: 'pending',
      components
    });

    // Define the processing chain
    const steps: Array<{
      key: 'audienceArchitect' | 'contentCompass' | 'messageMultiplier' | 'eventFunnel' | 'landingPage';
      prevKey?: 'audienceArchitect' | 'contentCompass' | 'messageMultiplier' | 'eventFunnel';
    }> = [
      { key: 'audienceArchitect' },
      { key: 'contentCompass', prevKey: 'audienceArchitect' },
      { key: 'messageMultiplier', prevKey: 'contentCompass' },
      { key: 'eventFunnel', prevKey: 'messageMultiplier' },
      { key: 'landingPage', prevKey: 'eventFunnel' }
    ];

    for (const step of steps) {
      // Skip if already completed
      if (statusMap[step.key] === 'completed' && components[step.key]) {
        console.log(`✓ Skipping ${step.key} - already completed`);
        continue;
      }

      // Validate event data is available for eventFunnel and landingPage
      if ((step.key === 'eventFunnel' || step.key === 'landingPage')) {
        const hasEventData = eventData?.eventName && eventData?.eventDates && 
                           eventData?.eventLocation && eventData?.uniqueSellingPoints && 
                           eventData?.ticketTiers;
        
        if (!hasEventData) {
          console.log(`⚠️ Skipping ${step.key} - missing required event data`);
          // Mark as not_requested so user can regenerate with the modal
          statusMap = { ...statusMap, [step.key]: 'not_requested' };
          components.componentStatus = statusMap;
          await updateFormSubmission(submissionId, { components });
          continue;
        }
      }

      console.log(`🔄 Processing ${step.key}...`);
      
      // Build previousOutput from the prior step
      const previousOutput = step.prevKey && components[step.prevKey]
        ? { [step.prevKey]: components[step.prevKey] }
        : undefined;

      // Build step-specific inputs
      let stepInputs: Record<string, unknown> = { targetMarket, product };
      
      // Add event data for eventFunnel and landingPage steps
      if ((step.key === 'eventFunnel' || step.key === 'landingPage') && eventData) {
        stepInputs = {
          ...stepInputs,
          ...(eventData.eventName ? { eventName: eventData.eventName } : {}),
          ...(eventData.eventDates ? { eventDates: eventData.eventDates } : {}),
          ...(eventData.eventLocation ? { eventLocation: eventData.eventLocation } : {}),
          ...(eventData.uniqueSellingPoints ? { uniqueSellingPoints: eventData.uniqueSellingPoints } : {}),
          ...(eventData.ticketTiers ? { ticketTiers: eventData.ticketTiers } : {}),
          ...(eventData.speakers ? { speakers: eventData.speakers } : {}),
          ...(eventData.keyTransformations ? { keyTransformations: eventData.keyTransformations } : {}),
          ...(eventData.testimonials ? { testimonials: eventData.testimonials } : {}),
          ...(eventData.leadCaptureStrategy ? { leadCaptureStrategy: eventData.leadCaptureStrategy } : {}),
        };
        
        // Add hyphenated versions for n8n compatibility (landing page only)
        if (step.key === 'landingPage') {
          stepInputs = {
            ...stepInputs,
            ...(eventData.eventName ? { 'event-name': eventData.eventName } : {}),
            ...(eventData.eventDates ? { 'event-dates': eventData.eventDates } : {}),
            ...(eventData.eventLocation ? { 'event-location': eventData.eventLocation } : {}),
            ...(eventData.uniqueSellingPoints ? { 'unique-selling-points': eventData.uniqueSellingPoints } : {}),
            ...(eventData.ticketTiers ? { 'ticket-tiers': eventData.ticketTiers } : {}),
            ...(eventData.keyTransformations ? { 'key-transformations': eventData.keyTransformations } : {}),
            ...(eventData.leadCaptureStrategy ? { 'lead-capture-strategy': eventData.leadCaptureStrategy } : {}),
          };
        }
      }

      const result = await WebhookService.submitStepToN8N({
        step: step.key,
        submissionId,
        inputs: stepInputs,
        previousOutput
      });

      // Update components with new result
      components[step.key] = result.payload;
      statusMap = { ...statusMap, [step.key]: result.status };
      components.componentStatus = statusMap;

      await updateFormSubmission(submissionId, { 
        components, 
        status: 'pending' 
      });

      console.log(`✅ ${step.key} completed with status: ${result.status}`);
    }

    // Check if all completed
    const allCompleted = Object.values(statusMap).every(s => s === 'completed');
    
    await updateFormSubmission(submissionId, {
      status: allCompleted ? 'completed' : 'pending'
    });

    console.log('✅ Retry processing completed for submission:', submissionId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('❌ Retry processing failed:', errorMessage);
    console.error('Error stack:', errorStack);
    
    await updateFormSubmission(submissionId, {
      status: 'failed',
      webhookResponse: JSON.stringify({ 
        error: errorMessage,
        stack: errorStack,
        retriedAt: new Date().toISOString()
      })
    });
  }
}
