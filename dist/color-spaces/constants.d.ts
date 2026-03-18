import { Matrix3x3 } from '../domain/values/Matrix3x3.js';
/**
 * Standard illuminant white points (chromaticity coordinates).
 */
export declare const ILLUMINANTS: {
    readonly D65: {
        readonly x: 0.31272;
        readonly y: 0.32903;
        readonly X: 0.95047;
        readonly Y: 1;
        readonly Z: 1.08883;
    };
    readonly D50: {
        readonly x: 0.34567;
        readonly y: 0.3585;
        readonly X: 0.96422;
        readonly Y: 1;
        readonly Z: 0.82521;
    };
    readonly A: {
        readonly x: 0.44757;
        readonly y: 0.40745;
        readonly X: 1.0985;
        readonly Y: 1;
        readonly Z: 0.35585;
    };
    readonly E: {
        readonly x: 0.33333;
        readonly y: 0.33333;
        readonly X: 1;
        readonly Y: 1;
        readonly Z: 1;
    };
};
/**
 * sRGB to XYZ-D65 transformation matrix.
 * From IEC 61966-2-1:1999 (sRGB standard)
 */
export declare const SRGB_TO_XYZ_D65: Matrix3x3;
/**
 * XYZ-D65 to sRGB transformation matrix.
 * Inverse of SRGB_TO_XYZ_D65
 */
export declare const XYZ_D65_TO_SRGB: Matrix3x3;
/**
 * Display P3 to XYZ-D65 transformation matrix.
 * Based on DCI-P3 primaries with D65 white point.
 */
export declare const DISPLAY_P3_TO_XYZ_D65: Matrix3x3;
/**
 * XYZ-D65 to Display P3 transformation matrix.
 */
export declare const XYZ_D65_TO_DISPLAY_P3: Matrix3x3;
/**
 * XYZ-D65 to XYZ-D50 chromatic adaptation (Bradford).
 */
export declare const XYZ_D65_TO_D50: Matrix3x3;
/**
 * XYZ-D50 to XYZ-D65 chromatic adaptation (Bradford).
 */
export declare const XYZ_D50_TO_D65: Matrix3x3;
/**
 * Oklab M1 matrix (LMS-like to Oklab).
 * From Björn Ottosson's specification.
 */
export declare const OKLAB_M1: Matrix3x3;
/**
 * Oklab M2 matrix (cone response to Oklab).
 */
export declare const OKLAB_M2: Matrix3x3;
/**
 * Inverse of Oklab M1.
 */
export declare const OKLAB_M1_INV: Matrix3x3;
/**
 * Inverse of Oklab M2.
 */
export declare const OKLAB_M2_INV: Matrix3x3;
/**
 * sRGB gamma transfer function constants.
 */
export declare const SRGB_GAMMA: {
    readonly THRESHOLD: 0.04045;
    readonly LINEAR_FACTOR: 12.92;
    readonly GAMMA: 2.4;
    readonly OFFSET: 0.055;
};
/**
 * Lab constants for D65 white point.
 */
export declare const LAB_CONSTANTS: {
    readonly EPSILON: number;
    readonly KAPPA: number;
    readonly WHITE_D65: {
        readonly x: 0.31272;
        readonly y: 0.32903;
        readonly X: 0.95047;
        readonly Y: 1;
        readonly Z: 1.08883;
    };
    readonly WHITE_D50: {
        readonly x: 0.34567;
        readonly y: 0.3585;
        readonly X: 0.96422;
        readonly Y: 1;
        readonly Z: 0.82521;
    };
};
//# sourceMappingURL=constants.d.ts.map