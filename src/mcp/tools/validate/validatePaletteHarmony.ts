import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { DeltaERegistry } from '../../../strategies/delta-e/DeltaERegistry.js';
import { Color } from '../../../domain/values/Color.js'; // Needed for suggestion creation
import type { HarmonyType } from '../../../domain/interfaces/IHarmonyAlgorithm.js';

const conversionService = new ConversionService();
const deltaERegistry = DeltaERegistry.createDefault();

export const validatePaletteHarmonySchema = z.object({
  colors: z.array(z.string()).min(2).describe('Array of colors in the palette'),
});

export type ValidatePaletteHarmonyInput = z.infer<typeof validatePaletteHarmonySchema>;

export async function validatePaletteHarmony(input: ValidatePaletteHarmonyInput) {
  const colors = input.colors.map((c) => parseColor(c));
  const deltaE = deltaERegistry.getDefault();

  // Get hues in Oklch
  const hues = colors.map((c) => {
    const oklch = conversionService.convert(c, 'oklch');
    return oklch.components[2] as number;
  });

  // Analyze hue relationships
  const hueAngles = hues.map((h, i) => {
    const nextHue = hues[(i + 1) % hues.length]!;
    let diff = nextHue - h;
    if (diff < 0) diff += 360;
    return Math.round(diff);
  });

  // Detect harmony type
  const detectedHarmony = detectHarmonyType(hues);

  // Calculate all pairwise differences
  const pairwiseDeltaE: { pair: [number, number]; deltaE: number }[] = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const diff = deltaE.calculate(colors[i]!, colors[j]!);
      pairwiseDeltaE.push({
        pair: [i, j],
        deltaE: Math.round(diff * 100) / 100,
      });
    }
  }

  // Calculate harmony score
  const harmonyScore = calculateHarmonyScore(hues, pairwiseDeltaE);

  // Generate suggestions for improvement
  let suggestion: { type: string; colors: string[] } | undefined;
  if (
    harmonyScore < 80 &&
    detectedHarmony.type !== 'unknown' &&
    detectedHarmony.type !== 'monochromatic'
  ) {
    // Generate ideal version based on the primary color (first color)
    const baseHue = hues[0]!;
    const idealHues = getIdealHues(baseHue, detectedHarmony.type, colors.length);

    // Create suggested colors (preserve L and C, snap H)
    const suggestedColors = colors.map((c, i) => {
      const oklch = conversionService.convert(c, 'oklch');
      const [l, chroma] = oklch.components as [number, number];
      const idealHue = idealHues[i % idealHues.length]!;
      const corrected = Color.create('oklch', [l, chroma, idealHue], c.alpha);
      return conversionService.convert(corrected, 'srgb').toHex();
    });

    suggestion = {
      type: `Adjusted to perfect ${detectedHarmony.type}`,
      colors: suggestedColors,
    };
  } else if (harmonyScore < 60 && detectedHarmony.type === 'unknown') {
    // Suggest nearest standard harmony?
    // Too complex for now, stick to detected type improvement.
  }

  // Get color info for display
  const colorInfo = colors.map((c, i) => {
    const srgb = conversionService.convert(c, 'srgb');
    const oklch = conversionService.convert(c, 'oklch');
    const [l, chroma, h] = oklch.components as [number, number, number];

    return {
      index: i,
      input: input.colors[i],
      hex: srgb.toHex(),
      hue: Math.round(h),
      lightness: Math.round(l * 100),
      chroma: Math.round(chroma * 1000) / 1000,
    };
  });

  // Find potential issues
  const issues: string[] = [];
  const veryClose = pairwiseDeltaE.filter((p) => p.deltaE < 3);
  if (veryClose.length > 0) {
    issues.push(
      `${veryClose.length} color pair(s) are very similar (ΔE < 3) and may be hard to distinguish`
    );
  }

  const lightnessRange =
    Math.max(...colorInfo.map((c) => c.lightness)) - Math.min(...colorInfo.map((c) => c.lightness));
  if (lightnessRange < 20) {
    issues.push('Colors have similar lightness - consider adding more contrast');
  }

  return {
    colorCount: colors.length,
    colors: colorInfo,
    harmony: {
      detected: detectedHarmony.type,
      confidence: detectedHarmony.confidence,
      description: getHarmonyDescription(detectedHarmony.type),
    },
    hueAnalysis: {
      hues: hues.map((h) => Math.round(h)),
      angles: hueAngles,
      spread: Math.round(Math.max(...hues) - Math.min(...hues)),
    },
    differences: {
      pairwise: pairwiseDeltaE,
      avgDeltaE:
        Math.round(
          (pairwiseDeltaE.reduce((sum, p) => sum + p.deltaE, 0) / pairwiseDeltaE.length) * 100
        ) / 100,
      minDeltaE: Math.min(...pairwiseDeltaE.map((p) => p.deltaE)),
      maxDeltaE: Math.max(...pairwiseDeltaE.map((p) => p.deltaE)),
    },
    score: {
      value: harmonyScore,
      rating: getHarmonyRating(harmonyScore),
    },
    suggestion,
    issues: issues.length > 0 ? issues : undefined,
  };
}

function getIdealHues(baseHue: number, type: HarmonyType, count: number): number[] {
  const hues = [baseHue];
  switch (type) {
    case 'complementary':
      hues.push((baseHue + 180) % 360);
      break;
    case 'analogous':
      hues.push((baseHue + 30) % 360);
      hues.push((baseHue + 60) % 360); // Simple 3-color analogous
      // If count > 3, we need more logic, but this is a start.
      // Better: distribute remaining count.
      for (let i = 2; i < count; i++) {
        hues.push((baseHue + 30 * i) % 360);
      }
      break;
    case 'triadic':
      hues.push((baseHue + 120) % 360);
      hues.push((baseHue + 240) % 360);
      break;
    case 'split-complementary':
      hues.push((baseHue + 150) % 360);
      hues.push((baseHue + 210) % 360);
      break;
    case 'tetradic':
      hues.push((baseHue + 60) % 360);
      hues.push((baseHue + 180) % 360);
      hues.push((baseHue + 240) % 360);
      break;
    case 'square':
      hues.push((baseHue + 90) % 360);
      hues.push((baseHue + 180) % 360);
      hues.push((baseHue + 270) % 360);
      break;
    default:
      // Monochromatic is handled separately (hue = baseHue)
      for (let i = 1; i < count; i++) hues.push(baseHue);
      break;
  }
  return hues;
}

function detectHarmonyType(hues: number[]): { type: HarmonyType | 'unknown'; confidence: number } {
  if (hues.length < 2) return { type: 'unknown', confidence: 0 };

  // Calculate hue differences from first color
  const baseDiffs = hues.slice(1).map((h) => {
    let diff = h - hues[0]!;
    if (diff < 0) diff += 360;
    return diff;
  });

  // Check for known patterns
  const patterns: { type: HarmonyType; diffs: number[]; tolerance: number }[] = [
    { type: 'complementary', diffs: [180], tolerance: 15 },
    { type: 'analogous', diffs: [30, 60], tolerance: 15 },
    { type: 'triadic', diffs: [120, 240], tolerance: 15 },
    { type: 'split-complementary', diffs: [150, 210], tolerance: 15 },
    { type: 'tetradic', diffs: [60, 180, 240], tolerance: 15 },
    { type: 'square', diffs: [90, 180, 270], tolerance: 15 },
  ];

  // Check monochromatic (all same hue)
  const hueSpread = Math.max(...hues) - Math.min(...hues);
  if (hueSpread < 15 || (hueSpread > 345 && hueSpread < 375)) {
    return { type: 'monochromatic', confidence: Math.max(0, 1 - hueSpread / 15) };
  }

  for (const pattern of patterns) {
    if (baseDiffs.length !== pattern.diffs.length) continue;

    const sortedDiffs = [...baseDiffs].sort((a, b) => a - b);
    const sortedPattern = [...pattern.diffs].sort((a, b) => a - b);

    let maxError = 0;
    let match = true;
    for (let i = 0; i < sortedDiffs.length; i++) {
      const error = Math.abs(sortedDiffs[i]! - sortedPattern[i]!);
      if (error > pattern.tolerance) {
        match = false;
        break;
      }
      maxError = Math.max(maxError, error);
    }

    if (match) {
      return {
        type: pattern.type,
        confidence: Math.max(0, 1 - maxError / pattern.tolerance),
      };
    }
  }

  return { type: 'unknown', confidence: 0 };
}

function calculateHarmonyScore(
  hues: number[],
  deltaEs: { pair: [number, number]; deltaE: number }[]
): number {
  // Score based on:
  // 1. Hue distribution evenness
  // 2. Color distinguishability (min deltaE)
  // 3. Consistency

  const minDeltaE = Math.min(...deltaEs.map((p) => p.deltaE));
  const distinguishability = Math.min(100, minDeltaE * 10);

  // Hue distribution (higher when spread out)
  const hueSpread = Math.max(...hues) - Math.min(...hues);
  const hueScore = Math.min(100, hueSpread / 1.8);

  return Math.round(distinguishability * 0.6 + hueScore * 0.4);
}

function getHarmonyRating(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function getHarmonyDescription(type: HarmonyType | 'unknown'): string {
  const descriptions: Record<string, string> = {
    complementary: 'Colors opposite on the wheel - high contrast',
    analogous: 'Adjacent colors - harmonious and unified',
    triadic: 'Evenly spaced (120°) - vibrant and balanced',
    'split-complementary': 'Base + two adjacent to complement - high contrast, less tension',
    tetradic: 'Rectangle on wheel - rich scheme with dual complementary pairs',
    square: 'Evenly spaced (90°) - bold and dynamic',
    monochromatic: 'Single hue with lightness/saturation variations - cohesive',
    unknown: 'Custom color relationship',
  };
  return descriptions[type] ?? descriptions['unknown']!;
}
