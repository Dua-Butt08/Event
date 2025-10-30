/**
 * Debug script to test webhook connectivity and response handling
 * Run with: npx ts-node scripts/debug-webhook-issues.ts <submissionId>
 */

import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function debugWebhookIssues(submissionId: string) {
  console.log('🔍 Debugging webhook issues for submission:', submissionId);
  
  try {
    // Get submission from database
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId }
    });
    
    if (!submission) {
      console.error('❌ Submission not found');
      return;
    }
    
    console.log('✅ Submission found');
    console.log('   Status:', submission.status);
    console.log('   Created:', submission.createdAt);
    console.log('   Updated:', submission.updatedAt);
    
    // Check components
    const components = submission.components as Record<string, unknown>;
    console.log('\n📦 Components:');
    console.log('   Keys:', Object.keys(components || {}));
    
    // Check component status
    const componentStatus = (components as { componentStatus?: Record<string, string> })?.componentStatus;
    console.log('\n📊 Component Status:');
    if (componentStatus) {
      Object.entries(componentStatus).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    } else {
      console.log('   No component status found');
    }
    
    // Check specific components
    const componentKeys = ['audienceArchitect', 'contentCompass', 'messageMultiplier', 'eventFunnel', 'landingPage'];
    for (const key of componentKeys) {
      if (components[key]) {
        const data = components[key] as Record<string, unknown>;
        console.log(`\n📄 ${key}:`);
        console.log(`   Type: ${typeof data}`);
        console.log(`   Has data: ${!!data}`);
        
        if (typeof data === 'object' && data !== null) {
          const keys = Object.keys(data);
          console.log(`   Top-level keys: ${keys.slice(0, 10).join(', ')}`);
          
          // Check for common data structures
          console.log(`   Has sub_topics: ${!!data.sub_topics}`);
          console.log(`   Has milestone: ${!!data.milestone}`);
          console.log(`   Has persona: ${!!data.persona}`);
          console.log(`   Has topics: ${!!data.topics}`);
          
          if (Array.isArray(data.sub_topics)) {
            console.log(`   Sub_topics count: ${data.sub_topics.length}`);
          }
          if (Array.isArray(data.topics)) {
            console.log(`   Topics count: ${data.topics.length}`);
          }
        }
      } else {
        console.log(`\n📄 ${key}: No data found`);
      }
    }
    
    // Check webhook response
    if (submission.webhookResponse) {
      console.log('\n📡 Webhook Response:');
      try {
        const webhookData = JSON.parse(submission.webhookResponse);
        console.log('   Parsed successfully');
        console.log('   Keys:', Object.keys(webhookData).slice(0, 10));
      } catch (error) {
        console.log('   Raw response (failed to parse as JSON):', (error as Error).message);
        console.log('   ', submission.webhookResponse.substring(0, 200) + '...');
      }
    } else {
      console.log('\n📡 Webhook Response: None found');
    }
    
    // Check output
    if (submission.output) {
      console.log('\n📤 Output:');
      console.log('   Length:', submission.output.length);
      console.log('   Preview:', submission.output.substring(0, 200) + '...');
    } else {
      console.log('\n📤 Output: None found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get submission ID from command line
const submissionId = process.argv[2];

if (!submissionId) {
  console.error('Usage: npx ts-node scripts/debug-webhook-issues.ts <submissionId>');
  process.exit(1);
}

debugWebhookIssues(submissionId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });