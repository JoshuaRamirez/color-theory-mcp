import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * Oklch color space implementation.
 * Cylindrical representation of Oklab (Lightness, Chroma, Hue).
 * The recommended color space for CSS Color Level 4 perceptual color manipulation.
 *
 * Reference: https://www.w3.org/TR/css-color-4/#ok-lab
 */
export declare class OklchColorSpace implements IColorSpace {
    readonly type: "oklch";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Lightness", "Chroma", "Hue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=OklchColorSpace.d.ts.map