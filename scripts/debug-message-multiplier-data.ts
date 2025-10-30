import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugMessageMultiplierData() {
  try {
    console.log('🔍 Searching for submissions with Message Multiplier data...\n');

    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (submissions.length === 0) {
      console.log('❌ No submissions found');
      return;
    }

    for (const submission of submissions) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📝 Submission ID: ${submission.id}`);
      console.log(`📅 Created: ${submission.createdAt}`);
      console.log(`${'='.repeat(80)}\n`);

      const components = submission.components as Record<string, unknown> | null;
      
      if (!components) {
        console.log('  ⚠️  No components found');
        continue;
      }

      console.log(`  Available component keys:`, Object.keys(components));

      // Try to find Message Multiplier data
      const possibleKeys = [
        'messageMultiplier',
        'MessageMultiplier',
        'the-message-multiplier',
        'message-multiplier'
      ];

      let mmData: Record<string, unknown> | null = null;
      let foundKey: string | null = null;

      for (const key of possibleKeys) {
        if (components[key]) {
          mmData = components[key] as Record<string, unknown>;
          foundKey = key;
          break;
        }
      }

      if (!mmData) {
        console.log('  ❌ No Message Multiplier data found\n');
        continue;
      }

      console.log(`  ✅ Found Message Multiplier data at key: "${foundKey}"\n`);

      // Analyze structure
      console.log('  📊 Data Structure Analysis:');
      console.log('  ' + '-'.repeat(70));
      console.log(`  Top-level keys: ${Object.keys(mmData).join(', ')}`);
      
      // Check for wrappers
      if (mmData.role && mmData.content) {
        console.log(`  ⚠️  Detected wrapper: { role: "${mmData.role}", content: {...} }`);
        mmData = mmData.content as Record<string, unknown>;
        console.log(`  📦 Unwrapped. New keys: ${Object.keys(mmData).join(', ')}`);
      }

      if (mmData.payload && typeof mmData.payload === 'object') {
        console.log(`  ⚠️  Detected payload wrapper`);
        mmData = mmData.payload as Record<string, unknown>;
        console.log(`  📦 Unwrapped. New keys: ${Object.keys(mmData).join(', ')}`);
      }

      // Check structure indicators
      console.log(`\n  🏗️  Structure Indicators:`);
      console.log(`  - Has milestone: ${!!mmData.milestone}`);
      console.log(`  - Has persona: ${!!mmData.persona}`);
      console.log(`  - Has version: ${!!mmData.version}`);
      console.log(`  - Has header: ${!!mmData.header}`);
      
      // Check content
      console.log(`\n  📝 Content Analysis:`);
      if (mmData.sub_topics) {
        const subTopics = mmData.sub_topics as unknown[];
        console.log(`  - sub_topics: Array(${subTopics.length})`);
        if (subTopics.length > 0) {
          console.log(`    First topic keys:`, Object.keys(subTopics[0] as object));
        } else {
          console.log(`    ⚠️  EMPTY ARRAY - This is the issue!`);
        }
      } else {
        console.log(`  - sub_topics: NOT FOUND`);
      }

      if (mmData.topics) {
        const topics = mmData.topics as unknown[];
        console.log(`  - topics (legacy): Array(${topics.length})`);
        if (topics.length > 0) {
          console.log(`    First topic keys:`, Object.keys(topics[0] as object));
        }
      } else {
        console.log(`  - topics (legacy): NOT FOUND`);
      }

      // Check component status
      const componentStatus = components.componentStatus as Record<string, string> | undefined;
      if (componentStatus) {
        console.log(`\n  📊 Component Status:`);
        console.log(`  - messageMultiplier: ${componentStatus.messageMultiplier || 'NOT SET'}`);
      }

      // Raw data preview (first 500 chars)
      console.log(`\n  🔍 Raw Data Preview (first 500 chars):`);
      const jsonStr = JSON.stringify(mmData, null, 2);
      console.log(`  ${jsonStr.substring(0, 500)}...`);
      console.log(`\n  Total JSON length: ${jsonStr.length} characters`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMessageMultiplierData();
