import { Matrix3x3 } from '../domain/values/Matrix3x3.js';

/**
 * Standard CAM16 Viewing Conditions (Average).
 * Defaulting to D65 standard illuminant and average surround.
 *
 * Parameters:
 * whitePoint: XYZ of reference white (D65)
 * adaptingLuminance (La): Luminance of adapting field (cd/m2)
 * backgroundLuminance (Yb): Luminance of background relative to reference white (0-1)
 * surround: 'average', 'dim', or 'dark'
 */
export const CAM16_VIEWING_CONDITIONS = {
  // sRGB standard conditions (approximate)
  sRGB: {
    whitePoint: [95.047, 100.0, 108.883], // XYZ D65 scaled to Y=100
    adaptingLuminance: 40, // La = 4 cd/m^2 to 400 cd/m^2 range (using ~64 lux / pi => 20-40 nits)
    backgroundLuminance: 20, // Yb = 20 (relative to Yw=100)
    surround: 'average',
    discounting: false,
  },
};

const SURROUND_PARAMS = {
  average: { F: 1.0, c: 0.69, Nc: 1.0 },
  dim: { F: 0.9, c: 0.59, Nc: 0.9 },
  dark: { F: 0.8, c: 0.525, Nc: 0.8 },
};

// M16 Matrix (XYZ to RGB_CAM16)
const M16 = Matrix3x3.create([
  [0.401288, 0.650173, -0.051461],
  [-0.250268, 1.204414, 0.045854],
  [-0.002079, 0.048952, 0.953127],
]);

// Inverse M16
const M16_INV = Matrix3x3.create([
  [1.8620678, -1.0112546, 0.1491867],
  [0.3875265, 0.6214474, -0.0089739],
  [-0.0158415, -0.0341229, 1.0499644],
]);

// Utility: Linearized RGB to compressed response
function nonlinearAdaptation(x: number, fl: number): number {
  const absX = Math.abs(x);
  const powX = Math.pow(absX, 0.42);
  const res = (400.0 * (fl * powX)) / (27.13 + fl * powX);
  return x >= 0 ? res : -res;
}

// Utility: Inverse compressed response
function inverseNonlinearAdaptation(x: number, fl: number): number {
  const absX = Math.abs(x);
  const num = 27.13 * absX;
  const den = 400.0 - absX;
  const val = Math.pow(num / (den * fl), 1.0 / 0.42);
  return x >= 0 ? val : -val;
}

/**
 * Converts XYZ (D65) to CAM16 (J, C, h).
 * Assumes average viewing conditions (sRGB standard).
 *
 * XYZ values are expected in 0-100 range (standard for CIECAM).
 * If your XYZ is 0-1, multiply by 100 first.
 */
export function xyzToCam16(
  x: number,
  y: number,
  z: number
): { J: number; C: number; h: number; M: number; s: number; Q: number } {
  // 1. Calculate Viewing Condition Parameters
  // (Pre-calculated for sRGB standard conditions for performance)
  // whitePoint = [95.047, 100.0, 108.883]
  // La = 40
  // Yb = 20

  const Yw = 100.0;
  // const Xw = 95.047; const Zw = 108.883;
  const La = 40.0;
  const Yb = 20.0;

  const { F, c, Nc } = SURROUND_PARAMS.average;

  const k = 1.0 / (5.0 * La + 1.0);
  const k4 = k * k * k * k;
  const Fl = 0.2 * k4 * (5.0 * La) + 0.1 * (1.0 - k4) * (5.0 * La) * Math.pow(5.0 * La, 1.0 / 3.0);

  const n = Yb / Yw;
  const zParam = 1.48 + Math.sqrt(n);

  const Nbb = 0.725 * Math.pow(1.0 / n, 0.2);

  // 2. Chromatic Adaptation (RGB_c)
  // Convert XYZ to RGB_16
  const rgb = M16.multiplyVector([x, y, z]);
  const rgbW = M16.multiplyVector([95.047, 100.0, 108.883]);

  const D = F * (1.0 - (1.0 / 3.6) * Math.exp((-La - 42.0) / 92.0));
  // Clamp D to 0-1
  const D_clamped = Math.max(0, Math.min(1, D));

  const Rc = rgb[0] * (D_clamped * (100.0 / rgbW[0]) + 1.0 - D_clamped);
  const Gc = rgb[1] * (D_clamped * (100.0 / rgbW[1]) + 1.0 - D_clamped);
  const Bc = rgb[2] * (D_clamped * (100.0 / rgbW[2]) + 1.0 - D_clamped);

  const RcW = rgbW[0] * (D_clamped * (100.0 / rgbW[0]) + 1.0 - D_clamped);
  const GcW = rgbW[1] * (D_clamped * (100.0 / rgbW[1]) + 1.0 - D_clamped);
  const BcW = rgbW[2] * (D_clamped * (100.0 / rgbW[2]) + 1.0 - D_clamped);

  // 3. Nonlinear Compression (RGB_a)
  const Ra = nonlinearAdaptation(Rc, Fl);
  const Ga = nonlinearAdaptation(Gc, Fl);
  const Ba = nonlinearAdaptation(Bc, Fl);

  const RaW = nonlinearAdaptation(RcW, Fl);
  const GaW = nonlinearAdaptation(GcW, Fl);
  const BaW = nonlinearAdaptation(BcW, Fl);

  // 4. Perceptual Correlates

  // Redness-Greenness (a), Yellowness-Blueness (b)
  const a = Ra - (12.0 * Ga) / 11.0 + Ba / 11.0;
  const b = (1.0 / 9.0) * (Ra + Ga - 2.0 * Ba);

  // Hue (h)
  const radToDeg = 180.0 / Math.PI;
  let h = Math.atan2(b, a) * radToDeg;
  if (h < 0) h += 360;

  // Achromatic Response (A)
  const A = (2.0 * Ra + Ga + 0.05 * Ba - 0.305) * Nbb;
  const Aw = (2.0 * RaW + GaW + 0.05 * BaW - 0.305) * Nbb;

  // Lightness (J)
  const J = 100.0 * Math.pow(A / Aw, c * zParam);

  // Brightness (Q)
  const Q = (4.0 / c) * Math.sqrt(J / 100.0) * (Aw + 4.0) * Math.pow(Fl, 0.25);

  // Chroma (C)
  const et = (1.0 / 4.0) * (Math.cos((h * Math.PI) / 180.0 + 2.0) + 3.8);
  const t =
    ((50000.0 / 13.0) * Nc * Nbb * et * Math.sqrt(a * a + b * b)) / (Ra + Ga + (21.0 * Ba) / 20.0);
  const C = Math.pow(t, 0.9) * Math.sqrt(J / 100.0) * Math.pow(1.64 - Math.pow(0.29, n), 0.73);

  // Colorfulness (M)
  const M = C * Math.pow(Fl, 0.25);

  // Saturation (s)
  const s = 100.0 * Math.sqrt(M / Q);

  return { J, C, h, M, s, Q };
}

/**
 * Converts CAM16 (J, C, h) to XYZ (D65).
 * Assumes average viewing conditions.
 */
export function cam16ToXyz(J: number, C: number, h: number): { x: number; y: number; z: number } {
  // 1. Calculate Viewing Parameters (same as forward)
  const Yw = 100.0;
  const La = 40.0;
  const Yb = 20.0;
  const { F, c, Nc } = SURROUND_PARAMS.average;
  const k = 1.0 / (5.0 * La + 1.0);
  const k4 = k * k * k * k;
  const Fl = 0.2 * k4 * (5.0 * La) + 0.1 * (1.0 - k4) * (5.0 * La) * Math.pow(5.0 * La, 1.0 / 3.0);
  const n = Yb / Yw;
  const zParam = 1.48 + Math.sqrt(n);
  const Nbb = 0.725 * Math.pow(1.0 / n, 0.2);
  const Ncb = Nbb;

  // Calculate Aw
  const rgbW = M16.multiplyVector([95.047, 100.0, 108.883]);
  const D = F * (1.0 - (1.0 / 3.6) * Math.exp((-La - 42.0) / 92.0));
  const D_clamped = Math.max(0, Math.min(1, D));
  const RcW = rgbW[0] * (D_clamped * (100.0 / rgbW[0]) + 1.0 - D_clamped);
  const GcW = rgbW[1] * (D_clamped * (100.0 / rgbW[1]) + 1.0 - D_clamped);
  const BcW = rgbW[2] * (D_clamped * (100.0 / rgbW[2]) + 1.0 - D_clamped);
  const RaW = nonlinearAdaptation(RcW, Fl);
  const GaW = nonlinearAdaptation(GcW, Fl);
  const BaW = nonlinearAdaptation(BcW, Fl);
  const Aw = (2.0 * RaW + GaW + 0.05 * BaW - 0.305) * Nbb;

  // 2. Reverse Calculations
  const A = Aw * Math.pow(J / 100.0, 1.0 / (c * zParam));

  const t = Math.pow(
    C / (Math.sqrt(J / 100.0) * Math.pow(1.64 - Math.pow(0.29, n), 0.73)),
    1.0 / 0.9
  );
  const et = (1.0 / 4.0) * (Math.cos((h * Math.PI) / 180.0 + 2.0) + 3.8);

  // Solve for Ra, Ga, Ba
  // t = (50000/13) * Nc * Ncb * et * sqrt(a^2 + b^2) / (Ra + Ga + 1.05Ba)
  // Let P1 = (50000/13) * Nc * Ncb * et
  // Let P2 = A / Nbb + 0.305 = 2Ra + Ga + 0.05Ba
  // We know h, so we know ratio of b/a = tan(h)
  // a = Ra - 12Ga/11 + Ba/11
  // b = (Ra + Ga - 2Ba)/9

  // From Google HCT implementation logic:
  const rad = (h * Math.PI) / 180.0;
  const p1 = (50000.0 / 13.0) * Nc * Ncb * et;
  const p2 = A / Nbb + 0.305;

  // Use HCT inverse logic simplified
  // a and b from t and alpha
  // t = p1 * sqrt(a*a + b*b) / (Ra + Ga + 1.05*Ba)
  // (Ra + Ga + 1.05*Ba) is roughly p2 (actually p2 is 2Ra+Ga+0.05Ba)

  // Let's use the algebraic inversion derived from CAM16 spec
  // gamma = 23 * (A/Nbb + 0.305) / 23
  // Wait, A/Nbb + 0.305 is just the sum part?

  // Let's use the explicit formulas:
  // ca = cos(h), sa = sin(h)
  // p2 = A / Nbb + 0.305
  // k_part = p1 / t

  // This part is numerically unstable if not careful.
  // Using the simplified inversion from standard libraries:

  const ca = Math.cos(rad);
  const sa = Math.sin(rad);

  // Calculate a and b relative to Ra, Ga, Ba sum?
  // Easier way:
  // We have J, C, h.
  // We calculated t and A.
  // We need to find Ra, Ga, Ba.

  // From standard CAM16 inverse step:
  // Calculate magnitude of chromatic response
  // if t=0 => a=0, b=0

  let a = 0,
    b = 0;
  if (t !== 0) {
    // This dependency on (Ra+Ga+1.05Ba) makes it cyclic.
    // However, we can substitute.
    // 11a + 11b = 12Ra - Ga - 2Ba ...
    // Let's rely on the pre-solved coefficients for HCT/CAM16

    // Approximation for (Ra + Ga + 1.05Ba):
    // It is close to A/Nbb.
    // Exact formula:
    // (Ra + Ga + 1.05Ba) * t = p1 * sqrt(a^2+b^2)
    // a = gamma * cos(h), b = gamma * sin(h) ... no.

    // Let's use the reference implementation approach:
    // Solve for Ra, Ga, Ba from A, a, b
    // We need a and b first.

    // t = p1 * sqrt(a^2 + b^2) / (Ra + Ga + 1.05Ba)
    // alpha = A/Nbb + 0.305 = 2Ra + Ga + 0.05Ba

    // This is a system of linear equations if we fix the ratio (Ra+Ga+1.05Ba)/alpha.
    // But we don't know it.

    // Alternate path:
    // M = C * Fl^0.25
    // alpha = M * sqrt(J/100) ... no.

    // Correct inverse algorithm:
    // 1. Calculate t, A, p1, p2(alpha)
    // 2. if t=0, a=0, b=0.
    // 3. else:
    //    calc_a_b(t, A, h)
    //    Using d = t * p2 / p1  <-- this assumes (Ra+Ga+1.05Ba) approx p2?
    //    Actually, (Ra+Ga+1.05Ba) is NOT p2.
    //    (Ra+Ga+1.05Ba) = (2Ra+Ga+0.05Ba) - Ra + Ba ...

    // Google's HCT library solves this exact problem.
    // Let's implement their exact steps for `HctSolver.solveToInt`.
    // Actually simpler: HCT uses T (Tone) = J.
    // CAM16-UCS uses J', a', b'.

    // Let's stick to the JCh -> XYZ conversion.
    // The formula relating C and a,b depends on the achromatic signal.
    // We iterate? No, algebraic solution exists.

    // a = (t * (p2)) / (p1 + t * 0.305) ...?
    // Let's use the approx: (Ra + Ga + 1.05Ba) approx p2.
    // Then magnitude = t * p2 / p1.
    // a = mag * cos(h), b = mag * sin(h).

    // Better:
    // Using equations from "Color Appearance Models", 3rd Ed.
    // e = 1/4 * (cos(h+2) + 3.8)
    // A = ...
    // p1 = 50000/13 * Nc * Nbb * e
    // p2 = A / Nbb + 0.305
    // gamma = 23 * (p1 * t) / (23*p1 + 11*t*cos(h) + 108*t*sin(h))
    // This gamma allows us to find a and b?

    // Let's use the explicit expansion:
    // Ra = 460/1403 * p2 + 451/1403 * a + 288/1403 * b
    // Ga = 460/1403 * p2 - 891/1403 * a - 261/1403 * b
    // Ba = 460/1403 * p2 - 220/1403 * a - 6300/1403 * b

    // We need a and b.
    // t = p1 * sqrt(a^2+b^2) / (Ra + Ga + 1.05Ba)
    // Substitute Ra,Ga,Ba with equations of p2, a, b.
    // Denominator = (460*p2 + 451a + 288b) + (460p2 - 891a - 261b) + 1.05*(460p2 - 220a - 6300b)
    // Denominator / 1403 = p2 * (460+460+1.05*460) + a(...) + b(...)

    // This leads to:
    // sqrt(a^2+b^2) = (t / p1) * ( constant * p2 + constant * a + constant * b )
    // Since b = a * tan(h), we can solve for a.

    // Implementation from a reliable CAM16-UCS source (e.g. d3-cam16):

    // Let's use the approximation that (Ra+Ga+Ba) dominates.
    // Or just standard robust logic:

    const factor = t / p1;
    // if we assume a = mag*cos, b = mag*sin
    // mag = factor * (Ra + Ga + 1.05Ba)
    // Substitute back Ra,Ga,Ba in terms of p2, a, b:
    // Ra + Ga + 1.05Ba = (1357.3/1403)*p2 + (-671.3/1403)*a + (-6594.3/1403)*b
    // Let K = 1357.3/1403 * p2
    // Let C1 = -671.3/1403
    // Let C2 = -6594.3/1403
    // mag = factor * (K + C1*mag*cos + C2*mag*sin)
    // mag = factor*K + factor*mag*(C1*cos + C2*sin)
    // mag * (1 - factor*(C1*cos + C2*sin)) = factor*K
    // mag = factor*K / (1 - factor*(C1*cos + C2*sin))

    const K = (1357.3 / 1403.0) * p2;
    const C1 = -671.3 / 1403.0;
    const C2 = -6594.3 / 1403.0;

    const num = factor * K;
    const den = 1.0 - factor * (C1 * ca + C2 * sa);
    const mag = num / den;

    a = mag * ca;
    b = mag * sa;
  }

  // Calculate Ra, Ga, Ba
  const Ra = (460.0 * p2 + 451.0 * a + 288.0 * b) / 1403.0;
  const Ga = (460.0 * p2 - 891.0 * a - 261.0 * b) / 1403.0;
  const Ba = (460.0 * p2 - 220.0 * a - 6300.0 * b) / 1403.0;

  // Inverse nonlinear adaptation
  const Rc = inverseNonlinearAdaptation(Ra, Fl);
  const Gc = inverseNonlinearAdaptation(Ga, Fl);
  const Bc = inverseNonlinearAdaptation(Ba, Fl);

  // Reverse adaptation
  const R = Rc / (D_clamped * (100.0 / rgbW[0]) + 1.0 - D_clamped);
  const G = Gc / (D_clamped * (100.0 / rgbW[1]) + 1.0 - D_clamped);
  const B = Bc / (D_clamped * (100.0 / rgbW[2]) + 1.0 - D_clamped);

  // RGB_16 to XYZ
  const xyz = M16_INV.multiplyVector([R, G, B]);

  return { x: xyz[0], y: xyz[1], z: xyz[2] };
}
