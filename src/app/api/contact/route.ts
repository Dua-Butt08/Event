import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { z } from 'zod';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ContactSchema = z.object({
      formType: z.string().optional(),
      name: z.string().min(1, 'name is required'),
      email: z.string().email('valid email required'),
      company: z.string().min(1, 'company is required'),
      phone: z.string().min(1, 'phone is required'),
      plan: z.string().optional(),
      message: z.string().optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      timestamp: z.string().optional(),
    });
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { formType, name, email, company, phone, plan, message, budget, timeline, timestamp } = parsed.data;

    // Optional: Check if user is authenticated for enhanced tracking
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;

    try {
      // Submit to webhook for contact form processing
      const contactWebhookUrl = process.env.N8N_WEBHOOK_CONTACT || process.env.N8N_WEBHOOK_GENERIC;
      
      if (contactWebhookUrl) {
        const contactPayload = {
          submissionId: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: timestamp || new Date().toISOString(),
          formType: formType || 'pricing_contact',
          name,
          email,
          company,
          phone,
          plan: plan || 'Not specified',
          message: message || '',
          budget: budget || 'Not specified',
          timeline: timeline || 'Not specified',
          userId: userId || 'anonymous',
          source: 'pricing_page',
          userAgent: request.headers.get('user-agent') || 'unknown'
        };

        await fetch(contactWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.N8N_AUTH_TOKEN ? { 'Authorization': `Bearer ${process.env.N8N_AUTH_TOKEN}` } : {})
          },
          body: JSON.stringify(contactPayload)
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });

    } catch (webhookError) {
      logger.error('Webhook submission failed', { error: webhookError });
      
      // Still return success to user, but log the webhook failure
      // In production, you might want to store this in a database as fallback
      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        warning: 'Webhook delivery pending'
      });
    }

  } catch (error) {
    logger.error('Contact form submission error', { error });
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}