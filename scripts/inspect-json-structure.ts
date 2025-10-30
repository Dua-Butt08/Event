import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectMessageMultiplierJSON() {
  try {
    const submission = await prisma.formSubmission.findFirst({
      where: {
        id: 'cmhak6jpk0000omthuko4dbkw' // The submission ID from the screenshot
      }
    });

    if (!submission) {
      console.log('Submission not found');
      return;
    }

    console.log('\\n' + '='.repeat(80));
    console.log('RAW DATABASE FIELD INSPECTION');
    console.log('='.repeat(80) + '\\n');

    const components = submission.components;
    console.log('Type of components:', typeof components);
    console.log('Is components null?', components === null);
    console.log('Is components an object?', typeof components === 'object');
    console.log('\\n');

    if (typeof components === 'string') {
      console.log('\u26a0\ufe0f  WARNING: components is stored as a STRING in database!');
      console.log('This needs to be parsed as JSON first.\\n');
      
      try {
        const parsed = JSON.parse(components);
        console.log('Parsed components keys:', Object.keys(parsed));
        
        if (parsed.messageMultiplier) {
          console.log('\\nMessage Multiplier found!');
          console.log('Type:', typeof parsed.messageMultiplier);
          
          if (typeof parsed.messageMultiplier === 'string') {
            console.log('\u26a0\ufe0f  WARNING: messageMultiplier is ALSO a string!');
            console.log('Needs double-parsing!\\n');
            
            const doubleParsed = JSON.parse(parsed.messageMultiplier);
            console.log('Double-parsed structure:', JSON.stringify(doubleParsed, null, 2));
          } else {
            console.log('Message Multiplier structure:', JSON.stringify(parsed.messageMultiplier, null, 2));
          }
        }
      } catch (error) {
        console.error('Failed to parse components:', error);
      }
    } else if (components && typeof components === 'object') {
      console.log('\u2705 components is a proper object');
      const componentsObj = components as Record<string, unknown>;
      console.log('Components keys:', Object.keys(componentsObj));
      
      if (componentsObj.messageMultiplier) {
        console.log('\\nMessage Multiplier found!');
        console.log('Type:', typeof componentsObj.messageMultiplier);
        
        if (typeof componentsObj.messageMultiplier === 'string') {
          console.log('\u26a0\ufe0f  WARNING: messageMultiplier value is a STRING!');
          console.log('Needs parsing!\\n');
          
          try {
            const parsed = JSON.parse(componentsObj.messageMultiplier as string);
            console.log('Parsed Message Multiplier:', JSON.stringify(parsed, null, 2));
          } catch (error) {
            console.error('Failed to parse messageMultiplier:', error);
          }
        } else {
          console.log('\\nMessage Multiplier structure:');
          console.log(JSON.stringify(componentsObj.messageMultiplier, null, 2));
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectMessageMultiplierJSON();
