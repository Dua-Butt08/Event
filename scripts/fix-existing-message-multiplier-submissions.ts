#!/usr/bin/env ts-node
/**
 * Fix script to update existing submissions with Message Multiplier data that may have 
 * been incorrectly marked as failed due to the empty content detection issue
 * 
 * Run with: npx ts-node scripts/fix-existing-message-multiplier-submissions.ts
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSubmissions() {
  console.log('🔧 Fixing Message Multiplier submissions with empty content detection issue...\n');
  
  try {
    // Find submissions that might have the issue
    const submissions = await prisma.formSubmission.findMany({
      where: {
        components: {
          not: Prisma.DbNull
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent submissions to avoid overwhelming the system
    });

    let fixedCount = 0;
    
    for (const submission of submissions) {
      const components = submission.components as Record<string, unknown> | null;
      
      if (!components) continue;
      
      // Check if this submission has Message Multiplier data
      const mmData = components.messageMultiplier as Record<string, unknown> | undefined;
      const componentStatus = components.componentStatus as Record<string, string> | undefined;
      
      if (!mmData || !componentStatus) continue;
      
      // Check if Message Multiplier is marked as failed but has data
      const mmStatus = componentStatus.messageMultiplier;
      if (mmStatus !== 'failed') continue;
      
      // Check if the data has milestone or persona (which means it should be considered valid)
      const hasMilestone = !!mmData.milestone;
      const hasPersona = !!mmData.persona;
      const hasVersion = !!mmData.version;
      
      // Check if it has the structure indicators but empty sub_topics (the bug we fixed)
      if ((hasMilestone || hasPersona || hasVersion) && mmData.sub_topics && Array.isArray(mmData.sub_topics) && mmData.sub_topics.length === 0) {
        console.log(`📝 Found submission ${submission.id} with potential empty content detection issue`);
        console.log(`   Status: ${mmStatus}`);
        console.log(`   Has milestone: ${hasMilestone}`);
        console.log(`   Has persona: ${hasPersona}`);
        console.log(`   Has version: ${hasVersion}`);
        console.log(`   Sub topics length: ${mmData.sub_topics.length}`);
        
        // Fix: Update the status to completed since it has valid structure indicators
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
        
        console.log(`   ✅ Fixed submission ${submission.id}\n`);
        fixedCount++;
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} submissions with the Message Multiplier empty content detection issue!`);
    console.log('\n💡 Note: Refresh your browser to see the changes for affected submissions.');
    
  } catch (error) {
    console.error('❌ Error fixing submissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSubmissions();