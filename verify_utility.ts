
import { getColorInfo } from './src/mcp/tools/query/getColorInfo.js';
import { validatePrintSafe } from './src/mcp/tools/validate/validatePrintSafe.js';
import { validateWcagContrast } from './src/mcp/tools/validate/validateWcagContrast.js';

async function test() {
  console.log('--- Testing get-color-info Enhancements ---');
  try {
    const info = await getColorInfo({ color: '#0066CC' });
    console.log('CMYK:', info.formats.cmyk);
    console.log('Contrast with White:', info.analysis.contrastWithWhite);
    console.log('Contrast with Black:', info.analysis.contrastWithBlack);
  } catch (e) {
    console.error('get-color-info error:', e);
  }

  console.log('\n--- Testing validate-print-safe Fix ---');
  try {
    // Neon green is out of CMYK gamut
    const printSafe = await validatePrintSafe({ color: '#00FF00' });
    console.log('Print Safe:', printSafe.printSafe);
    console.log('Gamut Mapping:', printSafe.gamutMapping?.cmyk);
    console.log('Note:', printSafe.gamutMapping?.note);
  } catch (e) {
    console.error('validate-print-safe error:', e);
  }

  console.log('\n--- Testing validate-wcag-contrast UI Component ---');
  try {
    // A color with contrast ~3.5:1 against white (fails text AA (4.5), passes UI (3.0))
    // #959595 against #FFFFFF is ~2.8:1 (fail)
    // #767676 against #FFFFFF is ~4.54:1 (pass text)
    // #949494 against #FFFFFF is ~3.0:1
    const wcag = await validateWcagContrast({
      foreground: '#949494',
      background: '#FFFFFF',
      componentType: 'ui-component'
    });
    console.log('Result:', wcag.result); // Should mention UI/Non-text?
    // Actually validateWcagContrast result string is for TEXT.
    // Non-text result is in nonTextContrast field.
    console.log('Non-text Result:', wcag.nonTextContrast);
    console.log('All Levels:', wcag.allLevels);
  } catch (e) {
    console.error('validate-wcag-contrast error:', e);
  }
}

test();
