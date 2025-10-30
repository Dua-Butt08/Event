import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { z } from 'zod';
import { WebhookService } from '@/lib/webhook-service';
import { logger } from '@/lib/logger';
import { saveFormSubmission } from '@/lib/storage';

const OfferPromptSchema = z.object({
  programName: z.string().min(1, 'Program Name is required'),
  targetAudience: z.string().min(1, 'Target Audience is required'),
  corePromise: z.string().min(1, 'Core Promise is required'),
  programStructure: z.string().min(1, 'Program Structure is required'),
  investmentDetails: z.string().min(1, 'Investment Details are required'),
  idealCandidateCriteria: z.string().min(1, 'Ideal Candidate Criteria is required'),
  quickStartBonus: z.string().min(1, 'Quick-Start Bonus is required'),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = OfferPromptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    programName,
    targetAudience,
    corePromise,
    programStructure,
    investmentDetails,
    idealCandidateCriteria,
    quickStartBonus,
  } = parsed.data;

  const submissionId = `offer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    const { payload, status } = await WebhookService.submitStepToN8N({
      step: 'offerPrompt',
      submissionId,
      inputs: {
        programName,
        targetAudience,
        corePromise,
        programStructure,
        investmentDetails,
        idealCandidateCriteria,
        quickStartBonus,
      },
    });

    logger.info('Offer prompt webhook completed', { submissionId, status });

    // Persist result to FormSubmission with structured components
    const title =
      (payload?.content as Record<string, unknown> | undefined)?.title as string | undefined;

    const created = await saveFormSubmission({
      userId: (session.user as { id?: string }).id as string,
      kind: 'offer',
      title: title || `Offer Prompt: ${programName}`,
      inputs: {
        programName,
        targetAudience,
        corePromise,
        programStructure,
        investmentDetails,
        idealCandidateCriteria,
        quickStartBonus,
      },
      components: {
        offerPrompt: payload,
        componentStatus: { offerPrompt: status },
      },
      status: status === 'completed' ? 'completed' : 'failed',
    });

    return NextResponse.json({
      id: created.id,
      status,
      payload,
      message: status === 'completed'
        ? 'Offer prompt generated successfully.'
        : 'Offer prompt generation failed.',
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Offer prompt webhook failed', { submissionId, error: msg });
    return NextResponse.json(
      { error: 'Offer prompt request failed', details: msg },
      { status: 500 }
    );
  }
}
