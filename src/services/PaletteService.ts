import type { HarmonyType, HarmonyOptions } from '../domain/interfaces/IHarmonyAlgorithm.js';
import { Color } from '../domain/values/Color.js';
import type { ColorSpaceType } from '../domain/values/ColorSpaceType.js';
import type { Palette } from '../domain/values/Palette.js';
import { ConversionService } from './ConversionService.js';
import { HarmonyRegistry } from '../strategies/harmony/HarmonyRegistry.js';

const conversionService = new ConversionService();

/**
 * Interpolation spaces supported by multi-space mixing and gradient generation.
 * Includes both cylindrical (hue-bearing) and rectangular color spaces.
 */
export type InterpolationSpace = 'oklch' | 'oklab' | 'lab' | 'lch' | 'srgb' | 'hsl';

/**
 * Method for interpolating hue components in cylindrical spaces.
 * Matches CSS Color 4 specification.
 */
export type HueInterpolationMethod = 'shorter' | 'longer' | 'increasing' | 'decreasing';

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

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'subtractive';

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
  generateHarmony(baseColor: Color, harmonyType: HarmonyType, options?: HarmonyOptions): Palette {
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
      900: 0.2,
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
   * Blends two colors using standard compositing modes or subtractive mixing.
   * Based on W3C Compositing and Blending Level 1.
   * Operations are performed in linear-sRGB space for accuracy.
   */
  blendColors(backdrop: Color, source: Color, mode: BlendMode, alpha: number = 1): Color {
    const cb = conversionService.convert(backdrop, 'linear-srgb').components as [
      number,
      number,
      number,
    ];
    const cs = conversionService.convert(source, 'linear-srgb').components as [
      number,
      number,
      number,
    ];

    // Helper for channel-wise operations
    const apply = (op: (b: number, s: number) => number): [number, number, number] => {
      return [op(cb[0], cs[0]), op(cb[1], cs[1]), op(cb[2], cs[2])];
    };

    let result: [number, number, number];

    switch (mode) {
      case 'multiply':
        result = apply((b, s) => b * s);
        break;
      case 'screen':
        result = apply((b, s) => b + s - b * s);
        break;
      case 'overlay':
        result = apply((b, s) => (b <= 0.5 ? 2 * b * s : 1 - 2 * (1 - b) * (1 - s)));
        break;
      case 'darken':
        result = apply((b, s) => Math.min(b, s));
        break;
      case 'lighten':
        result = apply((b, s) => Math.max(b, s));
        break;
      case 'color-dodge':
        result = apply((b, s) => (b === 0 ? 0 : s === 1 ? 1 : Math.min(1, b / (1 - s))));
        break;
      case 'color-burn':
        result = apply((b, s) => (b === 1 ? 1 : s === 0 ? 0 : 1 - Math.min(1, (1 - b) / s)));
        break;
      case 'hard-light':
        result = apply((b, s) => (s <= 0.5 ? 2 * s * b : 1 - 2 * (1 - s) * (1 - b)));
        break;
      case 'soft-light':
        result = apply((b, s) => {
          if (s <= 0.5) return b - (1 - 2 * s) * b * (1 - b);
          return b + (2 * s - 1) * (Math.sqrt(b) - b);
        });
        break;
      case 'difference':
        result = apply((b, s) => Math.abs(b - s));
        break;
      case 'exclusion':
        result = apply((b, s) => b + s - 2 * b * s);
        break;
      case 'subtractive':
        // Geometric mean approximates subtractive mixing of pigments
        // Formula: (C1 * C2)^(0.5)
        result = apply((b, s) => Math.sqrt(b * s));
        break;
      case 'normal':
      default:
        result = cs;
        break;
    }

    // Apply alpha blending (source-over)
    // Result = alpha * blended + (1 - alpha) * backdrop
    const blended = [
      alpha * result[0] + (1 - alpha) * cb[0],
      alpha * result[1] + (1 - alpha) * cb[1],
      alpha * result[2] + (1 - alpha) * cb[2],
    ] as const;

    const blendedColor = Color.create('linear-srgb', blended, 1);
    return conversionService.convert(blendedColor, backdrop.space);
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
   * Mixes two colors in a specified interpolation space.
   * Handles hue-wrap interpolation for cylindrical spaces (oklch, lch, hsl).
   */
  mixColorsInSpace(
    color1: Color,
    color2: Color,
    ratio: number = 0.5,
    interpolationSpace: InterpolationSpace = 'oklch',
    hueMethod: HueInterpolationMethod = 'shorter'
  ): Color {
    const t = Math.max(0, Math.min(1, ratio));

    const c1 = conversionService.convert(color1, interpolationSpace as ColorSpaceType);
    const c2 = conversionService.convert(color2, interpolationSpace as ColorSpaceType);

    // Cylindrical spaces require shortest-path hue interpolation
    const isHueSpace = ['oklch', 'lch', 'hsl', 'hsv', 'hwb', 'cam16', 'hct'].includes(
      interpolationSpace
    );
    const hueIndex =
      interpolationSpace === 'hsl' ||
      interpolationSpace === 'hsv' ||
      interpolationSpace === 'hwb' ||
      interpolationSpace === 'hct'
        ? 0
        : 2; // HSL/HSV/HWB/HCT has hue first, Oklch/Lch/Cam16 last

    const mixed: number[] = [];
    for (let i = 0; i < c1.components.length; i++) {
      const v1 = c1.components[i]!;
      const v2 = c2.components[i]!;

      if (isHueSpace && i === hueIndex) {
        // Hue interpolation logic
        let h1 = v1;
        let h2 = v2;

        // Adjust h2 based on method

        switch (hueMethod) {
          case 'shorter':
            if (h2 - h1 > 180) h2 -= 360;
            else if (h2 - h1 < -180) h2 += 360;
            break;
          case 'longer':
            if (Math.abs(h2 - h1) < 180) {
              if (h2 > h1) h2 -= 360;
              else h2 += 360;
            }
            break;
          case 'increasing':
            if (h2 < h1) h2 += 360;
            break;
          case 'decreasing':
            if (h2 > h1) h2 -= 360;
            break;
        }

        let h = h1 + (h2 - h1) * t;
        h = ((h % 360) + 360) % 360;
        mixed.push(h);
      } else {
        mixed.push(v1 * (1 - t) + v2 * t);
      }
    }

    const alpha = color1.alpha * (1 - t) + color2.alpha * t;
    const result = Color.create(interpolationSpace as ColorSpaceType, mixed, alpha);
    return conversionService.convert(result, color1.space);
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
      H = (((H + adjustments.rotate) % 360) + 360) % 360;
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
    steps: number,
    easing: (t: number) => number = (t) => t
  ): Color[] {
    if (steps < 2) {
      throw new Error('Gradient must have at least 2 steps');
    }

    const colors: Color[] = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const easedT = easing(t);
      colors.push(this.mixColors(startColor, endColor, easedT));
    }
    return colors;
  }

  /**
   * Generates a gradient through multiple color stops.
   * Each adjacent pair is interpolated evenly, and steps are distributed
   * proportionally across segments.
   */
  generateMultiStopGradient(
    colors: Color[],
    totalSteps: number,
    interpolationSpace: InterpolationSpace = 'oklch',
    easing: (t: number) => number = (t) => t,
    hueMethod: HueInterpolationMethod = 'shorter'
  ): Color[] {
    if (colors.length < 2) {
      throw new Error('Gradient requires at least 2 colors');
    }
    if (totalSteps < colors.length) {
      throw new Error('Total steps must be at least the number of colors');
    }
    if (colors.length === 2) {
      return this.generateGradientInSpace(
        colors[0]!,
        colors[1]!,
        totalSteps,
        interpolationSpace,
        easing,
        hueMethod
      );
    }

    // For multi-stop with easing, we apply easing to the GLOBAL progress,
    // not per-segment, to ensure smooth transitions across stops.
    // However, multi-stop gradients usually define stops at specific positions (0%, 50%, 100%).
    // If we apply global easing, we shift those stop positions.
    // Standard CSS linear-gradient behavior is piecewise linear.
    // CSS interpolation hints act per-segment.
    // For simplicity and utility, we'll apply the easing *per segment* if standard,
    // OR global if requested?
    // Actually, usually "ease-in" on a multi-stop gradient means "ease in at start, ease out at end" (global).

    // Let's implement GLOBAL easing.
    // We calculate the global 't' (0 to 1), apply easing, then find which segment we are in.

    const result: Color[] = [];

    for (let i = 0; i < totalSteps; i++) {
      const t = i / (totalSteps - 1);
      const easedT = easing(t);

      // Map easedT to a segment
      // stops are at 0, 1/(n-1), 2/(n-1), ... 1
      // We have colors.length stops.
      const segmentCount = colors.length - 1;
      const globalPos = easedT * segmentCount;
      const segmentIndex = Math.min(Math.floor(globalPos), segmentCount - 1);
      const segmentT = globalPos - segmentIndex;

      const start = colors[segmentIndex]!;
      const end = colors[segmentIndex + 1]!;

      result.push(this.mixColorsInSpace(start, end, segmentT, interpolationSpace, hueMethod));
    }

    return result;
  }

  /**
   * Generates a 2-color gradient in a specified interpolation space.
   */
  private generateGradientInSpace(
    startColor: Color,
    endColor: Color,
    steps: number,
    interpolationSpace: InterpolationSpace = 'oklch',
    easing: (t: number) => number = (t) => t,
    hueMethod: HueInterpolationMethod = 'shorter'
  ): Color[] {
    if (steps < 2) {
      throw new Error('Gradient must have at least 2 steps');
    }

    const result: Color[] = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const easedT = easing(t);
      result.push(
        this.mixColorsInSpace(startColor, endColor, easedT, interpolationSpace, hueMethod)
      );
    }
    return result;
  }
}
