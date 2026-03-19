
import { mixColors } from './src/mcp/tools/calculate/mixColors.js';

async function test() {
  console.log('--- Testing Blend Modes ---');
  try {
    // Multiply Red and Blue
    // RGB: (1,0,0) * (0,0,1) = (0,0,0) -> Black
    const mult = await mixColors({
      color1: '#FF0000',
      color2: '#0000FF',
      blendMode: 'multiply'
    });
    console.log('Red * Blue (Multiply):', mult.result.hex); // Should be #000000

    // Screen Red and Blue
    // RGB: 1-(1-1)*(1-0) = 1, etc -> Magenta
    const screen = await mixColors({
      color1: '#FF0000',
      color2: '#0000FF',
      blendMode: 'screen'
    });
    console.log('Red + Blue (Screen):', screen.result.hex); // Should be #FF00FF

    // Subtractive Mixing (Yellow + Cyan)
    // Pigment: Green
    // Additive: White/Light Gray
    const sub = await mixColors({
      color1: '#FFFF00', // Yellow
      color2: '#00FFFF', // Cyan
      blendMode: 'subtractive'
    });
    console.log('Yellow + Cyan (Subtractive):', sub.result.hex); 
    // Expecting something greenish
  } catch (e) {
    console.error('Blend Mode Error:', e);
  }
}

test();
