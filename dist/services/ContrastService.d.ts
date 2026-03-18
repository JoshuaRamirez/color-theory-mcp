import { Color } from '../domain/values/Color.js';
/**
 * WCAG conformance levels.
 */
export type WCAGLevel = 'AA' | 'AAA';
/**
 * Text size categories for WCAG.
 */
export type TextSize = 'normal' | 'large';
/**
 * Result of a WCAG contrast check.
 */
export interface ContrastResult {
    ratio: number;
    ratioString: string;
    passes: {
        AA: {
            normal: boolean;
            large: boolean;
        };
        AAA: {
            normal: boolean;
            large: boolean;
        };
    };
    foregroundLuminance: number;
    backgroundLuminance: number;
}
/**
 * Service for WCAG accessibility contrast calculations.
 */
export declare class ContrastService {
    /**
     * Calculates the relative luminance of a color.
     * Formula from WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
     *
     * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
     * where R, G, B are linearized sRGB values
     */
    calculateLuminance(color: Color): number;
    /**
     * Calculates the contrast ratio between two colors.
     * Formula from WCAG 2.1: (L1 + 0.05) / (L2 + 0.05)
     * where L1 is the lighter color's luminance
     */
    calculateContrastRatio(foreground: Color, background: Color): number;
    /**
     * Checks WCAG contrast compliance and returns detailed results.
     */
    checkContrast(foreground: Color, background: Color): ContrastResult;
    /**
     * Checks if a color combination meets a specific WCAG level.
     */
    meetsWCAG(foreground: Color, background: Color, level: WCAGLevel, textSize: TextSize): boolean;
    /**
     * Suggests a foreground color that meets WCAG AA for the given background.
     * Returns either black or white depending on which provides better contrast.
     */
    suggestForeground(background: Color): Color;
    /**
     * Finds the minimum lightness adjustment needed to meet WCAG requirements.
     * Uses Oklch for perceptually uniform lightness adjustments.
     */
    adjustForContrast(foreground: Color, background: Color, level?: WCAGLevel, textSize?: TextSize): Color;
    /**
     * Gets the WCAG threshold for a given level and text size.
     */
    getThreshold(level: WCAGLevel, textSize: TextSize): number;
}
//# sourceMappingURL=ContrastService.d.ts.map