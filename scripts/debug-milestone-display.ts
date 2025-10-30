#!/usr/bin/env ts-node
/**
 * Debug script to understand milestone display issues
 */

// Test data from your test.json
const testData = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations, frequently experiencing guilt, burnout and pressure to perform at unattainable standards. Likely between the ages of 30–45, she is introspective, intent on doing what's best for her children, yet often lacks adequate support."
  },
  "milestone": {
    "title": "Dismantling the 'Supermom' Myth",
    "theme": "Challenging societal and internalised parenting ideals",
    "order": 1
  },
  "sub_topics": [],
  "meta": {
    "source_char_count": 13881,
    "extraction_notes": [
      "Persona was inferred based on content focus on working mothers and emotional burden.",
      "Milestone title extracted directly from markdown.",
      "Milestone order taken from 1.1 marker.",
      "Each sub-topic corresponds with 1.1.x headings.",
      "Sub-sub-topics were generated per instruction, expanding each provided sub-topic heading."
    ],
    "confidence": 0.98
  }
};

// Test with array of milestones
const testDataWithMultipleMilestones = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations..."
  },
  "milestones": [
    {
      "title": "Dismantling the 'Supermom' Myth",
      "theme": "Challenging societal and internalised parenting ideals",
      "order": 1
    },
    {
      "title": "Building Sustainable Support Systems",
      "theme": "Creating networks and resources for long-term success",
      "order": 2
    }
  ],
  "sub_topics": [],
  "meta": {
    "source_char_count": 13881,
    "extraction_notes": [
      "Persona was inferred based on content focus on working mothers and emotional burden.",
    ],
    "confidence": 0.98
  }
};

// Simulate the display logic
function simulateMilestoneDisplay(data: Record<string, unknown>) {
  // Current logic (single milestone)
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  
  // New logic (handle both single milestone and array of milestones)
  let milestones: { title?: string; theme?: string; order?: number }[] = [];
  
  if (data.milestone) {
    // Single milestone
    milestones = [data.milestone as { title?: string; theme?: string; order?: number }];
  } else if (data.milestones && Array.isArray(data.milestones)) {
    // Array of milestones
    milestones = data.milestones as { title?: string; theme?: string; order?: number }[];
  }
  
  console.log('=== Milestone Display Debug ===');
  console.log('Data structure:');
  console.log(`  Single milestone: ${!!data.milestone}`);
  console.log(`  Milestones array: ${!!data.milestones} (${Array.isArray(data.milestones) ? data.milestones.length : 0} items)`);
  console.log(`  Extracted milestones: ${milestones.length}`);
  
  console.log('\nCurrent display logic (single milestone):');
  if (milestone) {
    console.log(`  Title: ${milestone.title}`);
    console.log(`  Theme: ${milestone.theme}`);
    console.log(`  Order: ${milestone.order}`);
  } else {
    console.log('  No milestone found');
  }
  
  console.log('\nNew display logic (multiple milestones):');
  if (milestones.length > 0) {
    milestones.forEach((m, index) => {
      console.log(`  Milestone ${index + 1}:`);
      console.log(`    Title: ${m.title}`);
      console.log(`    Theme: ${m.theme}`);
      console.log(`    Order: ${m.order}`);
    });
  } else {
    console.log('  No milestones found');
  }
  
  // Check if persona exists
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  console.log(`\nPersona: ${!!persona} (${persona?.name})`);
}

console.log('Testing with single milestone data:');
simulateMilestoneDisplay(testData);

console.log('\n===============================================\n');

console.log('Testing with multiple milestones data:');
simulateMilestoneDisplay(testDataWithMultipleMilestones);