/**
 * Test script to manually update a submission with Message Multiplier data
 * Run with: npx ts-node scripts/test-message-multiplier-update.ts <submissionId>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMessageMultiplier(submissionId: string) {
  try {
    // Sample Message Multiplier data with proper structure
    const messageMultiplierData = {
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
            },
            {
              order: 2,
              title: "Building a Sustainable Test Strategy",
              description: "Create a comprehensive automation framework from scratch, focusing on maintainability, scalability, and long-term value rather than short-term gains."
            }
          ]
        },
        {
          title: "Selecting the Right Automation Tools",
          pain_point: "Overwhelmed by tool choices and marketing claims, leading to poor decisions",
          desired_outcome: "A clear framework for evaluating and selecting tools that fit specific needs",
          belief_shift_required: "The best tool is not the most popular one, but the one that fits your context",
          profound_desire_fulfilled: "Confidence in tooling decisions and team buy-in",
          sub_sub_topics: [
            {
              order: 1,
              title: "Evaluation Criteria Beyond Marketing Hype",
              description: "Develop a systematic approach to tool evaluation based on technical requirements, team skills, budget constraints, and long-term maintainability."
            },
            {
              order: 2,
              title: "Open Source vs Commercial Solutions",
              description: "Understand the trade-offs between open source and commercial tools, including total cost of ownership, support requirements, and community ecosystem."
            }
          ]
        }
      ]
    };

    // Get existing submission
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      console.error(`❌ Submission not found: ${submissionId}`);
      return;
    }

    console.log(`📝 Found submission: ${submission.id} (${submission.kind})`);

    // Parse existing components
    const components = (submission.components as Record<string, unknown>) || {};
    const componentStatus = (components.componentStatus as Record<string, string>) || {};

    // Update with Message Multiplier data
    const updatedComponents = {
      ...components,
      messageMultiplier: messageMultiplierData,
      componentStatus: {
        ...componentStatus,
        messageMultiplier: 'completed'
      }
    };

    // Update in database
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        components: updatedComponents
      }
    });

    console.log('✅ Successfully updated Message Multiplier data');
    console.log('📊 Data structure:');
    console.log(`   - Milestone: ${messageMultiplierData.milestone.title}`);
    console.log(`   - Persona: ${messageMultiplierData.persona.name}`);
    console.log(`   - Sub Topics: ${messageMultiplierData.sub_topics.length}`);
    console.log(`   - Sub-Sub Topics: ${messageMultiplierData.sub_topics.reduce((acc, t) => acc + (t.sub_sub_topics?.length || 0), 0)}`);
    console.log('\n🔗 View at: /results/message-multiplier?id=' + submissionId);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get submission ID from command line
const submissionId = process.argv[2];

if (!submissionId) {
  console.error('Usage: npx ts-node scripts/test-message-multiplier-update.ts <submissionId>');
  process.exit(1);
}

updateMessageMultiplier(submissionId);
