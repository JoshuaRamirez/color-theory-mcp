import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * Linear sRGB color space implementation.
 * sRGB without gamma encoding - used for color math operations.
 */
export declare class LinearSrgbColorSpace implements IColorSpace {
    readonly type: "linear-srgb";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Red", "Green", "Blue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=LinearSrgbColorSpace.d.ts.map