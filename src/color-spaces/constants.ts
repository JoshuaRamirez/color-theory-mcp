import { Matrix3x3 } from '../domain/values/Matrix3x3.js';

/**
 * Standard illuminant white points (chromaticity coordinates).
 */
export const ILLUMINANTS = {
  D65: { x: 0.31272, y: 0.32903, X: 0.95047, Y: 1.0, Z: 1.08883 },
  D50: { x: 0.34567, y: 0.35850, X: 0.96422, Y: 1.0, Z: 0.82521 },
  A: { x: 0.44757, y: 0.40745, X: 1.09850, Y: 1.0, Z: 0.35585 },
  E: { x: 0.33333, y: 0.33333, X: 1.0, Y: 1.0, Z: 1.0 },
} as const;

/**
 * sRGB to XYZ-D65 transformation matrix.
 * From IEC 61966-2-1:1999 (sRGB standard)
 */
export const SRGB_TO_XYZ_D65 = Matrix3x3.create([
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041],
]);

/**
 * XYZ-D65 to sRGB transformation matrix.
 * Inverse of SRGB_TO_XYZ_D65
 */
export const XYZ_D65_TO_SRGB = Matrix3x3.create([
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252],
]);

/**
 * Display P3 to XYZ-D65 transformation matrix.
 * Based on DCI-P3 primaries with D65 white point.
 */
export const DISPLAY_P3_TO_XYZ_D65 = Matrix3x3.create([
  [0.4865709, 0.2656677, 0.1982173],
  [0.2289746, 0.6917385, 0.0792869],
  [0.0000000, 0.0451134, 1.0439444],
]);

/**
 * XYZ-D65 to Display P3 transformation matrix.
 */
export const XYZ_D65_TO_DISPLAY_P3 = Matrix3x3.create([
  [2.4934969, -0.9313836, -0.4027108],
  [-0.8294890, 1.7626641, 0.0236247],
  [0.0358458, -0.0761724, 0.9568845],
]);

/**
 * XYZ-D65 to XYZ-D50 chromatic adaptation (Bradford).
 */
export const XYZ_D65_TO_D50 = Matrix3x3.create([
  [1.0478112, 0.0228866, -0.0501270],
  [0.0295424, 0.9904844, -0.0170491],
  [-0.0092345, 0.0150436, 0.7521316],
]);

/**
 * XYZ-D50 to XYZ-D65 chromatic adaptation (Bradford).
 */
export const XYZ_D50_TO_D65 = Matrix3x3.create([
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.0204830, 1.3299098],
]);

/**
 * Oklab M1 matrix (LMS-like to Oklab).
 * From Björn Ottosson's specification.
 */
export const OKLAB_M1 = Matrix3x3.create([
  [0.8189330101, 0.3618667424, -0.1288597137],
  [0.0329845436, 0.9293118715, 0.0361456387],
  [0.0482003018, 0.2643662691, 0.6338517070],
]);

/**
 * Oklab M2 matrix (cone response to Oklab).
 */
export const OKLAB_M2 = Matrix3x3.create([
  [0.2104542553, 0.7936177850, -0.0040720468],
  [1.9779984951, -2.4285922050, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.8086757660],
]);

/**
 * Inverse of Oklab M1.
 */
export const OKLAB_M1_INV = Matrix3x3.create([
  [1.2270138511, -0.5577999807, 0.2812561490],
  [-0.0405801784, 1.1122568696, -0.0716766787],
  [-0.0763812845, -0.4214819784, 1.5861632204],
]);

/**
 * Inverse of Oklab M2.
 */
export const OKLAB_M2_INV = Matrix3x3.create([
  [1.0000000000, 0.3963377774, 0.2158037573],
  [1.0000000000, -0.1055613458, -0.0638541728],
  [1.0000000000, -0.0894841775, -1.2914855480],
]);

/**
 * sRGB gamma transfer function constants.
 */
export const SRGB_GAMMA = {
  THRESHOLD: 0.04045,
  LINEAR_FACTOR: 12.92,
  GAMMA: 2.4,
  OFFSET: 0.055,
} as const;

/**
 * Lab constants for D65 white point.
 */
export const LAB_CONSTANTS = {
  EPSILON: 216 / 24389, // 0.008856
  KAPPA: 24389 / 27, // 903.3
  WHITE_D65: ILLUMINANTS.D65,
  WHITE_D50: ILLUMINANTS.D50,
} as const;
