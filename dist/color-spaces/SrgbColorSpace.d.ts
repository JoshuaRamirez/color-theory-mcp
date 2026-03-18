import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * sRGB color space implementation.
 * The standard RGB color space for the web (IEC 61966-2-1:1999).
 */
export declare class SrgbColorSpace implements IColorSpace {
    readonly type: "srgb";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Red", "Green", "Blue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=SrgbColorSpace.d.ts.map