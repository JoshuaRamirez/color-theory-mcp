import { Color } from '../domain/values/Color.js';
import { ConversionService } from './ConversionService.js';
import { srgbToLinear } from '../color-spaces/gamma.js';
const conversionService = new ConversionService();
/**
 * WCAG contrast thresholds.
 */
const WCAG_THRESHOLDS = {
    AA: { normal: 4.5, large: 3.0 },
    AAA: { normal: 7.0, large: 4.5 },
};
/**
 * Service for WCAG accessibility contrast calculations.
 */
export class ContrastService {
    /**
     * Calculates the relative luminance of a color.
     * Formula from WCAG 2.1: https://www.w3.org/WAI/GL/wiki/Relative_luminance
     *
     * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
     * where R, G, B are linearized sRGB values
     */
    calculateLuminance(color) {
        // Convert to sRGB if needed
        const srgbColor = conversionService.convert(color, 'srgb');
        const [r, g, b] = srgbColor.components;
        // Linearize the sRGB values
        const rLin = srgbToLinear(r);
        const gLin = srgbToLinear(g);
        const bLin = srgbToLinear(b);
        // Calculate relative luminance
        return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
    }
    /**
     * Calculates the contrast ratio between two colors.
     * Formula from WCAG 2.1: (L1 + 0.05) / (L2 + 0.05)
     * where L1 is the lighter color's luminance
     */
    calculateContrastRatio(foreground, background) {
        const L1 = this.calculateLuminance(foreground);
        const L2 = this.calculateLuminance(background);
        // Ensure L1 is the lighter color
        const lighter = Math.max(L1, L2);
        const darker = Math.min(L1, L2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    /**
     * Checks WCAG contrast compliance and returns detailed results.
     */
    checkContrast(foreground, background) {
        const fgLum = this.calculateLuminance(foreground);
        const bgLum = this.calculateLuminance(background);
        const ratio = this.calculateContrastRatio(foreground, background);
        return {
            ratio,
            ratioString: `${ratio.toFixed(2)}:1`,
            passes: {
                AA: {
                    normal: ratio >= WCAG_THRESHOLDS.AA.normal,
                    large: ratio >= WCAG_THRESHOLDS.AA.large,
                },
                AAA: {
                    normal: ratio >= WCAG_THRESHOLDS.AAA.normal,
                    large: ratio >= WCAG_THRESHOLDS.AAA.large,
                },
            },
            foregroundLuminance: fgLum,
            backgroundLuminance: bgLum,
        };
    }
    /**
     * Checks if a color combination meets a specific WCAG level.
     */
    meetsWCAG(foreground, background, level, textSize) {
        const ratio = this.calculateContrastRatio(foreground, background);
        const threshold = WCAG_THRESHOLDS[level][textSize];
        return ratio >= threshold;
    }
    /**
     * Suggests a foreground color that meets WCAG AA for the given background.
     * Returns either black or white depending on which provides better contrast.
     */
    suggestForeground(background) {
        const bgLum = this.calculateLuminance(background);
        // If background is dark, use white text; otherwise use black
        // Threshold chosen to optimize contrast
        if (bgLum < 0.179) {
            return Color.fromHex('#FFFFFF');
        }
        else {
            return Color.fromHex('#000000');
        }
    }
    /**
     * Finds the minimum lightness adjustment needed to meet WCAG requirements.
     * Uses Oklch for perceptually uniform lightness adjustments.
     */
    adjustForContrast(foreground, background, level = 'AA', textSize = 'normal') {
        const threshold = WCAG_THRESHOLDS[level][textSize];
        const currentRatio = this.calculateContrastRatio(foreground, background);
        if (currentRatio >= threshold) {
            return foreground; // Already meets requirements
        }
        // Convert to Oklch for perceptual adjustments
        const oklchColor = conversionService.convert(foreground, 'oklch');
        const bgLum = this.calculateLuminance(background);
        const [, c, h] = oklchColor.components;
        // Determine direction to adjust (lighter or darker)
        const shouldLighten = bgLum < 0.5;
        // Binary search for the right lightness
        let low = shouldLighten ? oklchColor.components[0] : 0;
        let high = shouldLighten ? 1 : oklchColor.components[0];
        for (let i = 0; i < 20; i++) {
            const mid = (low + high) / 2;
            const testColor = Color.create('oklch', [mid, c, h], foreground.alpha);
            const testRatio = this.calculateContrastRatio(testColor, background);
            if (testRatio >= threshold) {
                if (shouldLighten) {
                    high = mid;
                }
                else {
                    low = mid;
                }
            }
            else {
                if (shouldLighten) {
                    low = mid;
                }
                else {
                    high = mid;
                }
            }
        }
        const finalL = (low + high) / 2;
        const adjustedOklch = Color.create('oklch', [finalL, c, h], foreground.alpha);
        return conversionService.convert(adjustedOklch, foreground.space);
    }
    /**
     * Gets the WCAG threshold for a given level and text size.
     */
    getThreshold(level, textSize) {
        return WCAG_THRESHOLDS[level][textSize];
    }
}
//# sourceMappingURL=ContrastService.js.map