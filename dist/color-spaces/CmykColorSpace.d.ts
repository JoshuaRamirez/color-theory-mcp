import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * CMYK color space implementation.
 * Cyan, Magenta, Yellow, Key (Black) - subtractive color model for print.
 *
 * Note: This is a simplified device-independent CMYK approximation.
 * Real CMYK conversions require ICC profiles for accuracy.
 */
export declare class CmykColorSpace implements IColorSpace {
    readonly type: "cmyk";
    readonly componentCount = 4;
    readonly componentNames: readonly ["Cyan", "Magenta", "Yellow", "Key (Black)"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=CmykColorSpace.d.ts.map