import type { HarmonyType, HarmonyOptions } from '../domain/interfaces/IHarmonyAlgorithm.js';
import { Color } from '../domain/values/Color.js';
import type { Palette } from '../domain/values/Palette.js';
import { ConversionService } from './ConversionService.js';
import { HarmonyRegistry } from '../strategies/harmony/HarmonyRegistry.js';

const conversionService = new ConversionService();

/**
 * Tailwind-style scale steps.
 */
export type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Result of scale generation.
 */
export interface ColorScale {
  readonly baseColor: Color;
  readonly steps: Map<ScaleStep, Color>;
}

/**
 * Service for generating color palettes and scales.
 */
export class PaletteService {
  private readonly harmonyRegistry: HarmonyRegistry;

  constructor(harmonyRegistry?: HarmonyRegistry) {
    this.harmonyRegistry = harmonyRegistry ?? HarmonyRegistry.createDefault();
  }

  /**
   * Generates a harmony palette from a base color.
   */
  generateHarmony(
    baseColor: Color,
    harmonyType: HarmonyType,
    options?: HarmonyOptions
  ): Palette {
    const algorithm = this.harmonyRegistry.get(harmonyType);
    if (!algorithm) {
      throw new Error(`Unknown harmony type: ${harmonyType}`);
    }
    return algorithm.generate(baseColor, options);
  }

  /**
   * Generates a Tailwind-style color scale (50-950).
   * Uses Oklch for perceptually uniform lightness distribution.
   */
  generateScale(baseColor: Color, options?: { steps?: ScaleStep[] }): ColorScale {
    const steps = options?.steps ?? [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // Convert to Oklch for perceptual manipulation
    const oklchColor = conversionService.convert(baseColor, 'oklch');
    const [, C, H] = oklchColor.components as [number, number, number];

    // Lightness values for each step (empirically determined for good results)
    const lightnessMap: Record<ScaleStep, number> = {
      50: 0.97,
      100: 0.93,
      200: 0.87,
      300: 0.78,
      400: 0.67,
      500: 0.55,
      600: 0.45,
      700: 0.35,
      800: 0.27,
      900: 0.20,
      950: 0.13,
    };

    // Chroma adjustments (more saturated in mid-tones)
    const chromaMultiplier: Record<ScaleStep, number> = {
      50: 0.3,
      100: 0.5,
      200: 0.7,
      300: 0.85,
      400: 0.95,
      500: 1.0,
      600: 1.0,
      700: 0.95,
      800: 0.85,
      900: 0.7,
      950: 0.55,
    };

    const resultSteps = new Map<ScaleStep, Color>();

    for (const step of steps) {
      const L = lightnessMap[step];
      const adjustedC = C * chromaMultiplier[step];

      const stepOklch = Color.create('oklch', [L, adjustedC, H], baseColor.alpha);
      const stepColor = conversionService.convert(stepOklch, baseColor.space);
      resultSteps.set(step, stepColor);
    }

    return {
      baseColor,
      steps: resultSteps,
    };
  }

  /**
   * Mixes two colors together.
   * Uses Oklch for perceptually uniform blending.
   */
  mixColors(color1: Color, color2: Color, ratio: number = 0.5): Color {
    const t = Math.max(0, Math.min(1, ratio));

    // Convert both to Oklch
    const oklch1 = conversionService.convert(color1, 'oklch');
    const oklch2 = conversionService.convert(color2, 'oklch');

    const [L1, C1, H1] = oklch1.components as [number, number, number];
    const [L2, C2, H2] = oklch2.components as [number, number, number];

    // Interpolate lightness and chroma linearly
    const L = L1 * (1 - t) + L2 * t;
    const C = C1 * (1 - t) + C2 * t;

    // Interpolate hue (handling wraparound)
    let H: number;
    const hueDiff = H2 - H1;
    if (Math.abs(hueDiff) <= 180) {
      H = H1 + hueDiff * t;
    } else if (hueDiff > 180) {
      H = H1 + (hueDiff - 360) * t;
    } else {
      H = H1 + (hueDiff + 360) * t;
    }
    H = ((H % 360) + 360) % 360;

    // Interpolate alpha
    const alpha = color1.alpha * (1 - t) + color2.alpha * t;

    const mixed = Color.create('oklch', [L, C, H], alpha);
    return conversionService.convert(mixed, color1.space);
  }

  /**
   * Adjusts a color's properties.
   */
  adjustColor(
    color: Color,
    adjustments: {
      lighten?: number; // 0-1, amount to increase lightness
      darken?: number; // 0-1, amount to decrease lightness
      saturate?: number; // 0-1, amount to increase saturation
      desaturate?: number; // 0-1, amount to decrease saturation
      rotate?: number; // degrees to rotate hue
    }
  ): Color {
    const oklch = conversionService.convert(color, 'oklch');
    let [L, C, H] = oklch.components as [number, number, number];

    // Apply lightness adjustments
    if (adjustments.lighten) {
      L = Math.min(1, L + adjustments.lighten * (1 - L));
    }
    if (adjustments.darken) {
      L = Math.max(0, L - adjustments.darken * L);
    }

    // Apply saturation adjustments
    if (adjustments.saturate) {
      C = Math.min(0.4, C + adjustments.saturate * (0.4 - C));
    }
    if (adjustments.desaturate) {
      C = Math.max(0, C - adjustments.desaturate * C);
    }

    // Apply hue rotation
    if (adjustments.rotate) {
      H = ((H + adjustments.rotate) % 360 + 360) % 360;
    }

    const adjusted = Color.create('oklch', [L, C, H], color.alpha);
    return conversionService.convert(adjusted, color.space);
  }

  /**
   * Generates a gradient between colors.
   */
  generateGradient(
    startColor: Color,
    endColor: Color,
    steps: number
  ): Color[] {
    if (steps < 2) {
      throw new Error('Gradient must have at least 2 steps');
    }

    const colors: Color[] = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      colors.push(this.mixColors(startColor, endColor, t));
    }
    return colors;
  }
}
