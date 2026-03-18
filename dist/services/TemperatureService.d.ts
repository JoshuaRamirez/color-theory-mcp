import { Color } from '../domain/values/Color.js';
/**
 * Information about a color at a specific Kelvin temperature.
 */
export interface TemperatureInfo {
    kelvin: number;
    color: {
        hex: string;
        rgb: {
            r: number;
            g: number;
            b: number;
        };
    };
    description: string;
    category: string;
}
/**
 * Result of estimating a color's correlated color temperature.
 */
export interface ColorTemperatureResult {
    estimatedKelvin: number;
    chromaticity: {
        x: number;
        y: number;
    };
    isOnPlanckianLocus: boolean;
    description: string;
    category: string;
}
/**
 * Service for converting between color temperatures (Kelvin) and sRGB colors.
 *
 * Kelvin-to-RGB uses the Tanner Helland approximation of blackbody radiation.
 * RGB-to-Kelvin uses McCamy's formula via CIE xy chromaticity coordinates.
 *
 * Planckian locus proximity is estimated using Euclidean distance in CIE 1960 uv space.
 */
export declare class TemperatureService {
    /**
     * Converts a Kelvin color temperature to its corresponding sRGB color.
     *
     * Uses the Tanner Helland algorithm, a fast polynomial/logarithmic
     * approximation of the Planckian (blackbody) radiation spectrum.
     *
     * @param kelvin - Color temperature in Kelvin (clamped to 1000-40000)
     * @returns TemperatureInfo with the hex color, RGB components, and description
     */
    kelvinToColor(kelvin: number): TemperatureInfo;
    /**
     * Estimates the correlated color temperature (CCT) of a color.
     *
     * Converts the color to CIE XYZ-D65, derives xy chromaticity,
     * then applies McCamy's cubic approximation formula for CCT.
     *
     * Planckian locus proximity is checked in CIE 1960 uv space:
     * a deltaUV below 0.02 indicates the color is close to a
     * blackbody radiator.
     *
     * @param color - Any Color instance
     * @returns ColorTemperatureResult with estimated Kelvin, chromaticity, and classification
     */
    colorToTemperature(color: Color): ColorTemperatureResult;
    /**
     * Generates a series of TemperatureInfo samples between two Kelvin values.
     *
     * @param startKelvin - Starting temperature (inclusive)
     * @param endKelvin - Ending temperature (inclusive)
     * @param steps - Number of evenly-spaced samples (minimum 2)
     * @returns Array of TemperatureInfo from startKelvin to endKelvin
     */
    generateTemperatureGradient(startKelvin: number, endKelvin: number, steps: number): TemperatureInfo[];
    /**
     * Returns a human-readable description and category for a Kelvin value.
     */
    private describeTemperature;
    /**
     * Checks whether a chromaticity coordinate (in CIE xy) lies near the
     * Planckian locus by comparing it against the expected blackbody
     * chromaticity at the given CCT in CIE 1960 uv space.
     *
     * The threshold is deltaUV < 0.02, which is the standard tolerance
     * used in lighting engineering for "on-locus" determination.
     *
     * @param x - CIE x chromaticity of the test color
     * @param y - CIE y chromaticity of the test color
     * @param cct - Estimated correlated color temperature
     * @returns True if the color is within 0.02 deltaUV of the Planckian locus
     */
    private isNearPlanckianLocus;
    /**
     * Approximates the CIE 1960 uv coordinates on the Planckian locus
     * at a given color temperature using Krystek's rational polynomial
     * approximation. Accurate to ~1e-5 for 1000K-15000K; reasonable
     * extrapolation beyond that range.
     */
    private planckianLocusUV;
}
//# sourceMappingURL=TemperatureService.d.ts.map