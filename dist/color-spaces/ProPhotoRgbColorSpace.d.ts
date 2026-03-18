import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * ProPhoto RGB (ROMM RGB) color space implementation.
 * An extremely wide gamut color space used in professional photography.
 * Uses D50 white point, requiring Bradford chromatic adaptation to/from D65.
 */
export declare class ProPhotoRgbColorSpace implements IColorSpace {
    readonly type: "prophoto-rgb";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Red", "Green", "Blue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=ProPhotoRgbColorSpace.d.ts.map