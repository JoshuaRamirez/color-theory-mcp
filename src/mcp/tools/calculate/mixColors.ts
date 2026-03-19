import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import type { Color } from '../../../domain/values/Color.js';

const paletteService = new PaletteService();
const conversionService = new ConversionService();

export const mixColorsSchema = z.object({
  color1: z.string().describe('First color'),
  color2: z.string().describe('Second color'),
  ratio: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .default(0.5)
    .describe('Mix ratio (0 = 100% color1, 1 = 100% color2, 0.5 = equal mix)'),
  steps: z
    .number()
    .min(2)
    .max(20)
    .optional()
    .describe('If provided, generate a gradient with this many steps'),
  interpolationSpace: z
    .enum(['oklch', 'oklab', 'lab', 'lch', 'srgb', 'hsl'])
    .optional()
    .default('oklch')
    .describe('Color space for interpolation'),
  blendMode: z
    .enum([
      'normal',
      'multiply',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'soft-light',
      'difference',
      'exclusion',
      'subtractive',
    ])
    .optional()
    .default('normal')
    .describe('Compositing blend mode. "subtractive" uses pigment-mixing simulation.'),
  hueInterpolationMethod: z
    .enum(['shorter', 'longer', 'increasing', 'decreasing'])
    .optional()
    .default('shorter')
    .describe('Method for interpolating hue in cylindrical spaces (oklch, lch, hsl, etc.)'),
});

export type MixColorsInput = z.infer<typeof mixColorsSchema>;

export async function mixColors(input: MixColorsInput) {
  const color1 = parseColor(input.color1);
  const color2 = parseColor(input.color2);
  const space = input.interpolationSpace as any; // Cast to InterpSpace
  const mode = input.blendMode as any;
  const hueMethod = input.hueInterpolationMethod as any;

  // Single mix
  let mixed: Color;
  if (mode !== 'normal') {
    mixed = paletteService.blendColors(color1, color2, mode, input.ratio);
  } else {
    mixed = paletteService.mixColorsInSpace(color1, color2, input.ratio, space, hueMethod);
  }

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
    operation: mode !== 'normal' ? `blend (${mode})` : `mix (interpolate in ${space})`,
    result: {
      hex: mixedSrgb.toHex(),
      rgb: { r, g, b },
    },
    note:
      mode === 'subtractive'
        ? 'Simulating pigment mixing (darker result)'
        : `${Math.round((1 - input.ratio) * 100)}% color1 + ${Math.round(input.ratio * 100)}% color2`,
  };

  // Generate gradient if steps requested (gradients always use interpolation, blend modes are point ops)
  if (input.steps && mode === 'normal') {
    const gradientColors = paletteService.generateMultiStopGradient(
      [color1, color2],
      input.steps,
      space,
      undefined,
      hueMethod
    );
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
