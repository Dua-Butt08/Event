/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import { logger } from './logger';

/**
 * Webhook Service for N8N AI-powered marketing strategy generation
 */

const RETRY_CONFIG = {
  maxRetries: process.env.NODE_ENV === 'production' ? 3 : 2, // Reduced retries for faster responses
 initialDelay: process.env.NODE_ENV === 'production' ? 1000 : 500, // Reduced initial delay
  maxDelay: process.env.NODE_ENV === 'production' ? 15000 : 5000, // Reduced max delay
 backoffMultiplier: 1.5, // Reduced backoff multiplier
} as const;

/**
 * Fetch with timeout and exponential backoff retry
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = process.env.NODE_ENV === 'production' ? 120000 : 60000, // Reduced timeout to 2 min in prod, 1 min in dev
 retryCount: number = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    // Retry on server errors and rate limiting with faster response
    if ((response.status >= 500 || response.status === 429) && retryCount < RETRY_CONFIG.maxRetries) {
      const delay = Math.min(
        RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
        RETRY_CONFIG.maxDelay
      );
      
      if (response.status === 429) {
        logger.warn('Rate limited, retrying', { 
          status: response.status, 
          delay, 
          attempt: retryCount + 1, 
          maxRetries: RETRY_CONFIG.maxRetries 
        });
      } else {
        logger.warn('Server error, retrying', { 
          status: response.status, 
          delay, 
          attempt: retryCount + 1, 
          maxRetries: RETRY_CONFIG.maxRetries 
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithTimeout(url, options, timeoutMs, retryCount + 1);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeout);
    
    if (error && (error as Error).name === 'AbortError') {
      if (retryCount < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount),
          RETRY_CONFIG.maxDelay
        );
        logger.warn('Request timeout, retrying', { delay, attempt: retryCount + 1, maxRetries: RETRY_CONFIG.maxRetries });
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithTimeout(url, options, timeoutMs, retryCount + 1);
      }
      // Return error faster instead of long timeout message
      throw new Error(`Request timeout after ${timeoutMs / 1000}s`);
    }
    throw error;
  }
}

export interface WebhookPayload {
  submissionId: string;
  inputs: Record<string, unknown>;
  timestamp?: string;
}

export class WebhookService {
  /**
   * Get step-specific webhook URL
   */
  static getStepWebhookUrl(step: 'audienceArchitect' | 'contentCompass' | 'messageMultiplier' | 'eventFunnel' | 'landingPage' | 'offerPrompt'): string | null {
    const map: Record<string, string | undefined> = {
      audienceArchitect: process.env.N8N_WEBHOOK_AUDIENCE_ARCHITECT,
      contentCompass: process.env.N8N_WEBHOOK_CONTENT_COMPASS,
      messageMultiplier: process.env.N8N_WEBHOOK_MESSAGE_MULTIPLIER,
      eventFunnel: process.env.N8N_WEBHOOK_EVENT_FUNNEL,
      landingPage: process.env.N8N_WEBHOOK_LANDING_PAGE,
      offerPrompt: process.env.N8N_WEBHOOK_OFFER_PROMPT,
    };
    return map[step] || null;
  }

  /**
   * Submit a step to N8N with optional chaining
   */
  static async submitStepToN8N(params: {
    step: 'audienceArchitect' | 'contentCompass' | 'messageMultiplier' | 'eventFunnel' | 'landingPage' | 'offerPrompt';
    submissionId: string;
    inputs: Record<string, unknown>;
    previousOutput?: Record<string, unknown>;
  }): Promise<{ payload: Record<string, any>; status: 'completed' | 'failed' }> {
    const url = this.getStepWebhookUrl(params.step);
    if (!url) {
      throw new Error(`No webhook URL configured for step: ${params.step}`);
    }

    // Normalize inputs for compatibility
    const inputs = (params.step === 'audienceArchitect' || params.step === 'landingPage')
      ? (() => {
          const result: Record<string, unknown> = { ...params.inputs };
          Object.keys(params.inputs).forEach((key) => {
            const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
            if (!(kebab in result)) result[kebab] = params.inputs[key];
          });
          return result;
        })()
      : params.inputs;

    const body = {
      submissionId: params.submissionId,
      timestamp: new Date().toISOString(),
      step: params.step,
      inputs,
      ...(params.previousOutput ? { previousOutput: params.previousOutput } : {}),
    };

    // Wrap landingPage body in envelope
    const envelope = params.step === 'landingPage' ? { payload: body } : body;

    const bodyStr = JSON.stringify(envelope);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    if (process.env.N8N_AUTH_TOKEN) {
      headers.Authorization = `Bearer ${process.env.N8N_AUTH_TOKEN}`;
    }
    if (process.env.N8N_WEBHOOK_SIGNATURE_SECRET) {
      const signature = crypto.createHmac('sha256', process.env.N8N_WEBHOOK_SIGNATURE_SECRET)
        .update(bodyStr).digest('hex');
      headers['X-Signature'] = signature;
    }

    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: bodyStr
    }, 120000);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      logger.error('N8N step request failed', {
        step: params.step,
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`N8N step request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    logger.info('N8N webhook response received', {
      step: params.step,
      hasData: !!data,
      dataKeys: data ? Object.keys(data).slice(0, 10) : [],
      hasPayload: !!(data && data.payload),
      hasStatus: !!(data && data.status),
      statusValue: data && data.status,
      isArray: Array.isArray(data)
    });
    
    // Unwrap response based on structure
    let unwrappedData = data;
    
    // Handle array wrapper (Message Multiplier returns array)
    if (Array.isArray(data) && data.length > 0) {
      unwrappedData = data[0];
      logger.info('Unwrapped array response', { step: params.step });
    }
    
    // Handle Message Multiplier specific structure: { payload: { role: 'assistant', content: {...} } }
    if (params.step === 'messageMultiplier' && 
        unwrappedData?.payload?.role === 'assistant' && 
        unwrappedData?.payload?.content) {
      logger.info('Detected Message Multiplier nested structure, extracting content', {
        step: params.step,
        contentKeys: Object.keys(unwrappedData.payload.content).slice(0, 10)
      });
      unwrappedData = unwrappedData.payload.content;
    }
    
    // Additional unwrapping for Message Multiplier - handle direct content structure
    if (params.step === 'messageMultiplier' && 
        unwrappedData?.content && 
        typeof unwrappedData.content === 'object' && 
        !unwrappedData.sub_topics && 
        !unwrappedData.milestone) {
      logger.info('Detected Message Multiplier content wrapper, extracting content', {
        step: params.step,
        contentKeys: Object.keys(unwrappedData.content).slice(0, 10)
      });
      unwrappedData = unwrappedData.content;
    }
    
    // Additional deep unwrapping for Message Multiplier to handle complex nested structures
    if (params.step === 'messageMultiplier') {
      let currentData = unwrappedData;
      let depth = 0;
      while (depth < 5 && currentData && typeof currentData === 'object' && !Array.isArray(currentData)) {
        // If we already have the right structure, break
        if (currentData.sub_topics || currentData.milestone || currentData.persona) {
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
      
      // If we found the right structure, use it
      if (currentData && (currentData.sub_topics || currentData.milestone || currentData.persona)) {
        unwrappedData = currentData;
        logger.info('Successfully unwrapped Message Multiplier data after deep inspection', {
          step: params.step,
          depth: depth,
          hasSubTopics: !!currentData.sub_topics,
          hasMilestone: !!currentData.milestone,
          hasPersona: !!currentData.persona
        });
      }
    }
    
    // Support both normalized and legacy formats
    const payload = (unwrappedData && (unwrappedData.payload || unwrappedData)) as Record<string, any>;
    const status = (unwrappedData && unwrappedData.status === 'failed') ? 'failed' : 'completed';
    
    logger.info('N8N response processed', {
      step: params.step,
      finalStatus: status,
      payloadKeys: payload ? Object.keys(payload).slice(0, 10) : [],
      hasExpectedStructure: !!(payload?.sub_topics || payload?.milestone || payload?.topics)
    });
    
    return { payload, status };
  }
}
