import { SRGB_GAMMA } from './constants.js';
/**
 * Converts a single sRGB component (gamma-encoded) to linear.
 * IEC 61966-2-1:1999 standard
 */
export function srgbToLinear(value) {
    if (value <= SRGB_GAMMA.THRESHOLD) {
        return value / SRGB_GAMMA.LINEAR_FACTOR;
    }
    return Math.pow((value + SRGB_GAMMA.OFFSET) / (1 + SRGB_GAMMA.OFFSET), SRGB_GAMMA.GAMMA);
}
/**
 * Converts a single linear RGB component to sRGB (gamma-encoded).
 * IEC 61966-2-1:1999 standard
 */
export function linearToSrgb(value) {
    if (value <= SRGB_GAMMA.THRESHOLD / SRGB_GAMMA.LINEAR_FACTOR) {
        return value * SRGB_GAMMA.LINEAR_FACTOR;
    }
    return (1 + SRGB_GAMMA.OFFSET) * Math.pow(value, 1 / SRGB_GAMMA.GAMMA) - SRGB_GAMMA.OFFSET;
}
/**
 * Applies sRGB gamma encoding to RGB triplet.
 */
export function applyGamma(rgb) {
    return [linearToSrgb(rgb[0]), linearToSrgb(rgb[1]), linearToSrgb(rgb[2])];
}
/**
 * Removes sRGB gamma encoding from RGB triplet.
 */
export function removeGamma(rgb) {
    return [srgbToLinear(rgb[0]), srgbToLinear(rgb[1]), srgbToLinear(rgb[2])];
}
//# sourceMappingURL=gamma.js.map