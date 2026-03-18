import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { APCAService } from '../../../services/APCAService.js';

const apcaService = new APCAService();

export const calculateAPCASchema = z.object({
  textColor: z.string().describe('Text/foreground color'),
  backgroundColor: z.string().describe('Background color'),
});

export type CalculateAPCAInput = z.infer<typeof calculateAPCASchema>;

/**
 * Calculates the APCA (Accessible Perceptual Contrast Algorithm) lightness contrast
 * between a text color and a background color. APCA is the contrast algorithm
 * proposed for WCAG 3.0 and is polarity-aware.
 */
export async function calculateAPCA(input: CalculateAPCAInput) {
  const text = parseColor(input.textColor);
  const bg = parseColor(input.backgroundColor);
  const result = apcaService.calculateAPCA(text, bg);

  return {
    textColor: input.textColor,
    backgroundColor: input.backgroundColor,
    Lc: Math.round(result.Lc * 100) / 100,
    absoluteLc: Math.round(result.absLc * 100) / 100,
    polarity: result.polarity,
    interpretation: result.interpretation,
    passes: result.meetsMinimum,
    note: 'APCA is designed for WCAG 3.0. Lc values indicate lightness contrast; 75+ recommended for body text.',
  };
}
