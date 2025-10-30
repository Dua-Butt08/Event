import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getFormSubmission, updateFormSubmission } from '@/lib/storage';
import { WebhookService } from '@/lib/webhook-service';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sessionUserId = (session.user as { id?: string }).id as string;

    const { submissionId, component } = await req.json();

    // Validate inputs
    if (!submissionId || !component) {
      return NextResponse.json(
        { error: 'Missing submissionId or component' },
        { status: 400 }
      );
    }

    // Validate component type
    const validComponents = ['messageMultiplier', 'contentCompass', 'audienceArchitect', 'eventFunnel', 'landingPage'];
    if (!validComponents.includes(component)) {
      return NextResponse.json(
        { error: `Invalid component: ${component}` },
        { status: 400 }
      );
    }

    // Get the submission
    const submission = await getFormSubmission(submissionId);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Verify ownership
    if (submission.userId && submission.userId !== sessionUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    logger.info(`Regenerating component: ${component}`, { submissionId });

    // Get existing components
    const components = (submission.components as Record<string, unknown>) || {};
    const componentStatus = (components.componentStatus as Record<string, string>) || {};

    // Update status to pending
    const updatedComponents = {
      ...components,
      componentStatus: {
        ...componentStatus,
        [component]: 'pending'
      }
    };

    await updateFormSubmission(submissionId, {
      components: updatedComponents
    });

    // Prepare inputs based on component type
    const inputs = submission.inputs as Record<string, unknown>;
    let previousOutput: Record<string, unknown> | undefined;

    // Determine step name and previous output
    let step: 'audienceArchitect' | 'contentCompass' | 'messageMultiplier' | 'eventFunnel' | 'landingPage';
    
    switch (component) {
      case 'audienceArchitect':
        step = 'audienceArchitect';
        break;
      case 'contentCompass':
        step = 'contentCompass';
        previousOutput = {
          audienceArchitect: components.audienceArchitect as Record<string, unknown>
        };
        break;
      case 'messageMultiplier':
        step = 'messageMultiplier';
        previousOutput = {
          contentCompass: components.contentCompass as Record<string, unknown>
        };
        break;
      case 'eventFunnel':
        step = 'eventFunnel';
        previousOutput = {
          messageMultiplier: components.messageMultiplier as Record<string, unknown>
        };
        break;
      case 'landingPage':
        step = 'landingPage';
        previousOutput = {
          eventFunnel: components.eventFunnel as Record<string, unknown>
        };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid component' },
          { status: 400 }
        );
    }

    // Call webhook to regenerate
    try {
      const result = await WebhookService.submitStepToN8N({
        step,
        submissionId,
        inputs,
        previousOutput
      });

      logger.info(`Webhook result for ${component}`, { 
        submissionId, 
        status: result.status,
        hasPayload: !!result.payload,
        payloadKeys: result.payload ? Object.keys(result.payload) : [],
        hasContent: !!(result.payload as Record<string, unknown>)?.content,
        hasRole: !!(result.payload as Record<string, unknown>)?.role,
        hasSubTopics: !!(result.payload as Record<string, unknown>)?.sub_topics,
        subTopicsLength: Array.isArray((result.payload as Record<string, unknown>)?.sub_topics) 
          ? ((result.payload as Record<string, unknown>).sub_topics as unknown[]).length 
          : 0,
        hasMilestone: !!(result.payload as Record<string, unknown>)?.milestone,
        hasPersona: !!(result.payload as Record<string, unknown>)?.persona
      });

      // Extract content with improved unwrapping logic
      let componentData: Record<string, unknown> = result.payload;
      const payloadRecord = result.payload as Record<string, unknown>;
      
      // Special handling for Message Multiplier wrapped structures
      if (component === 'messageMultiplier') {
        // Check for role: 'assistant', content: {...} wrapper
        if (payloadRecord?.role === 'assistant' && payloadRecord?.content) {
          logger.info(`Unwrapping assistant/content wrapper for ${component}`);
          componentData = payloadRecord.content as Record<string, unknown>;
        } else if (payloadRecord?.content && typeof payloadRecord.content === 'object') {
          // Check if content has the expected structure
          const contentObj = payloadRecord.content as Record<string, unknown>;
          if (contentObj?.sub_topics || contentObj?.milestone || contentObj?.persona) {
            logger.info(`Unwrapping content for ${component}`);
            componentData = contentObj;
          }
        } else if (payloadRecord?.payload && typeof payloadRecord.payload === 'object') {
          // Check for payload wrapper
          const payloadObj = payloadRecord.payload as Record<string, unknown>;
          if (payloadObj?.sub_topics || payloadObj?.milestone || payloadObj?.persona) {
            logger.info(`Unwrapping payload wrapper for ${component}`);
            componentData = payloadObj;
          }
        }
        
        // Additional unwrapping for deeply nested structures
        if (componentData && typeof componentData === 'object') {
          // Handle array wrapper (Message Multiplier sometimes returns array)
          if (Array.isArray(componentData) && componentData.length > 0) {
            logger.info(`Unwrapping array wrapper for ${component}`);
            componentData = componentData[0] as Record<string, unknown>;
          }
          
          // Handle deeply nested structures
          let currentData = componentData;
          let depth = 0;
          while (depth < 5 && currentData && typeof currentData === 'object') {
            // Check if current level has the expected Message Multiplier structure
            if (currentData.sub_topics || currentData.milestone || currentData.persona) {
              componentData = currentData;
              break;
            }
            
            // Try to unwrap one level deeper
            if (currentData.content && typeof currentData.content === 'object' && !Array.isArray(currentData.content)) {
              currentData = currentData.content as Record<string, unknown>;
            } else if (currentData.payload && typeof currentData.payload === 'object' && !Array.isArray(currentData.payload)) {
              currentData = currentData.payload as Record<string, unknown>;
            } else {
              break;
            }
            depth++;
          }
        }
      } else {
        // For other components, use existing logic
        if (payloadRecord?.role === 'assistant' && payloadRecord?.content) {
          logger.info(`Unwrapping assistant/content wrapper for ${component}`);
          componentData = payloadRecord.content as Record<string, unknown>;
        } else if (payloadRecord?.content && typeof payloadRecord.content === 'object') {
          logger.info(`Unwrapping content for ${component}`);
          componentData = payloadRecord.content as Record<string, unknown>;
        }
      }

      logger.info(`Final component data structure for ${component}`, {
        hasSubTopics: !!componentData?.sub_topics,
        subTopicsLength: Array.isArray(componentData?.sub_topics) ? (componentData.sub_topics as unknown[]).length : 0,
        hasMilestone: !!componentData?.milestone,
        hasPersona: !!componentData?.persona,
        hasTopics: !!componentData?.topics,
        topLevelKeys: Object.keys(componentData).slice(0, 10)
      });

      // Update submission with new data
      const finalComponents = {
        ...components,
        [component]: componentData,
        componentStatus: {
          ...componentStatus,
          [component]: result.status
        }
      };

      await updateFormSubmission(submissionId, {
        components: finalComponents
      });

      logger.info(`Successfully regenerated ${component}`, { submissionId, status: result.status });

      // If event funnel was regenerated and landing page exists or should be generated, trigger landing page regeneration
      if (component === 'eventFunnel' && result.status === 'completed') {
        const currentSubmission = await getFormSubmission(submissionId);
        const currentComponents = (currentSubmission?.components as Record<string, unknown>) || {};
        const currentStatusMap = (currentComponents as { componentStatus?: Record<string, string> })?.componentStatus || {};
        
        // Check if landing page component exists or if it was previously requested
        if (currentComponents.landingPage || currentStatusMap.landingPage) {
          logger.info('Event funnel regenerated successfully, triggering landing page regeneration', { submissionId });
          
          try {
            // Update landing page status to pending
            const updatedComponents = {
              ...finalComponents,
              componentStatus: {
                ...finalComponents.componentStatus,
                landingPage: 'pending'
              }
            };
            
            await updateFormSubmission(submissionId, {
              components: updatedComponents
            });
            
            // Trigger landing page regeneration in background
            setTimeout(async () => {
              try {
                const landingPageResult = await WebhookService.submitStepToN8N({
                  step: 'landingPage',
                  submissionId,
                  inputs: submission.inputs as Record<string, unknown>,
                  previousOutput: {
                    eventFunnel: result.payload
                  }
                });
                
                // Update with landing page result
                const finalSubmission = await getFormSubmission(submissionId);
                const finalComponents = (finalSubmission?.components as Record<string, unknown>) || {};
                const finalStatusMap = (finalComponents as { componentStatus?: Record<string, string> })?.componentStatus || {};
                
                const updatedFinalComponents = {
                  ...finalComponents,
                  landingPage: landingPageResult.payload,
                  componentStatus: {
                    ...finalStatusMap,
                    landingPage: landingPageResult.status
                  }
                };
                
                await updateFormSubmission(submissionId, {
                  components: updatedFinalComponents
                });
                
                logger.info('Successfully regenerated landing page after event funnel', { 
                  submissionId, 
                  status: landingPageResult.status 
                });
              } catch (landingPageError) {
                logger.error('Failed to regenerate landing page after event funnel', { 
                  error: landingPageError, 
                  submissionId 
                });
                
                // Mark landing page as failed
                const finalSubmission = await getFormSubmission(submissionId);
                const finalComponents = (finalSubmission?.components as Record<string, unknown>) || {};
                const finalStatusMap = (finalComponents as { componentStatus?: Record<string, string> })?.componentStatus || {};
                
                const updatedFinalComponents = {
                  ...finalComponents,
                  componentStatus: {
                    ...finalStatusMap,
                    landingPage: 'failed'
                  }
                };
                
                await updateFormSubmission(submissionId, {
                  components: updatedFinalComponents
                });
              }
            }, 1000); // Small delay to ensure the event funnel update is processed
          } catch (triggerError) {
            logger.error('Failed to trigger landing page regeneration', { 
              error: triggerError, 
              submissionId 
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        status: result.status,
        component
      });
    } catch (webhookError) {
      logger.error(`Failed to regenerate ${component}`, {
        error: webhookError,
        submissionId
      });

      // Mark as failed
      const failedComponents = {
        ...components,
        componentStatus: {
          ...componentStatus,
          [component]: 'failed'
        }
      };

      await updateFormSubmission(submissionId, {
        components: failedComponents
      });

      return NextResponse.json(
        {
          error: webhookError instanceof Error ? webhookError.message : 'Failed to regenerate component'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Regenerate component API error', { error });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
