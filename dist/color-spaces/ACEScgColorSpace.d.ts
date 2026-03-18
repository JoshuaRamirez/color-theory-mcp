import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * ACEScg (Academy Color Encoding System, computer graphics) color space implementation.
 * A scene-referred linear color space used in film and VFX production.
 * Uses AP1 primaries with D60 white point (adapted to D65 via Bradford).
 * No transfer function — values remain linear.
 * Supports values beyond 0-1 for scene-referred HDR content.
 */
export declare class ACEScgColorSpace implements IColorSpace {
    readonly type: "acescg";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Red", "Green", "Blue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=ACEScgColorSpace.d.ts.map