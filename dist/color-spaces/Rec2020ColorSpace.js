import { Color } from '../domain/values/Color.js';
import { Matrix3x3 } from '../domain/values/Matrix3x3.js';
/**
 * Rec2020 transfer function constants.
 * ITU-R BT.2020-2 standard.
 */
const REC2020_ALPHA = 1.09929682680944;
const REC2020_BETA = 0.018053968510807;
/**
 * Rec.2020 (ITU-R BT.2020) to XYZ-D65 transformation matrix.
 */
const REC2020_TO_XYZ_D65 = Matrix3x3.create([
    [0.6369580, 0.1446169, 0.1688810],
    [0.2627002, 0.6779981, 0.0593017],
    [0.0000000, 0.0280727, 1.0609851],
]);
/**
 * XYZ-D65 to Rec.2020 transformation matrix.
 */
const XYZ_D65_TO_REC2020 = Matrix3x3.create([
    [1.7166512, -0.3556708, -0.2533663],
    [-0.6666844, 1.6164812, 0.0157685],
    [0.0176399, -0.0427706, 0.9421031],
]);
/**
 * Converts a single Rec2020 gamma-encoded component to linear.
 * ITU-R BT.2020 transfer function (inverse OETF).
 */
function rec2020ToLinear(value) {
    if (value >= REC2020_BETA * 4.5) {
        return Math.pow((value + REC2020_ALPHA - 1) / REC2020_ALPHA, 1 / 0.45);
    }
    return value / 4.5;
}
/**
 * Converts a single linear component to Rec2020 gamma-encoded.
 * ITU-R BT.2020 transfer function (OETF).
 */
function linearToRec2020(value) {
    if (value >= REC2020_BETA) {
        return REC2020_ALPHA * Math.pow(value, 0.45) - (REC2020_ALPHA - 1);
    }
    return 4.5 * value;
}
/**
 * ITU-R BT.2020 color space implementation.
 * A wide gamut color space used for HDR and UHD broadcast content.
 * Uses its own transfer function distinct from sRGB gamma.
 */
export class Rec2020ColorSpace {
    type = 'rec2020';
    componentCount = 3;
    componentNames = ['Red', 'Green', 'Blue'];
    toXyzD65(color) {
        if (color.space !== 'rec2020') {
            throw new Error(`Expected rec2020 color, got ${color.space}`);
        }
        const [r, g, b] = color.components;
        // Remove Rec2020 gamma encoding
        const linearRgb = [
            rec2020ToLinear(r),
            rec2020ToLinear(g),
            rec2020ToLinear(b),
        ];
        // Transform to XYZ-D65
        const xyz = REC2020_TO_XYZ_D65.multiplyVector(linearRgb);
        return Color.create('xyz-d65', xyz, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz = color.components;
        // Transform to linear Rec2020
        const linearRgb = XYZ_D65_TO_REC2020.multiplyVector(xyz);
        // Apply Rec2020 gamma encoding
        const encoded = [
            linearToRec2020(linearRgb[0]),
            linearToRec2020(linearRgb[1]),
            linearToRec2020(linearRgb[2]),
        ];
        return Color.create('rec2020', encoded, color.alpha);
    }
    isInGamut(components) {
        return components.every(c => c >= 0 && c <= 1);
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, Math.min(1, c)));
    }
}
//# sourceMappingURL=Rec2020ColorSpace.js.map