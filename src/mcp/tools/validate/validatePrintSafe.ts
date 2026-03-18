import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';

const conversionService = new ConversionService();

export const validatePrintSafeSchema = z.object({
  color: z.string().describe('Color to check for print safety'),
});

export type ValidatePrintSafeInput = z.infer<typeof validatePrintSafeSchema>;

export async function validatePrintSafe(input: ValidatePrintSafeInput) {
  const color = parseColor(input.color);

  // Convert to CMYK
  const cmyk = conversionService.convert(color, 'cmyk');
  const [c, m, y, k] = cmyk.components as [number, number, number, number];

  // Convert to sRGB for display
  const srgb = conversionService.convert(color, 'srgb');

  // Check for potential print issues
  const issues: string[] = [];
  const warnings: string[] = [];

  // High total ink coverage (>300% is often problematic)
  const totalInk = (c + m + y + k) * 100;
  if (totalInk > 300) {
    issues.push(`Total ink coverage (${Math.round(totalInk)}%) exceeds 300% - may cause bleeding or drying issues`);
  } else if (totalInk > 280) {
    warnings.push(`Total ink coverage (${Math.round(totalInk)}%) is high - consider reducing for better print quality`);
  }

  // Very saturated colors may not reproduce accurately
  const maxChannel = Math.max(c, m, y);
  if (maxChannel > 0.95 && k < 0.1) {
    warnings.push('Highly saturated color may not reproduce accurately on all printers');
  }

  // Pure black recommendation
  if (c === 0 && m === 0 && y === 0 && k === 1) {
    // Good - pure K black
  } else if (c + m + y > 0 && k > 0.9) {
    warnings.push('Consider using "rich black" (adding CMY to K) for deeper blacks in large areas');
  }

  // Very light colors may be hard to reproduce
  if (c + m + y + k < 0.05) {
    warnings.push('Very light color may appear as white when printed');
  }

  // Neon/fluorescent colors
  const hsl = conversionService.convert(color, 'hsl');
  const [_h, s, l] = hsl.components as [number, number, number];
  if (s > 0.9 && l > 0.5) {
    warnings.push('Highly saturated bright colors may appear duller in print than on screen');
  }

  const printSafe = issues.length === 0;

  return {
    input: input.color,
    hex: srgb.toHex(),
    printSafe,
    cmyk: {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
      string: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`,
    },
    analysis: {
      totalInkCoverage: `${Math.round(totalInk)}%`,
      recommendedMax: '300%',
      issues: issues.length > 0 ? issues : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    },
    recommendations: printSafe
      ? ['Color should print well on most commercial printers']
      : [
          'Consider adjusting the color to reduce ink coverage',
          'Request a proof print before final production',
          'Discuss with your printer about their ink coverage limits',
        ],
    note: 'CMYK conversion is approximate. For accurate print colors, use ICC profiles and professional color management.',
  };
}
