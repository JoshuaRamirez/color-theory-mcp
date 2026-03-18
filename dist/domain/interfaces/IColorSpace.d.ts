import type { Color } from '../values/Color.js';
import type { ColorSpaceType } from '../values/ColorSpaceType.js';
/**
 * Interface for color space converters.
 *
 * Each color space implements this interface to provide
 * bidirectional conversion to/from XYZ-D65 (the connection space).
 */
export interface IColorSpace {
    /**
     * The color space type identifier.
     */
    readonly type: ColorSpaceType;
    /**
     * The number of components in this color space.
     */
    readonly componentCount: number;
    /**
     * Human-readable names for each component.
     */
    readonly componentNames: readonly string[];
    /**
     * Converts a color from this space to XYZ-D65.
     */
    toXyzD65(color: Color): Color;
    /**
     * Converts a color from XYZ-D65 to this space.
     */
    fromXyzD65(color: Color): Color;
    /**
     * Checks if components are within valid range for this space.
     */
    isInGamut(components: readonly number[]): boolean;
    /**
     * Clamps components to valid range for this space.
     */
    clampToGamut(components: readonly number[]): readonly number[];
}
/**
 * Registry for color space implementations.
 */
export interface IColorSpaceRegistry {
    /**
     * Registers a color space implementation.
     */
    register(space: IColorSpace): void;
    /**
     * Gets a color space implementation by type.
     */
    get(type: ColorSpaceType): IColorSpace | undefined;
    /**
     * Lists all registered color space types.
     */
    list(): readonly ColorSpaceType[];
}
//# sourceMappingURL=IColorSpace.d.ts.map