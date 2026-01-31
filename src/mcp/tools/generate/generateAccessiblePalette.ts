import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { WCAGLevelSchema } from '../schemas.js';
import { ContrastService, type WCAGLevel } from '../../../services/ContrastService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { Color } from '../../../domain/values/Color.js';

const contrastService = new ContrastService();
const conversionService = new ConversionService();

export const generateAccessiblePaletteSchema = z.object({
  colors: z.array(z.string()).describe('Array of colors to make accessible'),
  backgroundColor: z.string().describe('Background color to ensure contrast against'),
  level: WCAGLevelSchema.optional().default('AA')
    .describe('WCAG conformance level to target'),
});

export type GenerateAccessiblePaletteInput = z.infer<typeof generateAccessiblePaletteSchema>;

export async function generateAccessiblePalette(input: GenerateAccessiblePaletteInput) {
  const background = parseColor(input.backgroundColor);
  const bgSrgb = conversionService.convert(background, 'srgb');

  const results = input.colors.map(colorStr => {
    const original = parseColor(colorStr);
    const originalSrgb = conversionService.convert(original, 'srgb');

    // Check original contrast
    const originalContrast = contrastService.checkContrast(original, background);
    const meetsTarget = input.level === 'AAA'
      ? originalContrast.passes.AAA.normal
      : originalContrast.passes.AA.normal;

    if (meetsTarget) {
      // Already meets requirements
      return {
        input: colorStr,
        original: {
          hex: originalSrgb.toHex(),
          contrast: Math.round(originalContrast.ratio * 100) / 100,
          passes: true,
        },
        adjusted: null,
        note: `Already meets WCAG ${input.level} requirements`,
      };
    }

    // Adjust for contrast
    const adjusted = contrastService.adjustForContrast(
      original,
      background,
      input.level as WCAGLevel,
      'normal'
    );
    const adjustedSrgb = conversionService.convert(adjusted, 'srgb');
    const adjustedContrast = contrastService.checkContrast(adjusted, background);

    // Calculate how much the color changed
    const originalOklch = conversionService.convert(original, 'oklch');
    const adjustedOklch = conversionService.convert(adjusted, 'oklch');
    const [origL] = originalOklch.components as [number, number, number];
    const [adjL] = adjustedOklch.components as [number, number, number];

    return {
      input: colorStr,
      original: {
        hex: originalSrgb.toHex(),
        contrast: Math.round(originalContrast.ratio * 100) / 100,
        passes: false,
      },
      adjusted: {
        hex: adjustedSrgb.toHex(),
        contrast: Math.round(adjustedContrast.ratio * 100) / 100,
        passes: true,
        lightnessChange: Math.round((adjL - origL) * 100),
      },
      note: adjL > origL ? 'Lightened to meet contrast' : 'Darkened to meet contrast',
    };
  });

  const passedOriginal = results.filter(r => r.adjusted === null).length;
  const adjusted = results.filter(r => r.adjusted !== null).length;

  return {
    background: {
      input: input.backgroundColor,
      hex: bgSrgb.toHex(),
    },
    targetLevel: input.level,
    requiredContrast: input.level === 'AAA' ? '7:1' : '4.5:1',
    summary: {
      total: input.colors.length,
      alreadyAccessible: passedOriginal,
      adjusted,
    },
    colors: results,
  };
}
