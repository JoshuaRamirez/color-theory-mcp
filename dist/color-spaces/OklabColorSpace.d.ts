import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * Oklab color space implementation.
 * A perceptually uniform color space designed by Björn Ottosson.
 * Superior to Lab for hue linearity and lightness uniformity.
 *
 * Reference: https://bottosson.github.io/posts/oklab/
 */
export declare class OklabColorSpace implements IColorSpace {
    readonly type: "oklab";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Lightness", "a", "b"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=OklabColorSpace.d.ts.map