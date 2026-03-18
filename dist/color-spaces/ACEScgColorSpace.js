import { Color } from '../domain/values/Color.js';
import { Matrix3x3 } from '../domain/values/Matrix3x3.js';
/**
 * Half-float maximum value, used as the scene-referred upper bound.
 */
const HALF_FLOAT_MAX = 65504;
/**
 * ACEScg (AP1) to XYZ-D65 transformation matrix.
 * Pre-combined with D60-to-D65 Bradford chromatic adaptation.
 */
const ACESCG_TO_XYZ_D65 = Matrix3x3.create([
    [0.6624542, 0.1340042, 0.1561877],
    [0.2722287, 0.6740818, 0.0536895],
    [-0.0055746, 0.0040607, 1.0103391],
]);
/**
 * XYZ-D65 to ACEScg (AP1) transformation matrix.
 * Pre-combined with D65-to-D60 Bradford chromatic adaptation.
 */
const XYZ_D65_TO_ACESCG = Matrix3x3.create([
    [1.6410234, -0.3248033, -0.2364247],
    [-0.6636629, 1.6153316, 0.0167563],
    [0.0117219, -0.0082844, 0.9883948],
]);
/**
 * ACEScg (Academy Color Encoding System, computer graphics) color space implementation.
 * A scene-referred linear color space used in film and VFX production.
 * Uses AP1 primaries with D60 white point (adapted to D65 via Bradford).
 * No transfer function — values remain linear.
 * Supports values beyond 0-1 for scene-referred HDR content.
 */
export class ACEScgColorSpace {
    type = 'acescg';
    componentCount = 3;
    componentNames = ['Red', 'Green', 'Blue'];
    toXyzD65(color) {
        if (color.space !== 'acescg') {
            throw new Error(`Expected acescg color, got ${color.space}`);
        }
        const rgb = color.components;
        // No transfer function — ACEScg is linear
        const xyz = ACESCG_TO_XYZ_D65.multiplyVector(rgb);
        return Color.create('xyz-d65', xyz, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz = color.components;
        // No transfer function — ACEScg is linear
        const rgb = XYZ_D65_TO_ACESCG.multiplyVector(xyz);
        return Color.create('acescg', rgb, color.alpha);
    }
    isInGamut(components) {
        // Scene-referred: allow values within half-float range
        return components.every((c) => c >= 0 && c <= HALF_FLOAT_MAX);
    }
    clampToGamut(components) {
        // Clamp to 0-1 for display mapping purposes
        return components.map((c) => Math.max(0, Math.min(1, c)));
    }
}
//# sourceMappingURL=ACEScgColorSpace.js.map