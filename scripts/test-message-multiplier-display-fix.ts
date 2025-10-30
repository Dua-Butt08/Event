#!/usr/bin/env ts-node
/**
 * Test script to validate Message Multiplier display fix
 * This script tests the specific scenario where milestone and persona exist but sub_topics is empty
 */

// Mock data structure similar to what you provided
const mockMessageMultiplierData = {
  "payload": {
    "role": "assistant",
    "content": {
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
    }
  }
};

// Simulate the unwrapping logic from the MessageMultiplierDisplay component
function unwrapData(data: Record<string, unknown>): Record<string, unknown> {
  let unwrappedData = data;
  
  // Handle assistant/content wrapper
  if (unwrappedData.role === 'assistant' && unwrappedData.content && typeof unwrappedData.content === 'object') {
    console.log('Unwrapping assistant/content wrapper');
    unwrappedData = unwrappedData.content as Record<string, unknown>;
  }

  // Handle payload wrapper
  if (unwrappedData.payload && typeof unwrappedData.payload === 'object' && !unwrappedData.sub_topics && !unwrappedData.topics && !unwrappedData.milestone) {
    console.log('Unwrapping payload wrapper');
    unwrappedData = unwrappedData.payload as Record<string, unknown>;
  }
  
  // Handle content wrapper without role
  if (unwrappedData.content && typeof unwrappedData.content === 'object' && !unwrappedData.sub_topics && !unwrappedData.topics && !unwrappedData.milestone) {
    console.log('Unwrapping content wrapper');
    unwrappedData = unwrappedData.content as Record<string, unknown>;
  }
  
  return unwrappedData;
}

// Simulate the structure detection logic
function analyzeStructure(data: Record<string, unknown>) {
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  const subTopics = (data.sub_topics as any[]) || [];
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  const legacyTopics = (data.topics as any[]) || [];
  
  // OLD logic (incorrect)
  const isNewStructureOld = (!!milestone || !!persona || !!data.version) && subTopics.length > 0;
  
  // NEW logic (correct)
  const isNewStructureNew = !!milestone || !!persona || !!data.version;
  
  const hasNewStructureIndicators = !!milestone || !!persona || !!data.version;
  const hasEmptyContentOld = hasNewStructureIndicators && subTopics.length === 0;
  const hasEmptyContentNew = hasNewStructureIndicators && subTopics.length === 0 && !milestone && !persona;
  
  console.log('=== Message Multiplier Structure Analysis ===');
  console.log('Data structure:');
  console.log(`  Milestone: ${!!milestone} (${milestone?.title})`);
  console.log(`  Persona: ${!!persona} (${persona?.name})`);
  console.log(`  Version: ${!!data.version} (${data.version})`);
  console.log(`  Sub Topics: ${subTopics.length}`);
  console.log(`  Legacy Topics: ${legacyTopics.length}`);
  
  console.log('\nOLD Logic:');
  console.log(`  isNewStructure: ${isNewStructureOld}`);
  console.log(`  hasEmptyContent: ${hasEmptyContentOld}`);
  console.log(`  Result: ${isNewStructureOld ? 'Show Content' : hasEmptyContentOld ? 'Show Error' : 'Show Legacy'}`);
  
  console.log('\nNEW Logic:');
  console.log(`  isNewStructure: ${isNewStructureNew}`);
  console.log(`  hasEmptyContent: ${hasEmptyContentNew}`);
  console.log(`  Result: ${isNewStructureNew ? 'Show Content' : hasEmptyContentNew ? 'Show Error' : 'Show Legacy'}`);
  
  if (!isNewStructureOld && isNewStructureNew) {
    console.log('\n✅ FIX VALIDATED: Data will now show content instead of error');
  } else if (isNewStructureOld === isNewStructureNew) {
    console.log('\nℹ️  No change in behavior for this data structure');
  }
}

// Test with the mock data
console.log('Testing with complex nested structure...\n');
const unwrappedData = unwrapData(mockMessageMultiplierData);
analyzeStructure(unwrappedData);

console.log('\n===============================================\n');

// Test with simplified structure (what should happen after unwrapping)
console.log('Testing with simplified structure (after unwrapping)...\n');
const simplifiedData = {
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

analyzeStructure(simplifiedData);