import { Color } from '../domain/values/Color.js';
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
export declare class APCAService {
    /**
     * Calculates the APCA luminance (Y) for a color.
     * Linearizes sRGB components and applies the APCA luminance coefficients.
     */
    private calculateY;
    /**
     * Applies the APCA soft-clamp pre-processing to a Y (luminance) value.
     * Negative values are floored to zero. Values below the soft-clamp threshold
     * are boosted by a power-curve offset to prevent artifacts in the SAPC calculation.
     */
    private softClampY;
    /**
     * Produces a human-readable interpretation string for a given absolute Lc value.
     */
    private interpretLc;
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
    calculateAPCA(textColor: Color, backgroundColor: Color): APCAResult;
    /**
     * Suggests either black or white text for the given background,
     * choosing whichever yields a higher absolute Lc value.
     *
     * @param backgroundColor - The background color to evaluate against
     * @param targetLc - Optional minimum Lc target (informational; the method
     *   always returns the better of black or white regardless)
     * @returns Black (#000000) or white (#FFFFFF)
     */
    suggestTextColor(backgroundColor: Color, _targetLc?: number): Color;
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
    adjustForAPCA(textColor: Color, backgroundColor: Color, targetLc?: number): Color;
}
//# sourceMappingURL=APCAService.d.ts.map