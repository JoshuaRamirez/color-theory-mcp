import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * CIE XYZ color space with D50 illuminant.
 * D50 is the standard illuminant for print/prepress workflows.
 */
export declare class XyzD50ColorSpace implements IColorSpace {
    readonly type: "xyz-d50";
    readonly componentCount = 3;
    readonly componentNames: readonly ["X", "Y", "Z"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=XyzD50ColorSpace.d.ts.map