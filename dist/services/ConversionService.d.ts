import type { IColorSpaceRegistry } from '../domain/interfaces/IColorSpace.js';
import type { Color } from '../domain/values/Color.js';
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
     */
    clampToGamut(color: Color): Color;
    /**
     * Lists all available color spaces.
     */
    listColorSpaces(): readonly ColorSpaceType[];
}
//# sourceMappingURL=ConversionService.d.ts.map