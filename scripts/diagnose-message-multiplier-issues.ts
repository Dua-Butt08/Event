#!/usr/bin/env ts-node
/**
 * Diagnostic script to identify and fix Message Multiplier loading issues
 * This script checks for common issues that prevent Message Multiplier data from loading
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseMessageMultiplierIssues() {
  console.log('🔍 Diagnosing Message Multiplier loading issues...\n');
  
  try {
    // Find recent submissions with Message Multiplier data
    const submissions = await prisma.formSubmission.findMany({
      where: {
        components: {
          not: undefined
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    console.log(`📋 Found ${submissions.length} submissions to check\n`);

    let issuesFound = 0;
    let fixesApplied = 0;

    for (const submission of submissions) {
      const components = submission.components as Record<string, unknown> | null;
      
      if (!components) continue;
      
      // Check if this submission has Message Multiplier data
      const mmData = components.messageMultiplier as Record<string, unknown> | undefined;
      const componentStatus = components.componentStatus as Record<string, string> | undefined;
      
      if (!mmData) continue;
      
      console.log(`📝 Submission: ${submission.id}`);
      console.log(`   Created: ${submission.createdAt.toISOString()}`);
      
      // Check 1: Status mismatch - data exists but status is failed
      const mmStatus = componentStatus?.messageMultiplier;
      const hasMilestone = !!mmData.milestone;
      const hasPersona = !!mmData.persona;
      const hasVersion = !!mmData.version;
      const hasSubTopics = Array.isArray(mmData.sub_topics) && mmData.sub_topics.length > 0;
      const hasLegacyTopics = Array.isArray(mmData.topics) && mmData.topics.length > 0;
      
      console.log(`   Status: ${mmStatus || 'NOT SET'}`);
      console.log(`   Has milestone: ${hasMilestone}`);
      console.log(`   Has persona: ${hasPersona}`);
      console.log(`   Has version: ${hasVersion}`);
      console.log(`   Has sub_topics: ${hasSubTopics} (${Array.isArray(mmData.sub_topics) ? mmData.sub_topics.length : 0})`);
      console.log(`   Has legacy topics: ${hasLegacyTopics} (${Array.isArray(mmData.topics) ? mmData.topics.length : 0})`);
      
      // Issue 1: Status is failed but we have valid data
      if (mmStatus === 'failed' && (hasMilestone || hasPersona || hasVersion || hasSubTopics || hasLegacyTopics)) {
        console.log(`   ⚠️  ISSUE: Status is 'failed' but valid data exists`);
        issuesFound++;
        
        // Fix: Update status to completed
        const updatedStatus = {
          ...componentStatus,
          messageMultiplier: 'completed'
        };
        
        const updatedComponents = {
          ...components,
          componentStatus: updatedStatus
        };
        
        await prisma.formSubmission.update({
          where: { id: submission.id },
          data: {
            components: updatedComponents
          }
        });
        
        console.log(`   ✅ FIXED: Updated status from 'failed' to 'completed'`);
        fixesApplied++;
      }
      
      // Issue 2: Status is pending but we have valid data (stuck processing)
      if (mmStatus === 'pending' && (hasMilestone || hasPersona || hasVersion || hasSubTopics || hasLegacyTopics)) {
        console.log(`   ⚠️  ISSUE: Status is 'pending' but valid data exists`);
        issuesFound++;
        
        // Fix: Update status to completed
        const updatedStatus = {
          ...componentStatus,
          messageMultiplier: 'completed'
        };
        
        const updatedComponents = {
          ...components,
          componentStatus: updatedStatus
        };
        
        await prisma.formSubmission.update({
          where: { id: submission.id },
          data: {
            components: updatedComponents
          }
        });
        
        console.log(`   ✅ FIXED: Updated status from 'pending' to 'completed'`);
        fixesApplied++;
      }
      
      // Issue 3: Complex nested structure that wasn't properly unwrapped
      // Check if data is wrapped in the complex structure we saw in the example
      const payload = mmData.payload as Record<string, unknown> | undefined;
      if (payload && typeof payload === 'object' && (payload as any).role === 'assistant' && (payload as any).content) {
        console.log(`   ⚠️  ISSUE: Data is wrapped in complex nested structure`);
        issuesFound++;
        
        // Fix: Unwrap the data
        const unwrappedData = (payload as any).content;
        const updatedComponents = {
          ...components,
          messageMultiplier: unwrappedData
        };
        
        await prisma.formSubmission.update({
          where: { id: submission.id },
          data: {
            components: updatedComponents
          }
        });
        
        console.log(`   ✅ FIXED: Unwrapped complex nested structure`);
        fixesApplied++;
      }
      
      // Issue 4: Empty content detection issue (our previous fix)
      // Check if we have milestone/persona but empty sub_topics, which was causing false positives
      if ((hasMilestone || hasPersona) && Array.isArray(mmData.sub_topics) && mmData.sub_topics.length === 0 && mmStatus === 'failed') {
        console.log(`   ⚠️  ISSUE: Empty sub_topics with valid milestone/persona incorrectly flagged as failed`);
        issuesFound++;
        
        // Fix: Update status to completed
        const updatedStatus = {
          ...componentStatus,
          messageMultiplier: 'completed'
        };
        
        const updatedComponents = {
          ...components,
          componentStatus: updatedStatus
        };
        
        await prisma.formSubmission.update({
          where: { id: submission.id },
          data: {
            components: updatedComponents
          }
        });
        
        console.log(`   ✅ FIXED: Updated status for valid structure with empty sub_topics`);
        fixesApplied++;
      }
      
      console.log('');
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Issues found: ${issuesFound}`);
    console.log(`   Fixes applied: ${fixesApplied}`);
    
    if (issuesFound > 0) {
      console.log(`\n💡 Recommendations:`);
      console.log(`   1. Refresh your browser to see updated Message Multiplier content`);
      console.log(`   2. If issues persist, check the browser console for errors`);
      console.log(`   3. Try regenerating the Message Multiplier component if needed`);
    } else {
      console.log(`\n✅ No issues found with Message Multiplier data in recent submissions`);
    }
    
  } catch (error) {
    console.error('❌ Error diagnosing issues:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the diagnostic
diagnoseMessageMultiplierIssues();