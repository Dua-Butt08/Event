#!/usr/bin/env ts-node
/**
 * Test script to validate updated display order (persona first, then milestones)
 */

// Test data with persona and single milestone
const personaAndSingleMilestone = {
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
  "sub_topics": [],
  "meta": {
    "confidence": 0.98
  }
};

// Test data with persona and multiple milestones
const personaAndMultipleMilestones = {
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

// Test data with only persona
const onlyPersona = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations."
  },
  "sub_topics": [],
  "meta": {
    "confidence": 0.98
  }
};

// Test data with only milestones
const onlyMilestones = {
  "version": "1.1",
  "milestone": {
    "title": "Dismantling the 'Supermom' Myth",
    "theme": "Challenging societal and internalised parenting ideals",
    "order": 1
  },
  "sub_topics": [],
  "meta": {
    "confidence": 0.98
  }
};

// Test data with subtopics
const withSubtopics = {
  "version": "1.1",
  "persona": {
    "name": "Overwhelmed Modern Mother",
    "notes": "A mother juggling work, parenting and societal expectations."
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

// Simulate the updated display logic
function simulateUpdatedDisplay(data: Record<string, unknown>, testName: string) {
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
  
  // Updated display logic
  const hasMilestoneContent = (milestone || (milestones && Array.isArray(milestones) && milestones.length > 0));
  console.log(`\nHas milestone content: ${!!hasMilestoneContent}`);
  
  if (hasMilestoneContent || persona) {
    console.log('\n--- Display Order ---');
    
    // Persona first (if exists)
    if (persona) {
      console.log(`1. PERSONA:`);
      console.log(`   Name: ${persona.name}`);
      if (persona.notes) {
        console.log(`   Notes: ${persona.notes.substring(0, 60)}...`);
      }
    }
    
    // Then milestones (if exist)
    if (milestone) {
      console.log(`2. SINGLE MILESTONE:`);
      console.log(`   Title: ${milestone.title}`);
      console.log(`   Theme: ${milestone.theme}`);
    }
    
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      console.log(`2. MULTIPLE MILESTONES:`);
      milestones.forEach((m, index) => {
        console.log(`   ${index + 1}. ${m.title}`);
        if (m.theme) {
          console.log(`      Theme: ${m.theme}`);
        }
      });
    }
    
    // Then subtopics (if exist)
    if (subTopics.length > 0) {
      console.log(`3. SUBTOPICS:`);
      console.log(`   ${subTopics.length} subtopic(s) will be displayed after milestones`);
    }
    
    console.log('\n✅ Content would be displayed in correct order');
  } else {
    console.log('\n❌ Would show "Content Generation Failed" error');
  }
  
  console.log('\n');
}

// Run tests
simulateUpdatedDisplay(personaAndSingleMilestone, 'Persona + Single Milestone');
simulateUpdatedDisplay(personaAndMultipleMilestones, 'Persona + Multiple Milestones');
simulateUpdatedDisplay(onlyPersona, 'Only Persona');
simulateUpdatedDisplay(onlyMilestones, 'Only Single Milestone');
simulateUpdatedDisplay(withSubtopics, 'Persona + Milestone + Subtopics');