/**
 * Converts a single sRGB component (gamma-encoded) to linear.
 * IEC 61966-2-1:1999 standard
 */
export declare function srgbToLinear(value: number): number;
/**
 * Converts a single linear RGB component to sRGB (gamma-encoded).
 * IEC 61966-2-1:1999 standard
 */
export declare function linearToSrgb(value: number): number;
/**
 * Applies sRGB gamma encoding to RGB triplet.
 */
export declare function applyGamma(rgb: readonly [number, number, number]): [number, number, number];
/**
 * Removes sRGB gamma encoding from RGB triplet.
 */
export declare function removeGamma(rgb: readonly [number, number, number]): [number, number, number];
//# sourceMappingURL=gamma.d.ts.map