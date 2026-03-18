import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * CIE Lab color space implementation.
 * A perceptually uniform color space (approximately).
 */
export declare class LabColorSpace implements IColorSpace {
    readonly type: "lab";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Lightness", "a*", "b*"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=LabColorSpace.d.ts.map