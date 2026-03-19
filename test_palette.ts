
import { generatePalette } from './src/mcp/tools/generate/generatePalette.js';

async function test() {
  const scenarios = [
    { name: 'Professional Blue', color: '#0066CC', style: 'professional' },
    { name: 'Pastel Pink', color: '#FFB6C1', style: 'pastel' },
    { name: 'Muted Earth', color: '#8B4513', style: 'earth' },
    { name: 'Neon Lime', color: '#39FF14', style: 'neon' }
  ];

  console.log('--- Semantic Palette Verification ---');

  for (const scenario of scenarios) {
    console.log(`\nScenario: ${scenario.name} (${scenario.color}, ${scenario.style})`);
    try {
      const result = await generatePalette({
        baseColor: scenario.color,
        style: scenario.style as any,
        includeNeutrals: false
      });

      console.log('Semantic Roles:');
      console.log(`  Error:   ${result.semantic.error.base}`);
      console.log(`  Success: ${result.semantic.success.base}`);
      console.log(`  Warning: ${result.semantic.warning.base}`);
      console.log(`  Info:    ${result.semantic.info.base}`);
    } catch (e) {
      console.log('Error:', e);
    }
  }
}

test();
