/**
 * Enumeration of supported color spaces.
 *
 * Organization:
 * - RGB-family: sRGB, Linear RGB, Display P3
 * - XYZ-based: XYZ-D65, XYZ-D50
 * - Perceptual uniform: Lab, LCH, Oklab, Oklch
 * - Artist-intuitive: HSL, HSV, HWB
 * - Print: CMYK
 */
export type ColorSpaceType = 'srgb' | 'linear-srgb' | 'display-p3' | 'rec2020' | 'prophoto-rgb' | 'acescg' | 'xyz-d65' | 'xyz-d50' | 'lab' | 'lch' | 'oklab' | 'oklch' | 'hsl' | 'hsv' | 'hwb' | 'cmyk';
export declare const COLOR_SPACE_COMPONENTS: Record<ColorSpaceType, readonly string[]>;
export declare const COLOR_SPACE_RANGES: Record<ColorSpaceType, readonly {
    min: number;
    max: number;
}[]>;
export declare function isValidColorSpace(space: string): space is ColorSpaceType;
//# sourceMappingURL=ColorSpaceType.d.ts.map