import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService, type InterpolationSpace } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import type { Color } from '../../../domain/values/Color.js';

const paletteService = new PaletteService();
const conversionService = new ConversionService();

/**
 * Schema for generate-gradient tool input.
 * Accepts either startColor+endColor (backward-compatible 2-color mode)
 * or a colors array for multi-stop gradients.
 */
export const generateGradientSchema = z.object({
  startColor: z.string().optional().describe('Starting color (for 2-color gradient)'),
  endColor: z.string().optional().describe('Ending color (for 2-color gradient)'),
  colors: z.array(z.string()).optional().describe('Multiple color stops (for multi-stop gradient)'),
  steps: z
    .number()
    .min(2)
    .max(50)
    .optional()
    .default(5)
    .describe('Number of color stops in the gradient'),
  interpolationSpace: z
    .enum(['oklch', 'oklab', 'lab', 'lch', 'srgb', 'hsl'])
    .optional()
    .default('oklch')
    .describe('Color space for interpolation'),
  easing: z
    .enum(['linear', 'ease-in', 'ease-out', 'ease-in-out'])
    .optional()
    .default('linear')
    .describe('Easing function for color transition distribution'),
  hueInterpolationMethod: z
    .enum(['shorter', 'longer', 'increasing', 'decreasing'])
    .optional()
    .default('shorter')
    .describe('Method for interpolating hue in cylindrical spaces (oklch, lch, hsl, etc.)'),
  includeCSS: z.boolean().optional().default(true).describe('Include CSS gradient string'),
});

const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => 1 - Math.pow(1 - t, 2),
  'ease-in-out': (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

export type GenerateGradientInput = z.infer<typeof generateGradientSchema>;

export async function generateGradient(input: GenerateGradientInput) {
  // Determine input colors -- supports both the legacy 2-color and multi-stop paths
  let inputColors: Color[];
  let inputLabels: string[];

  if (input.colors && input.colors.length >= 2) {
    inputColors = input.colors.map((c) => parseColor(c));
    inputLabels = input.colors;
  } else if (input.startColor && input.endColor) {
    inputColors = [parseColor(input.startColor), parseColor(input.endColor)];
    inputLabels = [input.startColor, input.endColor];
  } else {
    throw new Error('Provide either startColor+endColor or colors array with 2+ entries');
  }

  const space = input.interpolationSpace as InterpolationSpace;
  const easingFn = EASING_FUNCTIONS[input.easing as keyof typeof EASING_FUNCTIONS];
  const hueMethod = input.hueInterpolationMethod as any; // Cast to HueInterpolationMethod

  // Generate gradient through all stops
  const gradientColors = paletteService.generateMultiStopGradient(
    inputColors,
    input.steps,
    space,
    easingFn,
    hueMethod
  );

  const stops = gradientColors.map((color, index) => {
    const srgb = conversionService.convert(color, 'srgb');
    const position = Math.round((index / (gradientColors.length - 1)) * 100);
    return {
      index,
      position: `${position}%`,
      hex: srgb.toHex(),
    };
  });

  // Generate CSS
  let cssGradient: { linear: string; radial: string; conic: string } | undefined;
  if (input.includeCSS) {
    const cssStops = stops.map((s) => `${s.hex} ${s.position}`).join(', ');
    cssGradient = {
      linear: `linear-gradient(to right, ${cssStops})`,
      radial: `radial-gradient(circle, ${cssStops})`,
      conic: `conic-gradient(from 0deg, ${cssStops})`,
    };
  }

  return {
    inputColors: inputLabels.map((label, i) => ({
      input: label,
      hex: conversionService.convert(inputColors[i]!, 'srgb').toHex(),
    })),
    steps: gradientColors.length,
    interpolationSpace: input.interpolationSpace,
    gradient: { stops },
    css: cssGradient,
    note: `Gradient interpolated in ${input.interpolationSpace} color space`,
  };
}
