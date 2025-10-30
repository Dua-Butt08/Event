#!/usr/bin/env ts-node
/**
 * Test script to validate Message Multiplier content display fix
 * This script tests that milestone and persona information is displayed even with empty sub_topics
 */

// Mock data structure similar to what you provided
const mockDataWithoutSubtopics = {
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

// Simulate what the display component does
function simulateDisplay(data: Record<string, unknown>) {
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  const subTopics = (data.sub_topics as any[]) || [];
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  
  console.log('=== Message Multiplier Display Simulation ===');
  console.log('Data structure:');
  console.log(`  Milestone: ${!!milestone} (${milestone?.title})`);
  console.log(`  Persona: ${!!persona} (${persona?.name})`);
  console.log(`  Sub Topics: ${subTopics.length}`);
  
  // Check if we have valid structure indicators
  const hasValidStructure = !!milestone || !!persona || !!data.version;
  console.log(`\nHas valid structure: ${hasValidStructure}`);
  
  if (hasValidStructure) {
    console.log('\n--- Content that should be displayed ---');
    
    // Display milestone information
    if (milestone) {
      console.log(`\nMILESTONE SECTION:`);
      console.log(`  Title: ${milestone.title}`);
      if (milestone.theme) {
        console.log(`  Theme: ${milestone.theme}`);
      }
    }
    
    // Display persona information
    if (persona) {
      console.log(`\nPERSONA SECTION:`);
      console.log(`  Name: ${persona.name}`);
      if (persona.notes) {
        console.log(`  Notes: ${persona.notes.substring(0, 100)}...`);
      }
    }
    
    // Display subtopics (if any)
    if (subTopics.length > 0) {
      console.log(`\nSUBTOPICS SECTION:`);
      subTopics.forEach((subTopic: any, index: number) => {
        console.log(`  ${index + 1}. ${subTopic.title}`);
      });
    } else {
      console.log(`\nSUBTOPICS SECTION:`);
      console.log(`  No subtopics available`);
    }
    
    console.log('\n✅ Content would be displayed (not showing error message)');
  } else {
    console.log('\n❌ Would show "Content Generation Failed" error');
  }
}

// Test with your specific data
simulateDisplay(mockDataWithoutSubtopics);

console.log('\n===============================================\n');

// Test with data that has subtopics
const dataWithSubtopics = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations..."
  },
  "milestone": {
    "title": "Dismantling the 'Supermom' Myth",
    "theme": "Challenging societal and internalised parenting ideals",
    "order": 1
  },
  "sub_topics": [
    {
      "title": "Understanding Test Automation ROI",
      "pain_point": "Manual testing is time-consuming and error-prone...",
      "desired_outcome": "Automated tests that run reliably and save significant time..."
    }
  ]
};

console.log('Testing with data that includes subtopics:');
simulateDisplay(dataWithSubtopics);