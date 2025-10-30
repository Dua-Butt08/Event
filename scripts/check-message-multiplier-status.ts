#!/usr/bin/env ts-node
/**
 * Diagnostic script to check Message Multiplier status
 * Run with: npx ts-node scripts/check-message-multiplier-status.ts <submissionId>
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkStatus(submissionId: string) {
  console.log(`\n🔍 Checking submission: ${submissionId}\n`);
  
  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId }
  });
  
  if (!submission) {
    console.error(`❌ Submission not found: ${submissionId}`);
    process.exit(1);
  }
  
  console.log('📊 Submission Status:', submission.status);
  console.log('📅 Updated At:', submission.updatedAt);
  console.log('\n📦 Components:');
  
  const components = submission.components as Record<string, unknown>;
  if (components) {
    console.log('  Available components:', Object.keys(components));
    
    const componentStatus = components.componentStatus as Record<string, string>;
    if (componentStatus) {
      console.log('\n  Component Status Map:');
      Object.entries(componentStatus).forEach(([key, value]) => {
        const emoji = value === 'completed' ? '✅' : value === 'pending' ? '⏳' : value === 'failed' ? '❌' : '❓';
        console.log(`    ${emoji} ${key}: ${value}`);
      });
      
      // Check specifically for Message Multiplier
      console.log('\n🎯 Message Multiplier:');
      console.log(`  Status: ${componentStatus.messageMultiplier || 'NOT SET'}`);
      console.log(`  Has Data: ${!!components.messageMultiplier}`);
      
      if (components.messageMultiplier) {
        const mm = components.messageMultiplier as Record<string, unknown>;
        console.log(`  Data Keys: ${Object.keys(mm).slice(0, 10).join(', ')}`);
      }
    } else {
      console.log('  ⚠️  No componentStatus found!');
    }
  } else {
    console.log('  ❌ No components found!');
  }
  
  console.log('\n');
}

const submissionId = process.argv[2];
if (!submissionId) {
  console.error('Usage: npx ts-node scripts/check-message-multiplier-status.ts <submissionId>');
  process.exit(1);
}

checkStatus(submissionId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
