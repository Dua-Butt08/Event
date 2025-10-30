/**
 * Test script to send a sample request to the Message Multiplier webhook
 * Run with: npx ts-node scripts/test-webhook-message-multiplier.ts
 */

import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function testMessageMultiplierWebhook() {
  const webhookUrl = process.env.N8N_WEBHOOK_MESSAGE_MULTIPLIER;
  
  if (!webhookUrl) {
    console.error('❌ N8N_WEBHOOK_MESSAGE_MULTIPLIER not found in environment variables');
    console.log('Please set it in your .env.local file');
    return;
  }

  console.log('🚀 Testing Message Multiplier webhook...');
  console.log(`📡 URL: ${webhookUrl}`);

  // Sample payload
  const payload = {
    submissionId: "test-submission-" + Date.now(),
    timestamp: new Date().toISOString(),
    step: "messageMultiplier",
    inputs: {
      targetMarket: "QA professionals and test automation engineers",
      product: "Advanced Test Automation Platform"
    },
    previousOutput: {
      contentCompass: {
        milestone: {
          order: 1,
          theme: "Mastering modern test automation",
          title: "From Manual Testing to Automated Excellence"
        },
        persona: {
          name: "Sarah Mitchell",
          notes: "Senior QA Engineer struggling with manual testing bottlenecks"
        },
        sub_topics: [
          {
            title: "Understanding Test Automation ROI",
            pain_point: "Manual testing is time-consuming and error-prone",
            desired_outcome: "Automated tests that run reliably and save time",
            belief_shift_required: "Automation is not just about tools, it's about strategy",
            profound_desire_fulfilled: "Confidence in release quality without overtime",
            sub_sub_topics: [
              {
                order: 1,
                title: "Calculating Time Saved",
                description: "Learn how to measure automation ROI in your organization"
              },
              {
                order: 2,
                title: "Building Test Strategy",
                description: "Create a comprehensive automation framework from scratch"
              }
            ]
          }
        ],
        version: "1.1"
      }
    }
  };

  console.log('\n📤 Sending payload:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authentication if configured
    if (process.env.N8N_AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.N8N_AUTH_TOKEN}`;
      console.log('\n🔐 Using authentication token');
    }

    if (process.env.N8N_WEBHOOK_SIGNATURE_SECRET) {
      const crypto = await import('crypto');
      const bodyStr = JSON.stringify(payload);
      const signature = crypto
        .createHmac('sha256', process.env.N8N_WEBHOOK_SIGNATURE_SECRET)
        .update(bodyStr)
        .digest('hex');
      headers['X-Signature'] = signature;
      console.log('🔏 Added signature');
    }

    console.log('\n⏳ Waiting for response...\n');

    const startTime = Date.now();
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const duration = Date.now() - startTime;

    console.log(`\n✅ Response received in ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:');
      console.error(errorText);
      return;
    }

    const data = await response.json();
    
    console.log('\n📥 Response data:');
    console.log(JSON.stringify(data, null, 2));

    // Analyze the response structure
    console.log('\n🔍 Analysis:');
    console.log(`   - Has payload: ${!!data.payload}`);
    console.log(`   - Has status: ${!!data.status}`);
    console.log(`   - Status value: ${data.status}`);
    
    if (data.payload) {
      console.log(`   - Payload type: ${typeof data.payload}`);
      console.log(`   - Payload keys: ${Object.keys(data.payload).join(', ')}`);
      
      const payload = data.payload;
      if (payload.role) {
        console.log(`   - Has role wrapper: ${payload.role}`);
      }
      if (payload.content) {
        console.log(`   - Has content wrapper: true`);
        console.log(`   - Content keys: ${Object.keys(payload.content).join(', ')}`);
        
        const content = payload.content;
        console.log(`   - Has milestone: ${!!content.milestone}`);
        console.log(`   - Has persona: ${!!content.persona}`);
        console.log(`   - Has sub_topics: ${!!content.sub_topics}`);
        if (content.sub_topics && Array.isArray(content.sub_topics)) {
          console.log(`   - Sub topics count: ${content.sub_topics.length}`);
          content.sub_topics.forEach((topic: unknown, idx: number) => {
            console.log(`     Topic ${idx + 1}: ${(topic as { title?: string }).title || 'Untitled'}`);
            if ((topic as { sub_sub_topics?: unknown[] }).sub_sub_topics) {
              console.log(`       - Sub-sub topics: ${(topic as { sub_sub_topics?: unknown[] }).sub_sub_topics?.length || 0}`);
            }
          });
        }
      }
    }

    console.log('\n✨ Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

// Run the test
testMessageMultiplierWebhook();
