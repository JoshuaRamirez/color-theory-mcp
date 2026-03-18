import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * Display P3 color space implementation.
 * A wide gamut color space used by Apple devices and modern displays.
 * Uses the same transfer function as sRGB but with wider primaries.
 */
export declare class DisplayP3ColorSpace implements IColorSpace {
    readonly type: "display-p3";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Red", "Green", "Blue"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=DisplayP3ColorSpace.d.ts.map