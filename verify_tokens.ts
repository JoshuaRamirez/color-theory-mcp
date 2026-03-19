
import { generateDesignTokens } from './src/mcp/tools/generate/generateDesignTokens.js';

async function test() {
  const colors = [
    { name: 'primary-500', value: '#3B82F6' },
    { name: 'error', value: '#EF4444' }
  ];

  console.log('--- iOS Swift ---');
  console.log((await generateDesignTokens({ colors, format: 'ios-swift' })).swift);

  console.log('\n--- Android XML ---');
  console.log((await generateDesignTokens({ colors, format: 'android-xml' })).xml);

  console.log('\n--- SCSS ---');
  console.log((await generateDesignTokens({ colors, format: 'scss', prefix: 'theme' })).scss);
}

test();
