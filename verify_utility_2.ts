
import { getColorInfo } from './src/mcp/tools/query/getColorInfo.js';
import { validatePaletteHarmony } from './src/mcp/tools/validate/validatePaletteHarmony.js';
import { validateWcagContrast } from './src/mcp/tools/validate/validateWcagContrast.js';

async function test() {
  console.log('--- Testing Smart Search ---');
  try {
    // "sky blue" (with space) fails parseColor, should trigger search
    const info = await getColorInfo({ color: 'sky blue' });
    console.log('Input: "sky blue"');
    console.log('Resolved to:', info.closestNamedColor.css.name);
    console.log('Search Note:', info.search?.note);
  } catch (e) {
    console.log('Smart Search Failed:', e.message);
  }

  console.log('\n--- Testing Harmony Suggestions ---');
  try {
    // Create a messy triadic palette (Red, Blue, Green-ish)
    // Red: 0, Blue: 240. Green should be 120.
    // Let's use 0, 240, and 100 (too yellow).
    const harmony = await validatePaletteHarmony({
      colors: ['#FF0000', '#0000FF', '#55FF00'] 
    });
    console.log('Detected Harmony:', harmony.harmony.detected);
    console.log('Score:', harmony.score.value);
    console.log('Suggestion Type:', harmony.suggestion?.type);
    console.log('Suggested Colors:', harmony.suggestion?.colors);
  } catch (e) {
    console.log('Harmony Suggestion Failed:', e);
  }

  console.log('\n--- Testing Background Suggestions ---');
  try {
    // Gray text on white background (fails)
    const wcag = await validateWcagContrast({
      foreground: '#999999',
      background: '#FFFFFF'
    });
    console.log('Valid:', wcag.valid);
    console.log('Foreground Suggestion:', wcag.suggestion?.hex);
    console.log('Background Suggestion:', wcag.backgroundSuggestion?.hex);
  } catch (e) {
    console.log('Background Suggestion Failed:', e);
  }
}

test();
