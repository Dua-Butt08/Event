import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Get session for user context
    const session = await getServerSession();

    // Parse request body
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment
    const webhookUrl = process.env.N8N_WEBHOOK_CHAT;

    if (!webhookUrl) {
      // Fallback to demo responses if webhook not configured
      console.log('[Chat API] No webhook configured, using demo mode');

      const demoResponses = [
        "💡 Great question! For high-converting strategies, focus on understanding your audience's deepest pain points. When you speak directly to their struggles, they lean in.",
        "🎯 The key to compelling copy is specificity. Instead of 'grow your business', try '10x your revenue in 90 days'. Numbers + timeframes = credibility.",
        "🚀 Pro tip: Use the PAS framework (Problem-Agitate-Solution). First, identify the problem. Then, make it hurt. Finally, present your solution as the relief.",
        "📈 Your headline should trigger one of these emotions: curiosity, fear, or desire. 'How to...' triggers curiosity. 'Stop losing...' triggers fear. 'Unlock...' triggers desire.",
        "✨ Social proof is your secret weapon. Case studies, testimonials, and real numbers build trust faster than any sales pitch. Show, don't tell.",
        "🔥 Create urgency without being sleazy. Limited spots work, but explaining WHY they're limited is even better. Scarcity with reason = authentic urgency.",
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      return NextResponse.json({
        response: demoResponses[Math.floor(Math.random() * demoResponses.length)],
        mode: 'demo'
      });
    }

    // Prepare payload for n8n
    const payload = {
      message,
      conversationHistory: conversationHistory || [],
      userId: session?.user?.email || 'anonymous',
      timestamp: new Date().toISOString(),
    };

    console.log('[Chat API] Sending message to n8n:', webhookUrl);

    // Call n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_AUTH_TOKEN && {
          'Authorization': `Bearer ${process.env.N8N_AUTH_TOKEN}`
        }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('[Chat API] Received response from n8n:', JSON.stringify(data, null, 2));

    // Try to extract the response from various possible structures
    let aiResponse = data.response || data.output || data.message;

    // If data itself is an array, handle array response formats
    if (Array.isArray(data) && data.length > 0) {
      // Check if first element has output field: [{ output: [...] }]
      if (data[0].output) {
        // Check if output is already a stringified JSON or an array
        if (typeof data[0].output === 'string') {
          aiResponse = data[0].output;
        } else if (Array.isArray(data[0].output)) {
          // N8N format: [{ output: [{ type, content }, ...] }]
          aiResponse = JSON.stringify(data[0].output);
        }
      }
      // Check if it's direct array format: [{ type: "paragraph", content: "..." }, ...]
      else if (data[0].type && data[0].content !== undefined) {
        aiResponse = JSON.stringify(data);
      }
      // Try legacy formats
      else if (!aiResponse) {
        aiResponse = data[0].response || data[0].message || data[0].text;
      }
    }

    // Check if aiResponse is an array with type/content structure (N8N direct array format)
    if (Array.isArray(aiResponse) && aiResponse.length > 0) {
      if (aiResponse[0].type && aiResponse[0].content !== undefined) {
        // Stringify the array for the frontend parser
        aiResponse = JSON.stringify(aiResponse);
      } else {
        // Try legacy formats
        aiResponse = aiResponse[0].response || aiResponse[0].output || aiResponse[0].message || aiResponse[0].text;
      }
    }

    // If data has a nested structure like { body: { response: ... } }
    if (!aiResponse && data.body) {
      aiResponse = data.body.response || data.body.output || data.body.message;
    }

    // If still no response, log the full data structure for debugging
    if (!aiResponse) {
      console.error('[Chat API] Could not find response in n8n data. Full data:', data);
      aiResponse = 'I received your message but had trouble processing it. Please try again.';
    }

    // Return the AI response
    return NextResponse.json({
      response: aiResponse,
      mode: 'ai',
      metadata: data.metadata || {}
    });

  } catch (error) {
    console.error('[Chat API] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const webhookConfigured = !!process.env.N8N_WEBHOOK_CHAT;

  return NextResponse.json({
    status: 'ok',
    webhookConfigured,
    mode: webhookConfigured ? 'ai' : 'demo'
  });
}
