import { Color } from '../domain/values/Color.js';
import { ConversionService } from './ConversionService.js';
const conversionService = new ConversionService();
/**
 * Minimum correlated color temperature supported (deep candlelight red).
 */
const MIN_KELVIN = 1000;
/**
 * Maximum correlated color temperature supported.
 */
const MAX_KELVIN = 40000;
/**
 * Temperature range descriptors, ordered from warmest to coolest.
 * Each entry defines the upper bound (exclusive) of a temperature band.
 */
const TEMPERATURE_BANDS = [
    { maxKelvin: 2000, description: 'Candlelight', category: 'warm' },
    { maxKelvin: 3000, description: 'Warm white (tungsten-like)', category: 'warm' },
    { maxKelvin: 4000, description: 'Warm white (halogen)', category: 'warm' },
    { maxKelvin: 5000, description: 'Neutral white (fluorescent)', category: 'neutral' },
    { maxKelvin: 6000, description: 'Daylight (noon sun)', category: 'daylight' },
    { maxKelvin: 7500, description: 'Cool daylight (overcast)', category: 'cool' },
    { maxKelvin: 10000, description: 'Blue sky', category: 'cool' },
    { maxKelvin: Infinity, description: 'Deep blue sky', category: 'cool' },
];
/**
 * Service for converting between color temperatures (Kelvin) and sRGB colors.
 *
 * Kelvin-to-RGB uses the Tanner Helland approximation of blackbody radiation.
 * RGB-to-Kelvin uses McCamy's formula via CIE xy chromaticity coordinates.
 *
 * Planckian locus proximity is estimated using Euclidean distance in CIE 1960 uv space.
 */
export class TemperatureService {
    /**
     * Converts a Kelvin color temperature to its corresponding sRGB color.
     *
     * Uses the Tanner Helland algorithm, a fast polynomial/logarithmic
     * approximation of the Planckian (blackbody) radiation spectrum.
     *
     * @param kelvin - Color temperature in Kelvin (clamped to 1000-40000)
     * @returns TemperatureInfo with the hex color, RGB components, and description
     */
    kelvinToColor(kelvin) {
        const clampedKelvin = Math.max(MIN_KELVIN, Math.min(MAX_KELVIN, kelvin));
        const temp = clampedKelvin / 100;
        let r;
        let g;
        let b;
        if (temp <= 66) {
            r = 255;
            g = 99.4708025861 * Math.log(temp) - 161.1195681661;
            b = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
        }
        else {
            r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
            g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
            b = 255;
        }
        // Clamp to valid 0-255 range
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        // Integer RGB for output
        const rInt = Math.round(r);
        const gInt = Math.round(g);
        const bInt = Math.round(b);
        // Normalize to 0-1 for Color
        const color = Color.create('srgb', [r / 255, g / 255, b / 255], 1);
        const clamped = conversionService.clampToGamut(color);
        const hex = clamped.toHex();
        const { description, category } = this.describeTemperature(clampedKelvin);
        return {
            kelvin: clampedKelvin,
            color: { hex, rgb: { r: rInt, g: gInt, b: bInt } },
            description,
            category,
        };
    }
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
    colorToTemperature(color) {
        // Convert to XYZ-D65
        const xyz = conversionService.convert(color, 'xyz-d65');
        const [X, Y, Z] = xyz.components;
        const sum = X + Y + Z;
        if (sum === 0) {
            // Pure black has no meaningful color temperature
            return {
                estimatedKelvin: 0,
                chromaticity: { x: 0, y: 0 },
                isOnPlanckianLocus: false,
                description: 'No measurable color temperature (black)',
                category: 'neutral',
            };
        }
        // CIE xy chromaticity
        const x = X / sum;
        const y = Y / sum;
        // McCamy's formula for correlated color temperature
        const n = (x - 0.332) / (0.1858 - y);
        const cct = 449 * Math.pow(n, 3) + 3525 * Math.pow(n, 2) + 6823.3 * n + 5520.33;
        // Determine Planckian locus proximity in CIE 1960 uv space
        const isOnLocus = this.isNearPlanckianLocus(x, y, cct);
        // Clamp CCT to a reasonable reporting range
        const reportedKelvin = Math.round(Math.max(MIN_KELVIN, Math.min(MAX_KELVIN, cct)));
        const { description, category } = this.describeTemperature(reportedKelvin);
        return {
            estimatedKelvin: reportedKelvin,
            chromaticity: { x, y },
            isOnPlanckianLocus: isOnLocus,
            description,
            category,
        };
    }
    /**
     * Generates a series of TemperatureInfo samples between two Kelvin values.
     *
     * @param startKelvin - Starting temperature (inclusive)
     * @param endKelvin - Ending temperature (inclusive)
     * @param steps - Number of evenly-spaced samples (minimum 2)
     * @returns Array of TemperatureInfo from startKelvin to endKelvin
     */
    generateTemperatureGradient(startKelvin, endKelvin, steps) {
        if (steps < 2) {
            throw new Error('Temperature gradient must have at least 2 steps');
        }
        const results = [];
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const kelvin = startKelvin + (endKelvin - startKelvin) * t;
            results.push(this.kelvinToColor(kelvin));
        }
        return results;
    }
    /**
     * Returns a human-readable description and category for a Kelvin value.
     */
    describeTemperature(kelvin) {
        for (const band of TEMPERATURE_BANDS) {
            if (kelvin < band.maxKelvin) {
                return { description: band.description, category: band.category };
            }
        }
        // Fallback (should not be reached due to Infinity sentinel)
        const last = TEMPERATURE_BANDS[TEMPERATURE_BANDS.length - 1];
        return { description: last.description, category: last.category };
    }
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
    isNearPlanckianLocus(x, y, cct) {
        // Convert test color xy to CIE 1960 uv
        const denominator = -2 * x + 12 * y + 3;
        if (denominator === 0) {
            return false;
        }
        const uTest = (4 * x) / denominator;
        const vTest = (6 * y) / denominator;
        // Approximate the Planckian locus point at the given CCT
        // using Krystek's approximation (valid 1000K-15000K, reasonable beyond)
        const planckianUV = this.planckianLocusUV(cct);
        const du = uTest - planckianUV.u;
        const dv = vTest - planckianUV.v;
        const deltaUV = Math.sqrt(du * du + dv * dv);
        return deltaUV < 0.02;
    }
    /**
     * Approximates the CIE 1960 uv coordinates on the Planckian locus
     * at a given color temperature using Krystek's rational polynomial
     * approximation. Accurate to ~1e-5 for 1000K-15000K; reasonable
     * extrapolation beyond that range.
     */
    planckianLocusUV(kelvin) {
        const T = kelvin;
        const T2 = T * T;
        const u = (0.860117757 + 1.54118254e-4 * T + 1.28641212e-7 * T2) /
            (1 + 8.42420235e-4 * T + 7.08145163e-7 * T2);
        const v = (0.317398726 + 4.22806245e-5 * T + 4.20481691e-8 * T2) /
            (1 - 2.89741816e-5 * T + 1.61456053e-7 * T2);
        return { u, v };
    }
}
//# sourceMappingURL=TemperatureService.js.map