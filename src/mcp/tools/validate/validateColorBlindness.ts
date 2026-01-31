import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { CVDTypeSchema } from '../schemas.js';
import { CVDSimulatorRegistry } from '../../../strategies/cvd/CVDSimulatorRegistry.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { DeltaERegistry } from '../../../strategies/delta-e/DeltaERegistry.js';
import type { CVDType } from '../../../domain/interfaces/ICVDSimulator.js';

const cvdRegistry = CVDSimulatorRegistry.createDefault();
const conversionService = new ConversionService();
const deltaERegistry = DeltaERegistry.createDefault();

export const validateColorBlindnessSchema = z.object({
  colors: z.array(z.string()).describe('Array of colors to check'),
  cvdType: CVDTypeSchema.optional()
    .describe('Specific CVD type to simulate (default: all common types)'),
  severity: z.number().min(0).max(1).optional().default(1.0)
    .describe('Severity of deficiency (0-1)'),
});

export type ValidateColorBlindnessInput = z.infer<typeof validateColorBlindnessSchema>;

export async function validateColorBlindness(input: ValidateColorBlindnessInput) {
  const colors = input.colors.map(c => ({
    input: c,
    color: parseColor(c),
  }));

  // Determine which CVD types to simulate
  const cvdTypes: CVDType[] = input.cvdType
    ? [input.cvdType as CVDType]
    : ['protanopia', 'deuteranopia', 'tritanopia'];

  const results: Record<string, unknown> = {};
  const deltaE = deltaERegistry.getDefault();

  for (const cvdType of cvdTypes) {
    const simulator = cvdRegistry.get(cvdType);
    if (!simulator) continue;

    // Simulate each color
    const simulatedColors = colors.map(c => {
      const simulated = simulator.simulate(c.color, { severity: input.severity });
      const originalSrgb = conversionService.convert(c.color, 'srgb');
      const simulatedSrgb = conversionService.convert(simulated, 'srgb');

      const difference = deltaE.calculate(c.color, simulated);

      return {
        input: c.input,
        original: originalSrgb.toHex(),
        simulated: simulatedSrgb.toHex(),
        deltaE: Math.round(difference * 100) / 100,
        perceptualChange: getPerceptualChangeDescription(difference),
      };
    });

    // Check for confusable pairs
    const confusablePairs: { color1: string; color2: string; simulatedDeltaE: number }[] = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const sim1 = simulator.simulate(colors[i]!.color, { severity: input.severity });
        const sim2 = simulator.simulate(colors[j]!.color, { severity: input.severity });
        const simDiff = deltaE.calculate(sim1, sim2);

        // If simulated colors are very similar (Delta-E < 3), they may be confusable
        if (simDiff < 3) {
          confusablePairs.push({
            color1: colors[i]!.input,
            color2: colors[j]!.input,
            simulatedDeltaE: Math.round(simDiff * 100) / 100,
          });
        }
      }
    }

    results[cvdType] = {
      info: simulator.info,
      colors: simulatedColors,
      confusablePairs: confusablePairs.length > 0 ? confusablePairs : undefined,
      hasConfusablePairs: confusablePairs.length > 0,
    };
  }

  // Overall assessment
  const hasAnyConfusable = Object.values(results).some(
    (r: unknown) => (r as { hasConfusablePairs: boolean }).hasConfusablePairs
  );

  return {
    severity: input.severity,
    colorCount: colors.length,
    results,
    overallAssessment: {
      accessible: !hasAnyConfusable,
      message: hasAnyConfusable
        ? 'Some color pairs may be confusable for people with color vision deficiencies'
        : 'Colors appear distinguishable across simulated CVD types',
      recommendation: hasAnyConfusable
        ? 'Consider using additional visual cues (patterns, labels, icons) alongside color'
        : undefined,
    },
  };
}

function getPerceptualChangeDescription(deltaE: number): string {
  if (deltaE < 1) return 'Imperceptible change';
  if (deltaE < 2) return 'Barely perceptible change';
  if (deltaE < 5) return 'Noticeable change';
  if (deltaE < 10) return 'Significant change';
  return 'Major change';
}
