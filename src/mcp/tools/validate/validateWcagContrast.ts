import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { WCAGLevelSchema, TextSizeSchema } from '../schemas.js';
import {
  ContrastService,
  type WCAGLevel,
  type TextSize,
} from '../../../services/ContrastService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { APCAService } from '../../../services/APCAService.js';

const contrastService = new ContrastService();
const conversionService = new ConversionService();
const apcaService = new APCAService();

export const validateWcagContrastSchema = z.object({
  foreground: z.string().describe('Foreground (text) color'),
  background: z.string().describe('Background color'),
  level: WCAGLevelSchema.optional().default('AA').describe('WCAG conformance level to check'),
  textSize: TextSizeSchema.optional().default('normal').describe('Text size category'),
  componentType: z
    .enum(['text', 'ui-component', 'graphical-object'])
    .optional()
    .default('text')
    .describe('Element type: text, UI component (buttons/inputs), or graphical object'),
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
  let backgroundSuggestion: { hex: string; contrast: number } | undefined;

  if (!passes) {
    // Suggest Foreground
    const adjustedFg = contrastService.adjustForContrast(
      foreground,
      background,
      input.level as WCAGLevel,
      input.textSize as TextSize
    );
    const adjustedFgSrgb = conversionService.convert(adjustedFg, 'srgb');
    const adjustedFgContrast = contrastService.calculateContrastRatio(adjustedFg, background);
    suggestion = {
      hex: adjustedFgSrgb.toHex(),
      contrast: Math.round(adjustedFgContrast * 100) / 100,
    };

    // Suggest Background (symmetric adjustment)
    const adjustedBg = contrastService.adjustForContrast(
      background,
      foreground,
      input.level as WCAGLevel,
      input.textSize as TextSize
    );
    const adjustedBgSrgb = conversionService.convert(adjustedBg, 'srgb');
    const adjustedBgContrast = contrastService.calculateContrastRatio(foreground, adjustedBg);
    backgroundSuggestion = {
      hex: adjustedBgSrgb.toHex(),
      contrast: Math.round(adjustedBgContrast * 100) / 100,
    };
  }

  // WCAG 2.2 non-text contrast (3:1 for UI components and graphical objects)
  let nonTextResult: { passes: boolean; required: number; message: string } | undefined;
  if (input.componentType !== 'text') {
    const isUI = input.componentType === 'ui-component';
    const passesNonText = isUI ? result.passes.AA.ui : result.passes.AA.graphics;
    const nonTextThreshold = 3.0; // WCAG 2.2 SC 1.4.11

    nonTextResult = {
      passes: passesNonText,
      required: nonTextThreshold,
      message: passesNonText
        ? `✓ Meets WCAG 2.2 non-text contrast (3:1) for ${isUI ? 'UI components' : 'graphical objects'}`
        : `✗ Fails WCAG 2.2 non-text contrast (3:1) for ${isUI ? 'UI components' : 'graphical objects'}`,
    };
  }

  // APCA Analysis (Future Standard)
  const apcaResult = apcaService.calculateAPCA(foreground, background);
  const apca = {
    Lc: Math.round(apcaResult.Lc * 10) / 10,
    rating: apcaResult.interpretation,
    compatibility: {
      bodyText: apcaResult.meetsMinimum.bodyText,
      largeText: apcaResult.meetsMinimum.largeText,
      nonText: apcaResult.meetsMinimum.nonText,
    },
    note: 'APCA is the candidate method for WCAG 3.0. Lc 75+ is recommended for body text.',
  };

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
    backgroundSuggestion: backgroundSuggestion
      ? {
          message: 'Suggested accessible background color:',
          ...backgroundSuggestion,
        }
      : undefined,
    allLevels: {
      'AA-normal': result.passes.AA.normal,
      'AA-large': result.passes.AA.large,
      'AA-ui': result.passes.AA.ui,
      'AAA-normal': result.passes.AAA.normal,
      'AAA-large': result.passes.AAA.large,
      'AAA-ui': result.passes.AAA.ui,
    },
    nonTextContrast: nonTextResult,
    apca,
  };
}
