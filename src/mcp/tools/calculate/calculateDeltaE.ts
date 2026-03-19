import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { DeltaEMethodSchema } from '../schemas.js';
import { DeltaERegistry } from '../../../strategies/delta-e/DeltaERegistry.js';
import { ConversionService } from '../../../services/ConversionService.js';
import type { DeltaEMethod } from '../../../domain/interfaces/IDeltaEStrategy.js';

const deltaERegistry = DeltaERegistry.createDefault();
const conversionService = new ConversionService();

export const calculateDeltaESchema = z.object({
  color1: z.string().describe('First color'),
  color2: z.string().describe('Second color'),
  method: DeltaEMethodSchema.optional().default('CIEDE2000').describe('Delta-E calculation method'),
  kL: z.number().optional().describe('CIEDE2000 lightness weight (default 1, textiles use 2)'),
  kC: z.number().optional().describe('CIEDE2000 chroma weight (default 1)'),
  kH: z.number().optional().describe('CIEDE2000 hue weight (default 1)'),
});

export type CalculateDeltaEInput = z.infer<typeof calculateDeltaESchema>;

export async function calculateDeltaE(input: CalculateDeltaEInput) {
  const color1 = parseColor(input.color1);
  const color2 = parseColor(input.color2);

  const strategy = deltaERegistry.get(input.method as DeltaEMethod);
  if (!strategy) {
    throw new Error(`Unknown Delta-E method: ${input.method}`);
  }

  const deltaE = strategy.calculate(color1, color2, {
    application: undefined,
    kL: input.kL,
    kC: input.kC,
    kH: input.kH,
  });
  const interpretation = strategy.interpret(deltaE);

  // Convert to sRGB for display
  const srgb1 = conversionService.convert(color1, 'srgb');
  const srgb2 = conversionService.convert(color2, 'srgb');

  // Also get Lab values for reference
  const lab1 = conversionService.convert(color1, 'lab');
  const lab2 = conversionService.convert(color2, 'lab');

  return {
    color1: {
      input: input.color1,
      hex: srgb1.toHex(),
      lab: {
        L: Math.round((lab1.components[0] ?? 0) * 100) / 100,
        a: Math.round((lab1.components[1] ?? 0) * 100) / 100,
        b: Math.round((lab1.components[2] ?? 0) * 100) / 100,
      },
    },
    color2: {
      input: input.color2,
      hex: srgb2.toHex(),
      lab: {
        L: Math.round((lab2.components[0] ?? 0) * 100) / 100,
        a: Math.round((lab2.components[1] ?? 0) * 100) / 100,
        b: Math.round((lab2.components[2] ?? 0) * 100) / 100,
      },
    },
    deltaE: {
      value: Math.round(deltaE * 100) / 100,
      method: input.method,
      methodDescription: strategy.description,
    },
    interpretation: {
      description: interpretation.description,
      perceptible: interpretation.perceptible,
      acceptable: interpretation.acceptable,
    },
    thresholds: {
      imperceptible: '< 1.0',
      closeObservation: '1.0 - 2.0',
      perceptibleAtGlance: '2.0 - 3.5',
      moreSimilarThanDifferent: '3.5 - 5.0',
      noticeablyDifferent: '> 5.0',
    },
  };
}
