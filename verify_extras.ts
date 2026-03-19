
import { generatePalette } from './src/mcp/tools/generate/generatePalette.js';
import { validateWcagContrast } from './src/mcp/tools/validate/validateWcagContrast.js';

async function test() {
  console.log('--- Testing Palette Exports ---');
  try {
    const palette = await generatePalette({
      baseColor: '#663399',
      style: 'vibrant',
      harmony: 'split-complementary' // Testing override
    });
    console.log('Style:', palette.style);
    console.log('Harmony Override:', palette.harmony);
    console.log('Exports present:', Object.keys(palette.exports || {}));
    console.log('CSS Preview:\n', palette.exports?.css.substring(0, 100) + '...');
  } catch (e) {
    console.error('Palette error:', e);
  }

  console.log('\n--- Testing APCA in Contrast Validator ---');
  try {
    const contrast = await validateWcagContrast({
      foreground: '#767676',
      background: '#FFFFFF'
    });
    console.log('WCAG Ratio:', contrast.contrast.ratio);
    console.log('APCA Lc:', contrast.apca?.Lc);
    console.log('APCA Rating:', contrast.apca?.rating);
    console.log('APCA Note:', contrast.apca?.note);
  } catch (e) {
    console.error('Contrast error:', e);
  }
}

test();
