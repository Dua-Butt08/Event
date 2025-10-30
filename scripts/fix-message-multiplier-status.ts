#!/usr/bin/env ts-node
/**
 * Fix script to manually update Message Multiplier status
 * Run with: npx ts-node scripts/fix-message-multiplier-status.ts <submissionId>
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixStatus(submissionId: string) {
  console.log(`\n🔧 Fixing submission: ${submissionId}\n`);
  
  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId }
  });
  
  if (!submission) {
    console.error(`❌ Submission not found: ${submissionId}`);
    console.log('\n📋 Listing recent submissions:');
    
    const recent = await prisma.formSubmission.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    recent.forEach(s => {
      console.log(`  • ${s.id} - ${s.status} (created: ${s.createdAt.toISOString()})`);
    });
    
    process.exit(1);
  }
  
  console.log('📊 Current Status:', submission.status);
  console.log('📅 Updated At:', submission.updatedAt);
  
  const components = submission.components as Record<string, unknown>;
  if (!components) {
    console.error('❌ No components found!');
    process.exit(1);
  }
  
  const componentStatus = components.componentStatus as Record<string, string> | undefined;
  
  console.log('\n📦 Current Component Status:');
  if (componentStatus) {
    Object.entries(componentStatus).forEach(([key, value]) => {
      const emoji = value === 'completed' ? '✅' : value === 'pending' ? '⏳' : value === 'failed' ? '❌' : '❓';
      console.log(`  ${emoji} ${key}: ${value}`);
    });
  } else {
    console.log('  ⚠️  No componentStatus found!');
  }
  
  // Check if messageMultiplier has data
  const hasMMData = !!components.messageMultiplier;
  const mmStatus = componentStatus?.messageMultiplier;
  
  console.log(`\n🎯 Message Multiplier:`);
  console.log(`  Status: ${mmStatus || 'NOT SET'}`);
  console.log(`  Has Data: ${hasMMData}`);
  
  // Fix: If data exists but status is pending, update to completed
  if (hasMMData && mmStatus === 'pending') {
    console.log('\n🔧 Fixing: Message Multiplier has data but status is pending');
    console.log('   Updating status to "completed"...\n');
    
    const updatedStatus = {
      ...componentStatus,
      messageMultiplier: 'completed' as const
    };
    
    const updatedComponents = {
      ...components,
      componentStatus: updatedStatus
    };
    
    // Check if all components are now completed
    const allCompleted = Object.values(updatedStatus).every(
      status => status === 'completed' || status === 'not_requested' || status === 'failed'
    );
    
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        components: updatedComponents as never,
        status: allCompleted ? 'completed' : 'pending'
      }
    });
    
    console.log('✅ Status updated successfully!');
    console.log(`   Overall submission status: ${allCompleted ? 'completed' : 'pending'}`);
    console.log('\n🎉 Fix complete! Refresh your browser to see the changes.');
  } else if (!hasMMData) {
    console.log('\n⚠️  Cannot fix: No Message Multiplier data found');
    console.log('   This submission may need to be regenerated.');
  } else {
    console.log(`\n✅ Status is already correct: ${mmStatus}`);
  }
  
  console.log('\n');
}

const submissionId = process.argv[2];
if (!submissionId) {
  console.error('Usage: npx ts-node scripts/fix-message-multiplier-status.ts <submissionId>');
  console.log('\nRunning without submissionId to list recent submissions...\n');
  
  const prisma = new PrismaClient();
  prisma.formSubmission.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  }).then(recent => {
    console.log('📋 Recent submissions:');
    recent.forEach(s => {
      console.log(`  • ${s.id} - ${s.status} (created: ${s.createdAt.toISOString()})`);
    });
    process.exit(0);
  });
} else {
  fixStatus(submissionId)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
