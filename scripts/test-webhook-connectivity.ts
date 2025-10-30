/**
 * Test script to verify webhook connectivity from production environment
 * Run with: npx ts-node scripts/test-webhook-connectivity.ts
 */

import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function testWebhookConnectivity() {
  console.log('📡 Testing webhook connectivity...\n');
  
  // Test URLs
  const webhookUrls = {
    'Audience Architect': process.env.N8N_WEBHOOK_AUDIENCE_ARCHITECT,
    'Content Compass': process.env.N8N_WEBHOOK_CONTENT_COMPASS,
    'Message Multiplier': process.env.N8N_WEBHOOK_MESSAGE_MULTIPLIER,
    'Event Funnel': process.env.N8N_WEBHOOK_EVENT_FUNNEL,
    'Landing Page': process.env.N8N_WEBHOOK_LANDING_PAGE,
    'Offer Prompt': process.env.N8N_WEBHOOK_OFFER_PROMPT,
  };
  
  // Test each webhook
  for (const [name, url] of Object.entries(webhookUrls)) {
    if (!url) {
      console.log(`⚠️  ${name}: Not configured`);
      continue;
    }
    
    console.log(`🔗 ${name}: ${url}`);
    
    try {
      // Test basic connectivity (OPTIONS request)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'OPTIONS',
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
      
      // Check if it's a valid webhook endpoint
      const allowHeader = response.headers.get('allow');
      if (allowHeader) {
        console.log(`   📋 Methods: ${allowHeader}`);
      }
    } catch (error) {
      if (error && (error as Error).name === 'AbortError') {
        console.log('   ❌ Timeout (no response within 10 seconds)');
      } else {
        console.log(`   ❌ Error: ${(error as Error).message}`);
      }
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Test callback URL
  const callbackUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/callback`;
  console.log(`🔄 Callback URL: ${callbackUrl}`);
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(callbackUrl, {
      method: 'OPTIONS',
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    if (error && (error as Error).name === 'AbortError') {
      console.log('   ❌ Timeout (no response within 10 seconds)');
    } else {
      console.log(`   ❌ Error: ${(error as Error).message}`);
    }
  }
  
  console.log('\n✨ Test completed');
}

testWebhookConnectivity()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });