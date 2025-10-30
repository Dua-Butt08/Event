/**
 * One-time script to fix submissions that received webhook data
 * but have incorrect componentStatus
 * 
 * Usage: npx ts-node scripts/fix-webhook-submission.ts <submission-id>
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSubmission(submissionId: string) {
  console.log(`\n🔧 Fixing submission: ${submissionId}\n`);

  // Get the submission
  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId }
  });

  if (!submission) {
    console.error(`❌ Submission not found: ${submissionId}`);
    process.exit(1);
  }

  console.log(`✅ Found submission`);
  console.log(`   Status: ${submission.status}`);
  console.log(`   Created: ${submission.createdAt}`);
  console.log(`   Updated: ${submission.updatedAt}\n`);

  // Parse components
  const components = (submission.components || {}) as Record<string, unknown>;
  const componentStatus = (components as { componentStatus?: Record<string, string> })?.componentStatus || {};

  console.log('Current componentStatus:');
  console.log(JSON.stringify(componentStatus, null, 2));
  console.log('');

  // Check which components have data
  const hasData = {
    audienceArchitect: Boolean(components.audienceArchitect),
    contentCompass: Boolean(components.contentCompass),
    messageMultiplier: Boolean(components.messageMultiplier),
    eventFunnel: Boolean(components.eventFunnel),
    landingPage: Boolean(components.landingPage)
  };

  console.log('Components with data:');
  Object.entries(hasData).forEach(([key, value]) => {
    console.log(`   ${key}: ${value ? '✅ YES' : '❌ NO'}`);
  });
  console.log('');

  // Parse output field if it exists (old webhook format)
  if (submission.output && typeof submission.output === 'string') {
    try {
      const outputData = JSON.parse(submission.output);
      console.log('📦 Found data in output field (old webhook format)');
      console.log('   Attempting to parse and migrate...\n');

      // Try to determine which component this data belongs to
      // This is a heuristic based on the data structure
      let componentKey: string | null = null;

      if (outputData.funnel || outputData.stages || outputData.touchpoints) {
        componentKey = 'eventFunnel';
      } else if (outputData.sections || outputData.hero || outputData.cta) {
        componentKey = 'landingPage';
      } else if (outputData.milestones || outputData.sub_topics) {
        componentKey = 'messageMultiplier';
      } else if (outputData.topics || outputData.channels) {
        componentKey = 'contentCompass';
      } else if (outputData.icp || outputData.segments || outputData.demographics) {
        componentKey = 'audienceArchitect';
      }

      if (componentKey) {
        console.log(`   🎯 Detected component: ${componentKey}`);
        console.log(`   📝 Migrating data...\n`);

        // Update components with the parsed data
        components[componentKey] = outputData;
        
        // Update componentStatus to mark as completed
        if (!components.componentStatus) {
          components.componentStatus = {};
        }
        (components.componentStatus as Record<string, string>)[componentKey] = 'completed';

        console.log('✨ Updated componentStatus:');
        console.log(JSON.stringify(components.componentStatus, null, 2));
        console.log('');
      } else {
        console.log('   ⚠️  Could not determine component type from data structure');
        console.log('   Please manually specify which component this data belongs to\n');
      }
    } catch (error) {
      console.log('   ⚠️  Output field is not valid JSON:', (error as Error).message);
    }
  }

  // Update componentStatus for any component that has data but status is 'pending'
  let needsUpdate = false;
  const updatedStatus = { ...componentStatus };

  Object.keys(hasData).forEach((key) => {
    if (hasData[key as keyof typeof hasData] && updatedStatus[key] === 'pending') {
      console.log(`   🔄 Updating ${key}: pending → completed`);
      updatedStatus[key] = 'completed';
      needsUpdate = true;
    }
  });

  if (needsUpdate || submission.output) {
    console.log('\n💾 Saving changes to database...');

    components.componentStatus = updatedStatus;

    // Check if all components are completed
    const allCompleted = Object.values(updatedStatus).every(
      status => status === 'completed' || status === 'not_requested'
    );

    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        components: components as unknown as Prisma.InputJsonValue,
        status: allCompleted ? 'completed' : 'pending'
      }
    });

    console.log('✅ Submission updated successfully!');
    console.log(`   Overall status: ${allCompleted ? 'completed' : 'pending'}`);
  } else {
    console.log('\n✨ No changes needed - submission is already correct!');
  }

  console.log('\n🎉 Done!\n');
}

// Get submission ID from command line
const submissionId = process.argv[2];

if (!submissionId) {
  console.error('\n❌ Usage: npx ts-node scripts/fix-webhook-submission.ts <submission-id>\n');
  process.exit(1);
}

fixSubmission(submissionId)
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    prisma.$disconnect();
    process.exit(1);
  });
