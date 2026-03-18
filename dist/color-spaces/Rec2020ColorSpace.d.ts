import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * ITU-R BT.2020 color space implementation.
 * A wide gamut color space used for HDR and UHD broadcast content.
 * Uses its own transfer function distinct from sRGB gamma.
 */
export declare class Rec2020ColorSpace implements IColorSpace {
    readonly type: "rec2020";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Red", "Green", "Blue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=Rec2020ColorSpace.d.ts.map