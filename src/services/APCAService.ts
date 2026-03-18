import { Color } from '../domain/values/Color.js';
import { ConversionService } from './ConversionService.js';
import { srgbToLinear } from '../color-spaces/gamma.js';

const conversionService = new ConversionService();

/**
 * APCA luminance coefficients (sRGB to Y).
 * These differ slightly from WCAG 2.x coefficients, reflecting
 * the APCA-W3 0.0.98G-4g specification by Myndex/Silver.
 */
const APCA_COEFFICIENTS = {
  R: 0.2126729,
  G: 0.7151522,
  B: 0.072175,
} as const;

/**
 * Soft-clamp threshold and exponent for low-luminance pre-processing.
 * Values below this threshold are boosted to avoid division-by-zero
 * artifacts in the power-curve contrast calculation.
 */
const SOFT_CLAMP = {
  THRESHOLD: 0.022,
  EXPONENT: 1.414,
} as const;

/**
 * Asymmetric power-curve exponents for SAPC calculation.
 * Normal polarity: dark text on light background.
 * Reverse polarity: light text on dark background.
 */
const POWER_CURVES = {
  NORMAL: { BG: 0.56, TEXT: 0.57 },
  REVERSE: { BG: 0.65, TEXT: 0.62 },
  SCALE: 1.14,
} as const;

/**
 * Output clamp constants applied after raw SAPC calculation.
 */
const OUTPUT_CLAMP = {
  THRESHOLD: 0.1,
  OFFSET: 0.027,
} as const;

/**
 * APCA lightness contrast (Lc) thresholds for different content types.
 * These represent the minimum |Lc| values from the APCA guidelines.
 */
const APCA_THRESHOLDS = {
  BODY_TEXT: 75,
  LARGE_TEXT: 60,
  NON_TEXT: 45,
  SPOT_TEXT: 30,
  NON_CONTENT: 15,
} as const;

/**
 * Default target Lc used when no specific target is provided.
 * 75 is the minimum for body text readability.
 */
const DEFAULT_TARGET_LC = 75;

/**
 * Maximum binary search iterations for lightness adjustment.
 * 25 iterations give precision well below 1 Lc unit.
 */
const MAX_BINARY_SEARCH_ITERATIONS = 25;

/**
 * Result of an APCA contrast calculation.
 *
 * Lc can be negative, indicating reverse polarity (light text on dark background).
 * Use absLc for threshold comparisons.
 */
export interface APCAResult {
  /** Lightness contrast value, signed by polarity. Positive = normal, negative = reverse. */
  Lc: number;
  /** Absolute Lc value for threshold comparisons. */
  absLc: number;
  /** Polarity: 'normal' for dark-on-light, 'reverse' for light-on-dark. */
  polarity: 'normal' | 'reverse';
  /** APCA-computed luminance (Y) of the text color after soft-clamp pre-processing. */
  textLuminance: number;
  /** APCA-computed luminance (Y) of the background color after soft-clamp pre-processing. */
  backgroundLuminance: number;
  /** Human-readable description of the contrast level. */
  interpretation: string;
  /** Boolean flags indicating which APCA usage thresholds are met. */
  meetsMinimum: {
    /** |Lc| >= 75: suitable for body text */
    bodyText: boolean;
    /** |Lc| >= 60: suitable for large text (24px+) */
    largeText: boolean;
    /** |Lc| >= 45: suitable for non-text elements and large bold text */
    nonText: boolean;
    /** |Lc| >= 30: suitable for spot text, placeholders */
    spotText: boolean;
  };
}

/**
 * Service for APCA (Accessible Perceptual Contrast Algorithm) calculations.
 *
 * APCA is the contrast algorithm proposed for WCAG 3.0. Unlike WCAG 2.x contrast
 * ratios, APCA is polarity-aware: it distinguishes between dark text on a light
 * background (normal polarity) and light text on a dark background (reverse polarity).
 * The output is a signed lightness contrast value (Lc) on a roughly 0-106 scale.
 *
 * This implementation follows the APCA-W3 0.0.98G-4g specification (Myndex/Silver).
 */
export class APCAService {
  /**
   * Calculates the APCA luminance (Y) for a color.
   * Linearizes sRGB components and applies the APCA luminance coefficients.
   */
  private calculateY(color: Color): number {
    const srgbColor = conversionService.convert(color, 'srgb');
    const [r, g, b] = srgbColor.components as [number, number, number];

    const rLin = srgbToLinear(r);
    const gLin = srgbToLinear(g);
    const bLin = srgbToLinear(b);

    return APCA_COEFFICIENTS.R * rLin + APCA_COEFFICIENTS.G * gLin + APCA_COEFFICIENTS.B * bLin;
  }

  /**
   * Applies the APCA soft-clamp pre-processing to a Y (luminance) value.
   * Negative values are floored to zero. Values below the soft-clamp threshold
   * are boosted by a power-curve offset to prevent artifacts in the SAPC calculation.
   */
  private softClampY(y: number): number {
    if (y < 0) {
      return 0;
    }
    if (y > SOFT_CLAMP.THRESHOLD) {
      return y;
    }
    return y + Math.pow(SOFT_CLAMP.THRESHOLD - y, SOFT_CLAMP.EXPONENT);
  }

  /**
   * Produces a human-readable interpretation string for a given absolute Lc value.
   */
  private interpretLc(absLc: number): string {
    if (absLc >= 90) {
      return 'Preferred for body text';
    }
    if (absLc >= APCA_THRESHOLDS.BODY_TEXT) {
      return 'Minimum for body text';
    }
    if (absLc >= APCA_THRESHOLDS.LARGE_TEXT) {
      return 'Minimum for large text (24px+)';
    }
    if (absLc >= APCA_THRESHOLDS.NON_TEXT) {
      return 'Minimum for non-text elements and large bold text';
    }
    if (absLc >= APCA_THRESHOLDS.SPOT_TEXT) {
      return 'Minimum for spot text and placeholders';
    }
    if (absLc >= APCA_THRESHOLDS.NON_CONTENT) {
      return 'Minimum for non-content borders and dividers only';
    }
    return 'Not suitable for any visible content';
  }

  /**
   * Calculates the APCA lightness contrast (Lc) between a text color and background color.
   *
   * The algorithm:
   * 1. Converts both colors to sRGB, linearizes, and computes luminance (Y).
   * 2. Applies soft-clamp pre-processing to both Y values.
   * 3. Determines polarity (normal = dark-on-light, reverse = light-on-dark).
   * 4. Applies asymmetric power curves to compute raw SAPC.
   * 5. Applies output clamp and scales to the 0-100+ Lc range.
   *
   * @param textColor - The foreground/text color
   * @param backgroundColor - The background color
   * @returns Full APCA result with Lc, polarity, and threshold compliance
   */
  calculateAPCA(textColor: Color, backgroundColor: Color): APCAResult {
    // Step 1: Calculate raw luminance
    const yTextRaw = this.calculateY(textColor);
    const yBgRaw = this.calculateY(backgroundColor);

    // Step 2: Soft-clamp pre-processing
    const yText = this.softClampY(yTextRaw);
    const yBg = this.softClampY(yBgRaw);

    // Step 3: Determine polarity and compute raw SAPC
    let sapc: number;
    let polarity: 'normal' | 'reverse';

    if (yBg > yText) {
      // Normal polarity: dark text on light background
      polarity = 'normal';
      sapc =
        (Math.pow(yBg, POWER_CURVES.NORMAL.BG) - Math.pow(yText, POWER_CURVES.NORMAL.TEXT)) *
        POWER_CURVES.SCALE;
    } else {
      // Reverse polarity: light text on dark background
      polarity = 'reverse';
      sapc =
        (Math.pow(yBg, POWER_CURVES.REVERSE.BG) - Math.pow(yText, POWER_CURVES.REVERSE.TEXT)) *
        POWER_CURVES.SCALE;
    }

    // Step 4: Output clamp and offset
    let lc: number;
    if (Math.abs(sapc) < OUTPUT_CLAMP.THRESHOLD) {
      lc = 0.0;
    } else if (sapc > 0) {
      lc = sapc - OUTPUT_CLAMP.OFFSET;
    } else {
      lc = sapc + OUTPUT_CLAMP.OFFSET;
    }

    // Step 5: Scale to 0-100+ range
    lc = lc * 100;

    const absLc = Math.abs(lc);

    return {
      Lc: lc,
      absLc,
      polarity,
      textLuminance: yText,
      backgroundLuminance: yBg,
      interpretation: this.interpretLc(absLc),
      meetsMinimum: {
        bodyText: absLc >= APCA_THRESHOLDS.BODY_TEXT,
        largeText: absLc >= APCA_THRESHOLDS.LARGE_TEXT,
        nonText: absLc >= APCA_THRESHOLDS.NON_TEXT,
        spotText: absLc >= APCA_THRESHOLDS.SPOT_TEXT,
      },
    };
  }

  /**
   * Suggests either black or white text for the given background,
   * choosing whichever yields a higher absolute Lc value.
   *
   * @param backgroundColor - The background color to evaluate against
   * @param targetLc - Optional minimum Lc target (informational; the method
   *   always returns the better of black or white regardless)
   * @returns Black (#000000) or white (#FFFFFF)
   */
  suggestTextColor(backgroundColor: Color, _targetLc?: number): Color {
    const black = Color.fromHex('#000000');
    const white = Color.fromHex('#FFFFFF');

    const blackResult = this.calculateAPCA(black, backgroundColor);
    const whiteResult = this.calculateAPCA(white, backgroundColor);

    if (whiteResult.absLc >= blackResult.absLc) {
      return white;
    }
    return black;
  }

  /**
   * Adjusts a text color's lightness to meet a target APCA Lc value
   * against the given background. Uses binary search in Oklch lightness space
   * for perceptually uniform adjustments.
   *
   * If the text color already meets the target, it is returned unchanged.
   * The search direction (lighter or darker) is determined by the background
   * luminance: for dark backgrounds the text is lightened, for light backgrounds
   * it is darkened.
   *
   * @param textColor - The text color to adjust
   * @param backgroundColor - The background to measure against
   * @param targetLc - The desired absolute Lc value (default: 75, minimum for body text)
   * @returns An adjusted color in the same color space as the input text color
   */
  adjustForAPCA(
    textColor: Color,
    backgroundColor: Color,
    targetLc: number = DEFAULT_TARGET_LC
  ): Color {
    const currentResult = this.calculateAPCA(textColor, backgroundColor);

    // Already meets the target
    if (currentResult.absLc >= targetLc) {
      return textColor;
    }

    // Convert to Oklch for perceptually uniform lightness manipulation
    const oklchColor = conversionService.convert(textColor, 'oklch');
    const bgY = this.calculateY(backgroundColor);
    const [, chroma, hue] = oklchColor.components as [number, number, number];

    // Determine search direction: lighten text on dark backgrounds, darken on light
    const shouldLighten = bgY < 0.5;

    let low = shouldLighten ? oklchColor.components[0]! : 0;
    let high = shouldLighten ? 1 : oklchColor.components[0]!;

    for (let i = 0; i < MAX_BINARY_SEARCH_ITERATIONS; i++) {
      const mid = (low + high) / 2;
      const candidate = Color.create('oklch', [mid, chroma, hue], textColor.alpha);
      const candidateResult = this.calculateAPCA(candidate, backgroundColor);

      if (candidateResult.absLc >= targetLc) {
        // Candidate meets the target; try to stay closer to the original color
        if (shouldLighten) {
          high = mid;
        } else {
          low = mid;
        }
      } else {
        // Not enough contrast; push further away from the background
        if (shouldLighten) {
          low = mid;
        } else {
          high = mid;
        }
      }
    }

    const finalLightness = (low + high) / 2;
    const adjustedOklch = Color.create('oklch', [finalLightness, chroma, hue], textColor.alpha);
    return conversionService.convert(adjustedOklch, textColor.space);
  }
}
