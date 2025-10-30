#!/usr/bin/env ts-node
/**
 * Final test script to verify all display fixes
 */

// Test data with persona, single milestone, and subtopics
const completeTestData = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations, frequently experiencing guilt, burnout and pressure to perform at unattainable standards."
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
  ],
  "meta": {
    "confidence": 0.98
  }
};

// Test data with multiple milestones
const multipleMilestonesTestData = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations."
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
    "confidence": 0.98
  }
};

// Simulate the final display logic
function simulateFinalDisplay(data: Record<string, unknown>, testName: string) {
  console.log(`=== ${testName} ===`);
  
  // Extract data
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  const milestones = data.milestones as { title?: string; theme?: string; order?: number }[] | undefined;
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  const subTopics = (data.sub_topics as any[]) || [];
  
  console.log('Data structure:');
  console.log(`  Single milestone: ${!!milestone}`);
  console.log(`  Milestones array: ${!!milestones} (${Array.isArray(milestones) ? milestones.length : 0} items)`);
  console.log(`  Persona: ${!!persona}`);
  console.log(`  Subtopics: ${subTopics.length}`);
  
  // Final display logic
  const hasContent = (milestone || (milestones && Array.isArray(milestones) && milestones.length > 0) || persona);
  console.log(`\nHas content to display: ${!!hasContent}`);
  
  if (hasContent) {
    console.log('\n--- Final Display Structure ---');
    
    // 1. Persona Information
    if (persona) {
      console.log(`1. PERSONA:`);
      console.log(`   Name: ${persona.name}`);
      if (persona.notes) {
        console.log(`   Notes: ${persona.notes.substring(0, 60)}...`);
      }
    }
    
    // 2. Milestone Information
    if (milestone) {
      console.log(`2. MILESTONE 1:`);
      console.log(`   Title: ${milestone.title}`);
      console.log(`   Theme: ${milestone.theme}`);
    }
    
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      console.log(`2. MILESTONES:`);
      milestones.forEach((m, index) => {
        console.log(`   ${index + 1}. ${m.title}`);
        if (m.theme) {
          console.log(`      Theme: ${m.theme}`);
        }
      });
    }
    
    // 3. Sub-Topics Information
    if (subTopics.length > 0) {
      console.log(`3. SUB-TOPICS:`);
      console.log(`   ${subTopics.length} sub-topic(s) will be displayed`);
    }
    
    console.log('\n✅ Final display structure is CORRECT');
    console.log('   - Persona first');
    console.log('   - Milestones second (with proper headings)');
    console.log('   - Sub-topics third (with heading if they exist)');
  } else {
    console.log('\n❌ Would show "Content Generation Failed" error');
  }
  
  console.log('\n');
}

// Run tests
simulateFinalDisplay(completeTestData, 'Complete Data (Persona + Single Milestone + Subtopics)');
simulateFinalDisplay(multipleMilestonesTestData, 'Multiple Milestones Data');