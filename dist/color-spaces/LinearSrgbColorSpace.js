import { Color } from '../domain/values/Color.js';
import { SRGB_TO_XYZ_D65, XYZ_D65_TO_SRGB } from './constants.js';
/**
 * Linear sRGB color space implementation.
 * sRGB without gamma encoding - used for color math operations.
 */
export class LinearSrgbColorSpace {
    type = 'linear-srgb';
    componentCount = 3;
    componentNames = ['Red', 'Green', 'Blue'];
    toXyzD65(color) {
        if (color.space !== 'linear-srgb') {
            throw new Error(`Expected linear-srgb color, got ${color.space}`);
        }
        const rgb = color.components;
        // Direct matrix transform (already linear)
        const xyz = SRGB_TO_XYZ_D65.multiplyVector(rgb);
        return Color.create('xyz-d65', xyz, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz = color.components;
        // Direct matrix transform
        const rgb = XYZ_D65_TO_SRGB.multiplyVector(xyz);
        return Color.create('linear-srgb', rgb, color.alpha);
    }
    isInGamut(components) {
        return components.every(c => c >= 0 && c <= 1);
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, Math.min(1, c)));
    }
}
//# sourceMappingURL=LinearSrgbColorSpace.js.map