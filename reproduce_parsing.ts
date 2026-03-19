
import { parseColorString } from './src/mcp/tools/convert/parseColorString.js';

async function test() {
  const inputs = [
    'oklch(60% 0.15 180)',
    'color(display-p3 1 0 0)',
    'lab(50% 40 -20)',
    'hwb(194 0% 0%)'
  ];

  for (const input of inputs) {
    console.log(`Testing: ${input}`);
    try {
      const result = await parseColorString({ color: input });
      console.log('Valid:', result.valid);
      console.log('Detected Format:', result.detectedFormat);
      if (!result.valid) {
        console.log('Error:', result.error);
      }
    } catch (e) {
      console.log('Exception:', e.message);
    }
    console.log('---');
  }
}

test();
