import { Color } from '../domain/values/Color.js';
import { LAB_CONSTANTS, ILLUMINANTS } from './constants.js';
const { EPSILON, KAPPA } = LAB_CONSTANTS;
const { X: Xn, Y: Yn, Z: Zn } = ILLUMINANTS.D65;
/**
 * Helper: Lab f function
 */
function labF(t) {
    if (t > EPSILON) {
        return Math.cbrt(t);
    }
    return (KAPPA * t + 16) / 116;
}
/**
 * Helper: Inverse Lab f function
 */
function labFInverse(t) {
    const t3 = t * t * t;
    if (t3 > EPSILON) {
        return t3;
    }
    return (116 * t - 16) / KAPPA;
}
/**
 * CIE Lab color space implementation.
 * A perceptually uniform color space (approximately).
 */
export class LabColorSpace {
    type = 'lab';
    componentCount = 3;
    componentNames = ['Lightness', 'a*', 'b*'];
    toXyzD65(color) {
        if (color.space !== 'lab') {
            throw new Error(`Expected lab color, got ${color.space}`);
        }
        const [L, a, b] = color.components;
        // Lab to XYZ
        const fy = (L + 16) / 116;
        const fx = a / 500 + fy;
        const fz = fy - b / 200;
        const x = labFInverse(fx) * Xn;
        const y = labFInverse(fy) * Yn;
        const z = labFInverse(fz) * Zn;
        return Color.create('xyz-d65', [x, y, z], color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const [x, y, z] = color.components;
        // Normalize by white point
        const xr = x / Xn;
        const yr = y / Yn;
        const zr = z / Zn;
        const fx = labF(xr);
        const fy = labF(yr);
        const fz = labF(zr);
        const L = 116 * fy - 16;
        const a = 500 * (fx - fy);
        const b = 200 * (fy - fz);
        return Color.create('lab', [L, a, b], color.alpha);
    }
    isInGamut(components) {
        const [L, a, b] = components;
        // Lab has no strict gamut, but practical ranges exist
        return L >= 0 && L <= 100 && Math.abs(a) <= 128 && Math.abs(b) <= 128;
    }
    clampToGamut(components) {
        const [L, a, b] = components;
        return [
            Math.max(0, Math.min(100, L)),
            Math.max(-128, Math.min(127, a)),
            Math.max(-128, Math.min(127, b)),
        ];
    }
}
//# sourceMappingURL=LabColorSpace.js.map