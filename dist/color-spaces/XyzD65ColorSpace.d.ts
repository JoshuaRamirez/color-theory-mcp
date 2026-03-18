import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import type { Color } from '../domain/values/Color.js';
/**
 * CIE XYZ color space with D65 illuminant.
 * This is the "connection space" - all conversions go through XYZ-D65.
 */
export declare class XyzD65ColorSpace implements IColorSpace {
    readonly type: "xyz-d65";
    readonly componentCount = 3;
    readonly componentNames: readonly ["X", "Y", "Z"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=XyzD65ColorSpace.d.ts.map