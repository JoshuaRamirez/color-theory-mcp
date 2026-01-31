import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService, type ScaleStep } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';

const paletteService = new PaletteService();
const conversionService = new ConversionService();

export const generateScaleSchema = z.object({
  baseColor: z.string().describe('Base color to generate scale from'),
  steps: z.array(z.number()).optional()
    .describe('Custom scale steps (default: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)'),
});

export type GenerateScaleInput = z.infer<typeof generateScaleSchema>;

export async function generateScale(input: GenerateScaleInput) {
  const baseColor = parseColor(input.baseColor);

  const scale = paletteService.generateScale(
    baseColor,
    input.steps ? { steps: input.steps as ScaleStep[] } : undefined
  );

  const baseSrgb = conversionService.convert(baseColor, 'srgb');

  // Convert all scale colors
  const scaleColors = [...scale.steps.entries()].map(([step, color]) => {
    const srgb = conversionService.convert(color, 'srgb');
    const oklch = conversionService.convert(color, 'oklch');
    const [l, c, h] = oklch.components as [number, number, number];

    return {
      step,
      hex: srgb.toHex(),
      lightness: Math.round(l * 100),
      chroma: Math.round(c * 1000) / 1000,
      hue: Math.round(h),
    };
  });

  // Generate CSS custom properties
  const cssVariables = scaleColors.map(s =>
    `--color-${s.step}: ${s.hex};`
  ).join('\n');

  // Generate Tailwind config
  const tailwindConfig = Object.fromEntries(
    scaleColors.map(s => [s.step.toString(), s.hex])
  );

  return {
    baseColor: {
      input: input.baseColor,
      hex: baseSrgb.toHex(),
    },
    scale: scaleColors,
    usage: {
      tailwindConfig: {
        description: 'Use in tailwind.config.js colors section',
        config: tailwindConfig,
      },
      cssVariables: {
        description: 'CSS custom properties',
        css: cssVariables,
      },
    },
    guidelines: {
      '50-100': 'Background tints, subtle highlights',
      '200-300': 'Hover states, secondary backgrounds',
      '400-500': 'Primary UI elements, borders',
      '600-700': 'Primary text on light backgrounds',
      '800-950': 'Headings, high contrast elements',
    },
  };
}
