import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { WCAGLevelSchema, TextSizeSchema } from '../schemas.js';
import { ContrastService, type WCAGLevel, type TextSize } from '../../../services/ContrastService.js';
import { ConversionService } from '../../../services/ConversionService.js';

const contrastService = new ContrastService();
const conversionService = new ConversionService();

export const validateWcagContrastSchema = z.object({
  foreground: z.string().describe('Foreground (text) color'),
  background: z.string().describe('Background color'),
  level: WCAGLevelSchema.optional().default('AA')
    .describe('WCAG conformance level to check'),
  textSize: TextSizeSchema.optional().default('normal')
    .describe('Text size category'),
});

export type ValidateWcagContrastInput = z.infer<typeof validateWcagContrastSchema>;

export async function validateWcagContrast(input: ValidateWcagContrastInput) {
  const foreground = parseColor(input.foreground);
  const background = parseColor(input.background);

  const result = contrastService.checkContrast(foreground, background);
  const passes = contrastService.meetsWCAG(
    foreground,
    background,
    input.level as WCAGLevel,
    input.textSize as TextSize
  );

  const threshold = contrastService.getThreshold(
    input.level as WCAGLevel,
    input.textSize as TextSize
  );

  // Convert to sRGB for display
  const fgSrgb = conversionService.convert(foreground, 'srgb');
  const bgSrgb = conversionService.convert(background, 'srgb');

  // Suggest alternative if fails
  let suggestion: { hex: string; contrast: number } | undefined;
  if (!passes) {
    const adjusted = contrastService.adjustForContrast(
      foreground,
      background,
      input.level as WCAGLevel,
      input.textSize as TextSize
    );
    const adjustedSrgb = conversionService.convert(adjusted, 'srgb');
    const adjustedContrast = contrastService.calculateContrastRatio(adjusted, background);
    suggestion = {
      hex: adjustedSrgb.toHex(),
      contrast: Math.round(adjustedContrast * 100) / 100,
    };
  }

  return {
    valid: passes,
    foreground: {
      input: input.foreground,
      hex: fgSrgb.toHex(),
    },
    background: {
      input: input.background,
      hex: bgSrgb.toHex(),
    },
    contrast: {
      ratio: Math.round(result.ratio * 100) / 100,
      ratioString: result.ratioString,
    },
    requirement: {
      level: input.level,
      textSize: input.textSize,
      minimumRatio: threshold,
    },
    result: passes
      ? `✓ Passes WCAG ${input.level} for ${input.textSize} text`
      : `✗ Fails WCAG ${input.level} for ${input.textSize} text`,
    suggestion: suggestion
      ? {
          message: 'Suggested accessible foreground color:',
          ...suggestion,
        }
      : undefined,
    allLevels: {
      'AA-normal': result.passes.AA.normal,
      'AA-large': result.passes.AA.large,
      'AAA-normal': result.passes.AAA.normal,
      'AAA-large': result.passes.AAA.large,
    },
  };
}
