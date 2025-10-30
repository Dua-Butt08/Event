#!/usr/bin/env ts-node
/**
 * Test script to validate enhanced milestone display logic
 */

// Test data from your test.json (single milestone)
const singleMilestoneData = {
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

// Test data with multiple milestones
const multipleMilestonesData = {
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
    },
    {
      "title": "Embracing Imperfect Progress",
      "theme": "Shifting from perfectionism to sustainable growth",
      "order": 3
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

// Test data with no milestones
const noMilestonesData = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations..."
  },
  "sub_topics": [],
  "meta": {
    "source_char_count": 13881,
    "extraction_notes": [
      "Persona was inferred based on content focus on working mothers and emotional burden.",
    ],
    "confidence": 0.98
  }
};

// Simulate the enhanced display logic
function simulateEnhancedMilestoneDisplay(data: Record<string, unknown>, testName: string) {
  console.log(`=== ${testName} ===`);
  
  // Extract data
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  const milestones = data.milestones as { title?: string; theme?: string; order?: number }[] | undefined;
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  
  console.log('Data structure:');
  console.log(`  Single milestone: ${!!milestone}`);
  console.log(`  Milestones array: ${!!milestones} (${Array.isArray(milestones) ? milestones.length : 0} items)`);
  console.log(`  Persona: ${!!persona}`);
  
  // Enhanced display logic
  const hasMilestoneContent = (milestone || (milestones && Array.isArray(milestones) && milestones.length > 0));
  console.log(`\nHas milestone content: ${hasMilestoneContent}`);
  
  if (hasMilestoneContent || persona) {
    console.log('\n--- Display Content ---');
    
    // Handle single milestone
    if (milestone) {
      console.log(`\nSINGLE MILESTONE:`);
      console.log(`  Title: ${milestone.title}`);
      console.log(`  Theme: ${milestone.theme}`);
      console.log(`  Order: ${milestone.order}`);
    }
    
    // Handle multiple milestones
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      console.log(`\nMULTIPLE MILESTONES:`);
      milestones.forEach((m, index) => {
        console.log(`  Milestone ${index + 1}:`);
        console.log(`    Title: ${m.title}`);
        console.log(`    Theme: ${m.theme}`);
        console.log(`    Order: ${m.order}`);
      });
    }
    
    // Handle persona
    if (persona) {
      console.log(`\nPERSONA:`);
      console.log(`  Name: ${persona.name}`);
      if (persona.notes) {
        console.log(`  Notes: ${persona.notes.substring(0, 80)}...`);
      }
    }
    
    console.log('\n✅ Content would be displayed');
  } else {
    console.log('\n❌ Would show "Content Generation Failed" error');
  }
  
  console.log('\n');
}

// Run tests
simulateEnhancedMilestoneDisplay(singleMilestoneData, 'Single Milestone Test');
simulateEnhancedMilestoneDisplay(multipleMilestonesData, 'Multiple Milestones Test');
simulateEnhancedMilestoneDisplay(noMilestonesData, 'No Milestones Test');