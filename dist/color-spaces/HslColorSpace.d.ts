import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * HSL color space implementation.
 * Hue, Saturation, Lightness - an artist-intuitive color model.
 * Note: HSL is device-dependent (based on sRGB).
 */
export declare class HslColorSpace implements IColorSpace {
    readonly type: "hsl";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Hue", "Saturation", "Lightness"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=HslColorSpace.d.ts.map