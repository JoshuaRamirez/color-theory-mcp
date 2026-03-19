
import { generateDesignTokens } from './src/mcp/tools/generate/generateDesignTokens.js';

async function test() {
  const colors = [
    { name: 'primary-500', value: '#3B82F6' },
    { name: 'error', value: '#EF4444' }
  ];

  console.log('--- iOS Swift ---');
  const swift = await generateDesignTokens({ colors, format: 'ios-swift' });
  console.log(swift.swift);

  console.log('\n--- Android XML ---');
  const android = await generateDesignTokens({ colors, format: 'android-xml' });
  console.log(android.xml);

  console.log('\n--- SCSS ---');
  const scss = await generateDesignTokens({ colors, format: 'scss', prefix: 'theme' });
  console.log(scss.scss);
  
  console.log('\n--- Figma JSON ---');
  const figma = await generateDesignTokens({ colors, format: 'figma-json' });
  console.log(JSON.stringify(figma.json, null, 2));
}

test();
