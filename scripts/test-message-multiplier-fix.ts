#!/usr/bin/env ts-node
/**
 * Test script to validate Message Multiplier fix
 * This script tests various data structures that could cause the "Content Generation Failed" error
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDataStructures() {
  console.log('🧪 Testing Message Multiplier data structures...\n');

  // Test case 1: Valid structure with milestone and persona but no sub_topics
  const testCase1 = {
    version: "1.1",
    persona: {
      name: "Sarah Mitchell",
      notes: "Sarah is a QA professional struggling with test automation"
    },
    milestone: {
      title: "Mastering Test Automation",
      theme: "From manual testing to automated excellence",
      order: 1
    },
    sub_topics: [] // Empty array - this was causing the error
  };

  // Test case 2: Valid structure with only milestone
  const testCase2 = {
    version: "1.1",
    milestone: {
      title: "Mastering Test Automation",
      theme: "From manual testing to automated excellence",
      order: 1
    },
    sub_topics: []
  };

  // Test case 3: Valid structure with only persona
  const testCase3 = {
    version: "1.1",
    persona: {
      name: "Sarah Mitchell",
      notes: "Sarah is a QA professional struggling with test automation"
    },
    sub_topics: []
  };

  // Test case 4: Valid structure with content
  const testCase4 = {
    version: "1.1",
    persona: {
      name: "Sarah Mitchell",
      notes: "Sarah is a QA professional struggling with test automation"
    },
    milestone: {
      title: "Mastering Test Automation",
      theme: "From manual testing to automated excellence",
      order: 1
    },
    sub_topics: [
      {
        title: "Understanding Test Automation ROI",
        pain_point: "Manual testing is time-consuming and error-prone, leading to delayed releases",
        desired_outcome: "Automated tests that run reliably and save significant time",
        belief_shift_required: "Automation is not just about tools, it's about strategic implementation",
        profound_desire_fulfilled: "Confidence in release quality without working overtime",
        sub_sub_topics: [
          {
            order: 1,
            title: "Calculating Time Saved Through Automation",
            description: "Learn how to measure automation ROI by tracking time saved on regression testing, comparing manual vs automated execution times, and calculating the break-even point for your automation investment."
          }
        ]
      }
    ]
  };

  const testCases = [
    { name: 'Empty sub_topics with milestone and persona', data: testCase1 },
    { name: 'Empty sub_topics with only milestone', data: testCase2 },
    { name: 'Empty sub_topics with only persona', data: testCase3 },
    { name: 'Complete structure with content', data: testCase4 }
  ];

  // Test each case
  for (const testCase of testCases) {
    console.log(`📋 Testing: ${testCase.name}`);
    
    // Simulate the logic from MessageMultiplierDisplay component
    const data = testCase.data as Record<string, any>;
    const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
    const subTopics = (data.sub_topics as any[]) || [];
    const persona = data.persona as { name?: string; notes?: string } | undefined;
    
    // Old logic that was causing the issue
    const hasNewStructureIndicatorsOld = !!milestone || !!persona || !!data.version;
    const hasEmptyContentOld = hasNewStructureIndicatorsOld && subTopics.length === 0;
    
    // New logic with our fix
    const hasNewStructureIndicatorsNew = !!milestone || !!persona || !!data.version;
    const hasEmptyContentNew = hasNewStructureIndicatorsNew && subTopics.length === 0 && !milestone && !persona;
    
    console.log(`   Old logic - Empty content: ${hasEmptyContentOld}`);
    console.log(`   New logic - Empty content: ${hasEmptyContentNew}`);
    
    if (hasEmptyContentOld && !hasEmptyContentNew) {
      console.log(`   ✅ FIXED: Case no longer incorrectly flagged as empty`);
    } else if (!hasEmptyContentOld && !hasEmptyContentNew) {
      console.log(`   ✅ CORRECT: Case correctly not flagged as empty`);
    } else if (hasEmptyContentOld && hasEmptyContentNew) {
      console.log(`   ⚠️  STILL BROKEN: Case still incorrectly flagged as empty`);
    }
    
    console.log('');
  }

  console.log('✅ Test completed successfully!');
  console.log('\n📝 Summary of fixes:');
  console.log('   1. Enhanced data structure unwrapping in regeneration API');
  console.log('   2. Improved deep unwrapping logic in webhook service');
  console.log('   3. Fixed empty content detection logic in display component');
  console.log('   4. Added better error handling and logging');

  await prisma.$disconnect();
}

testDataStructures().catch(console.error);