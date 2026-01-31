import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ContrastService } from '../../../services/ContrastService.js';
import { ConversionService } from '../../../services/ConversionService.js';

const contrastService = new ContrastService();
const conversionService = new ConversionService();

export const calculateLuminanceSchema = z.object({
  color: z.string().describe('Color to calculate luminance for'),
});

export type CalculateLuminanceInput = z.infer<typeof calculateLuminanceSchema>;

export async function calculateLuminance(input: CalculateLuminanceInput) {
  const color = parseColor(input.color);
  const luminance = contrastService.calculateLuminance(color);

  // Convert to sRGB for display
  const srgb = conversionService.convert(color, 'srgb');
  const [r, g, b] = srgb.toRgbArray();

  // Determine perceived brightness category
  let category: string;
  let suggestedTextColor: string;

  if (luminance < 0.03) {
    category = 'Very dark';
    suggestedTextColor = '#FFFFFF';
  } else if (luminance < 0.179) {
    category = 'Dark';
    suggestedTextColor = '#FFFFFF';
  } else if (luminance < 0.5) {
    category = 'Medium';
    suggestedTextColor = luminance < 0.3 ? '#FFFFFF' : '#000000';
  } else if (luminance < 0.85) {
    category = 'Light';
    suggestedTextColor = '#000000';
  } else {
    category = 'Very light';
    suggestedTextColor = '#000000';
  }

  return {
    input: input.color,
    hex: srgb.toHex(),
    rgb: { r, g, b },
    luminance: {
      value: Math.round(luminance * 10000) / 10000,
      percentage: Math.round(luminance * 10000) / 100,
    },
    perception: {
      category,
      isLight: luminance > 0.179,
      isDark: luminance <= 0.179,
    },
    recommendation: {
      suggestedTextColor,
      note: `For optimal readability, use ${suggestedTextColor === '#FFFFFF' ? 'white' : 'black'} text on this background`,
    },
    formula: 'L = 0.2126 * R + 0.7152 * G + 0.0722 * B (where R, G, B are linearized sRGB values)',
  };
}
