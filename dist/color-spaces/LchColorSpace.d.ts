import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * CIE LCH color space implementation.
 * Cylindrical representation of Lab (Lightness, Chroma, Hue).
 * More intuitive for color selection than Lab.
 */
export declare class LchColorSpace implements IColorSpace {
    readonly type: "lch";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Lightness", "Chroma", "Hue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=LchColorSpace.d.ts.map