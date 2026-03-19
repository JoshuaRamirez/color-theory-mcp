
import { parseColorString } from './src/mcp/tools/convert/parseColorString.js';

async function test() {
  const inputs = [
    // CSS Color 4
    'oklch(60% 0.15 180)',
    'oklab(0.6 0.1 -0.1)',
    'color(display-p3 1 0 0)',
    'hwb(194 0% 0%)',
    
    // New syntax for existing spaces
    'rgb(255 0 0)',
    'rgb(100% 0% 0%)',
    'hsl(120deg 100% 50%)',
    'rgba(255 0 0 / 0.5)'
  ];

  console.log('--- Starting Verification ---');
  for (const input of inputs) {
    try {
      const result = await parseColorString({ color: input });
      console.log(`Input: "${input}"`);
      console.log(`Valid: ${result.valid}`);
      console.log(`Format: ${result.detectedFormat}`);
      if (!result.valid) {
        console.log(`Error: ${result.error}`);
      }
      console.log('---');
    } catch (e) {
      console.log(`Exception for "${input}":`, e);
    }
  }
}

test();
