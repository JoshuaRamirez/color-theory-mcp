import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * HWB color space implementation.
 * Hue, Whiteness, Blackness - an intuitive color model for color selection.
 * Defined in CSS Color Level 4.
 */
export declare class HwbColorSpace implements IColorSpace {
    readonly type: "hwb";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Hue", "Whiteness", "Blackness"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=HwbColorSpace.d.ts.map