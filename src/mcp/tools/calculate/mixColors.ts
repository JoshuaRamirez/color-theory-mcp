import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';

const paletteService = new PaletteService();
const conversionService = new ConversionService();

export const mixColorsSchema = z.object({
  color1: z.string().describe('First color'),
  color2: z.string().describe('Second color'),
  ratio: z.number().min(0).max(1).optional().default(0.5)
    .describe('Mix ratio (0 = 100% color1, 1 = 100% color2, 0.5 = equal mix)'),
  steps: z.number().min(2).max(20).optional()
    .describe('If provided, generate a gradient with this many steps'),
});

export type MixColorsInput = z.infer<typeof mixColorsSchema>;

export async function mixColors(input: MixColorsInput) {
  const color1 = parseColor(input.color1);
  const color2 = parseColor(input.color2);

  // Single mix
  const mixed = paletteService.mixColors(color1, color2, input.ratio);
  const mixedSrgb = conversionService.convert(mixed, 'srgb');
  const [r, g, b] = mixedSrgb.toRgbArray();

  // Convert inputs to sRGB for display
  const srgb1 = conversionService.convert(color1, 'srgb');
  const srgb2 = conversionService.convert(color2, 'srgb');

  const result: Record<string, unknown> = {
    color1: {
      input: input.color1,
      hex: srgb1.toHex(),
    },
    color2: {
      input: input.color2,
      hex: srgb2.toHex(),
    },
    ratio: input.ratio,
    result: {
      hex: mixedSrgb.toHex(),
      rgb: { r, g, b },
    },
    note: `${Math.round((1 - input.ratio) * 100)}% color1 + ${Math.round(input.ratio * 100)}% color2`,
  };

  // Generate gradient if steps requested
  if (input.steps) {
    const gradientColors = paletteService.generateGradient(color1, color2, input.steps);
    result['gradient'] = gradientColors.map((c, i) => {
      const srgb = conversionService.convert(c, 'srgb');
      return {
        step: i,
        position: Math.round((i / (input.steps! - 1)) * 100),
        hex: srgb.toHex(),
      };
    });
  }

  return result;
}
