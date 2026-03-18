import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
/**
 * HSV color space implementation.
 * Hue, Saturation, Value - used in many graphics applications.
 * Also known as HSB (Hue, Saturation, Brightness).
 */
export declare class HsvColorSpace implements IColorSpace {
    readonly type: "hsv";
    readonly componentCount = 3;
    readonly componentNames: readonly ["Hue", "Saturation", "Value"];
    toXyzD65(color: Color): Color;
    fromXyzD65(color: Color): Color;
    isInGamut(components: readonly number[]): boolean;
    clampToGamut(components: readonly number[]): readonly number[];
}
//# sourceMappingURL=HsvColorSpace.d.ts.map