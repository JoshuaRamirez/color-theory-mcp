import { Color } from '../domain/values/Color.js';
import { SRGB_TO_XYZ_D65, XYZ_D65_TO_SRGB } from './constants.js';
import { removeGamma, applyGamma } from './gamma.js';
/**
 * sRGB color space implementation.
 * The standard RGB color space for the web (IEC 61966-2-1:1999).
 */
export class SrgbColorSpace {
    type = 'srgb';
    componentCount = 3;
    componentNames = ['Red', 'Green', 'Blue'];
    toXyzD65(color) {
        if (color.space !== 'srgb') {
            throw new Error(`Expected srgb color, got ${color.space}`);
        }
        const [r, g, b] = color.components;
        // Remove gamma encoding (linearize)
        const linearRgb = removeGamma([r, g, b]);
        // Transform to XYZ
        const xyz = SRGB_TO_XYZ_D65.multiplyVector(linearRgb);
        return Color.create('xyz-d65', xyz, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz = color.components;
        // Transform to linear RGB
        const linearRgb = XYZ_D65_TO_SRGB.multiplyVector(xyz);
        // Apply gamma encoding
        const srgb = applyGamma(linearRgb);
        return Color.create('srgb', srgb, color.alpha);
    }
    isInGamut(components) {
        return components.every(c => c >= 0 && c <= 1);
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, Math.min(1, c)));
    }
}
//# sourceMappingURL=SrgbColorSpace.js.map