import { Color } from '../domain/values/Color.js';
import { DISPLAY_P3_TO_XYZ_D65, XYZ_D65_TO_DISPLAY_P3 } from './constants.js';
import { removeGamma, applyGamma } from './gamma.js';
/**
 * Display P3 color space implementation.
 * A wide gamut color space used by Apple devices and modern displays.
 * Uses the same transfer function as sRGB but with wider primaries.
 */
export class DisplayP3ColorSpace {
    type = 'display-p3';
    componentCount = 3;
    componentNames = ['Red', 'Green', 'Blue'];
    toXyzD65(color) {
        if (color.space !== 'display-p3') {
            throw new Error(`Expected display-p3 color, got ${color.space}`);
        }
        const [r, g, b] = color.components;
        // Remove gamma encoding (same as sRGB)
        const linearRgb = removeGamma([r, g, b]);
        // Transform to XYZ using Display P3 matrix
        const xyz = DISPLAY_P3_TO_XYZ_D65.multiplyVector(linearRgb);
        return Color.create('xyz-d65', xyz, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz = color.components;
        // Transform to linear Display P3
        const linearRgb = XYZ_D65_TO_DISPLAY_P3.multiplyVector(xyz);
        // Apply gamma encoding (same as sRGB)
        const p3 = applyGamma(linearRgb);
        return Color.create('display-p3', p3, color.alpha);
    }
    isInGamut(components) {
        return components.every(c => c >= 0 && c <= 1);
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, Math.min(1, c)));
    }
}
//# sourceMappingURL=DisplayP3ColorSpace.js.map