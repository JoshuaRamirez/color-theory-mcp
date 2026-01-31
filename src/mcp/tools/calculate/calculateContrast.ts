import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ContrastService } from '../../../services/ContrastService.js';
import { ConversionService } from '../../../services/ConversionService.js';

const contrastService = new ContrastService();
const conversionService = new ConversionService();

export const calculateContrastSchema = z.object({
  foreground: z.string().describe('Foreground (text) color'),
  background: z.string().describe('Background color'),
});

export type CalculateContrastInput = z.infer<typeof calculateContrastSchema>;

export async function calculateContrast(input: CalculateContrastInput) {
  const foreground = parseColor(input.foreground);
  const background = parseColor(input.background);

  const result = contrastService.checkContrast(foreground, background);

  // Convert to sRGB for display
  const fgSrgb = conversionService.convert(foreground, 'srgb');
  const bgSrgb = conversionService.convert(background, 'srgb');

  return {
    foreground: {
      input: input.foreground,
      hex: fgSrgb.toHex(),
      luminance: Math.round(result.foregroundLuminance * 10000) / 10000,
    },
    background: {
      input: input.background,
      hex: bgSrgb.toHex(),
      luminance: Math.round(result.backgroundLuminance * 10000) / 10000,
    },
    contrast: {
      ratio: Math.round(result.ratio * 100) / 100,
      ratioString: result.ratioString,
    },
    wcag: {
      AA: {
        normalText: result.passes.AA.normal,
        largeText: result.passes.AA.large,
        required: { normalText: 4.5, largeText: 3.0 },
      },
      AAA: {
        normalText: result.passes.AAA.normal,
        largeText: result.passes.AAA.large,
        required: { normalText: 7.0, largeText: 4.5 },
      },
    },
    recommendation: getRecommendation(result),
  };
}

function getRecommendation(result: ReturnType<typeof contrastService.checkContrast>): string {
  if (result.passes.AAA.normal) {
    return 'Excellent contrast - passes WCAG AAA for all text sizes';
  }
  if (result.passes.AA.normal) {
    return 'Good contrast - passes WCAG AA for all text sizes';
  }
  if (result.passes.AA.large) {
    return 'Acceptable for large text only (18pt+ or 14pt+ bold) - passes WCAG AA for large text';
  }
  return 'Insufficient contrast - does not meet WCAG accessibility requirements';
}
