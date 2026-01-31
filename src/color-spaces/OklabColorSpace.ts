import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { OKLAB_M1, OKLAB_M2, OKLAB_M1_INV, OKLAB_M2_INV } from './constants.js';

/**
 * Oklab color space implementation.
 * A perceptually uniform color space designed by Björn Ottosson.
 * Superior to Lab for hue linearity and lightness uniformity.
 *
 * Reference: https://bottosson.github.io/posts/oklab/
 */
export class OklabColorSpace implements IColorSpace {
  readonly type = 'oklab' as const;
  readonly componentCount = 3;
  readonly componentNames = ['Lightness', 'a', 'b'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'oklab') {
      throw new Error(`Expected oklab color, got ${color.space}`);
    }
    const [L, a, b] = color.components as [number, number, number];

    // Oklab to LMS (cone response)
    const lms = OKLAB_M2_INV.multiplyVector([L, a, b]);

    // Cube the LMS values
    const lmsCubed: [number, number, number] = [
      lms[0] * lms[0] * lms[0],
      lms[1] * lms[1] * lms[1],
      lms[2] * lms[2] * lms[2],
    ];

    // LMS to XYZ-D65
    const xyz = OKLAB_M1_INV.multiplyVector(lmsCubed);

    return Color.create('xyz-d65', xyz, color.alpha);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    const xyz = color.components as [number, number, number];

    // XYZ-D65 to LMS (cone response)
    const lmsCubed = OKLAB_M1.multiplyVector(xyz);

    // Cube root of LMS values
    const lms: [number, number, number] = [
      Math.cbrt(lmsCubed[0]),
      Math.cbrt(lmsCubed[1]),
      Math.cbrt(lmsCubed[2]),
    ];

    // LMS to Oklab
    const lab = OKLAB_M2.multiplyVector(lms);

    return Color.create('oklab', lab, color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    const [L, a, b] = components as [number, number, number];
    return L >= 0 && L <= 1 && Math.abs(a) <= 0.4 && Math.abs(b) <= 0.4;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    const [L, a, b] = components as [number, number, number];
    return [
      Math.max(0, Math.min(1, L)),
      Math.max(-0.4, Math.min(0.4, a)),
      Math.max(-0.4, Math.min(0.4, b)),
    ];
  }
}
