import type { IColorSpaceRegistry } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import type { ColorSpaceType } from '../domain/values/ColorSpaceType.js';
/**
 * Service for converting colors between color spaces.
 * Uses XYZ-D65 as the connection space for all conversions.
 */
export declare class ConversionService {
    private readonly registry;
    constructor(registry?: IColorSpaceRegistry);
    /**
     * Converts a color to a different color space.
     * Uses XYZ-D65 as an intermediate for all conversions.
     */
    convert(color: Color, targetSpace: ColorSpaceType): Color;
    /**
     * Converts multiple colors to a target space.
     */
    convertBatch(colors: readonly Color[], targetSpace: ColorSpaceType): Color[];
    /**
     * Checks if a color is within the gamut of a target color space.
     */
    isInGamut(color: Color, targetSpace: ColorSpaceType): boolean;
    /**
     * Clamps a color to the gamut of its color space.
     * Uses simple component clamping (fast but may desaturate).
     */
    clampToGamut(color: Color): Color;
    /**
     * Maps a color into the gamut of a target space using perceptual
     * chroma reduction in Oklch. Based on CSS Color Level 4 §13.2.
     *
     * Instead of naively clamping RGB components (which shifts hue and
     * lightness), this holds Oklch hue and lightness constant while
     * binary-searching for the maximum chroma that still fits inside
     * the target gamut. The result is the closest perceptually uniform
     * in-gamut color.
     *
     * @param color - Any color in any supported space
     * @param targetSpace - The destination gamut (default: color's own space)
     * @param epsilon - Chroma convergence threshold (default 0.002)
     * @returns A color in targetSpace that is within gamut
     */
    mapToGamut(color: Color, targetSpace?: ColorSpaceType, epsilon?: number): Color;
    /**
     * Lists all available color spaces.
     */
    listColorSpaces(): readonly ColorSpaceType[];
}
//# sourceMappingURL=ConversionService.d.ts.map