import { Color } from '../domain/values/Color.js';
import { Matrix3x3 } from '../domain/values/Matrix3x3.js';
import { XYZ_D65_TO_D50, XYZ_D50_TO_D65 } from './constants.js';
/**
 * ProPhoto RGB transfer function constants.
 * ROMM RGB standard with gamma 1.8.
 */
const PROPHOTO_GAMMA = 1.8;
const PROPHOTO_CUTOFF = 1 / 512; // 0.001953125
/**
 * ProPhoto RGB to XYZ-D50 transformation matrix.
 * Based on ROMM RGB primaries with D50 white point.
 */
const PROPHOTO_TO_XYZ_D50 = Matrix3x3.create([
    [0.7977604, 0.1351917, 0.0313534],
    [0.2880711, 0.7118432, 0.0000857],
    [0.0000000, 0.0000000, 0.8251046],
]);
/**
 * XYZ-D50 to ProPhoto RGB transformation matrix.
 */
const XYZ_D50_TO_PROPHOTO = Matrix3x3.create([
    [1.3457989, -0.2555801, -0.0511557],
    [-0.5459137, 1.5081673, 0.0205351],
    [0.0000000, 0.0000000, 1.2118128],
]);
/**
 * Converts a single ProPhoto RGB gamma-encoded component to linear.
 * ROMM RGB transfer function (inverse OETF).
 */
function proPhotoToLinear(value) {
    if (value >= 16 * PROPHOTO_CUTOFF) {
        return Math.pow(value, PROPHOTO_GAMMA);
    }
    return value / 16;
}
/**
 * Converts a single linear component to ProPhoto RGB gamma-encoded.
 * ROMM RGB transfer function (OETF).
 */
function linearToProPhoto(value) {
    if (value >= PROPHOTO_CUTOFF) {
        return Math.pow(value, 1 / PROPHOTO_GAMMA);
    }
    return 16 * value;
}
/**
 * ProPhoto RGB (ROMM RGB) color space implementation.
 * An extremely wide gamut color space used in professional photography.
 * Uses D50 white point, requiring Bradford chromatic adaptation to/from D65.
 */
export class ProPhotoRgbColorSpace {
    type = 'prophoto-rgb';
    componentCount = 3;
    componentNames = ['Red', 'Green', 'Blue'];
    toXyzD65(color) {
        if (color.space !== 'prophoto-rgb') {
            throw new Error(`Expected prophoto-rgb color, got ${color.space}`);
        }
        const [r, g, b] = color.components;
        // Remove ProPhoto gamma encoding
        const linearRgb = [
            proPhotoToLinear(r),
            proPhotoToLinear(g),
            proPhotoToLinear(b),
        ];
        // Transform to XYZ-D50
        const xyzD50 = PROPHOTO_TO_XYZ_D50.multiplyVector(linearRgb);
        // Chromatic adaptation from D50 to D65 (Bradford)
        const xyzD65 = XYZ_D50_TO_D65.multiplyVector(xyzD50);
        return Color.create('xyz-d65', xyzD65, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz = color.components;
        // Chromatic adaptation from D65 to D50 (Bradford)
        const xyzD50 = XYZ_D65_TO_D50.multiplyVector(xyz);
        // Transform to linear ProPhoto RGB
        const linearRgb = XYZ_D50_TO_PROPHOTO.multiplyVector(xyzD50);
        // Apply ProPhoto gamma encoding
        const encoded = [
            linearToProPhoto(linearRgb[0]),
            linearToProPhoto(linearRgb[1]),
            linearToProPhoto(linearRgb[2]),
        ];
        return Color.create('prophoto-rgb', encoded, color.alpha);
    }
    isInGamut(components) {
        return components.every(c => c >= 0 && c <= 1);
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, Math.min(1, c)));
    }
}
//# sourceMappingURL=ProPhotoRgbColorSpace.js.map