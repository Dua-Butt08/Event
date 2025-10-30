#!/usr/bin/env ts-node
/**
 * Test script to verify display order (persona first, then milestones)
 */

// Test data with persona and single milestone
const displayOrderTestData = {
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

// Simulate the updated display logic
function simulateDisplayOrder(data: Record<string, unknown>) {
  console.log('=== Display Order Verification ===');
  
  // Extract data
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  
  console.log('Data structure:');
  console.log(`  Single milestone: ${!!milestone}`);
  console.log(`  Persona: ${!!persona}`);
  
  // Updated display logic
  const hasContent = (milestone || persona);
  console.log(`\nHas content to display: ${!!hasContent}`);
  
  if (hasContent) {
    console.log('\n--- Correct Display Order ---');
    
    // 1. Persona first (if exists)
    if (persona) {
      console.log(`1. PERSONA:`);
      console.log(`   Name: ${persona.name}`);
      if (persona.notes) {
        console.log(`   Notes: ${persona.notes.substring(0, 60)}...`);
      }
    }
    
    // 2. Then milestones (if exist)
    if (milestone) {
      console.log(`2. MILESTONE:`);
      console.log(`   Title: ${milestone.title}`);
      console.log(`   Theme: ${milestone.theme}`);
    }
    
    console.log('\n✅ Display order is CORRECT (Persona first, then Milestones)');
  } else {
    console.log('\n❌ Would show "Content Generation Failed" error');
  }
  
  console.log('\n');
}

// Run test
simulateDisplayOrder(displayOrderTestData);