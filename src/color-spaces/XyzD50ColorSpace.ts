import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { XYZ_D65_TO_D50, XYZ_D50_TO_D65 } from './constants.js';

/**
 * CIE XYZ color space with D50 illuminant.
 * D50 is the standard illuminant for print/prepress workflows.
 */
export class XyzD50ColorSpace implements IColorSpace {
  readonly type = 'xyz-d50' as const;
  readonly componentCount = 3;
  readonly componentNames = ['X', 'Y', 'Z'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d50') {
      throw new Error(`Expected xyz-d50 color, got ${color.space}`);
    }
    const xyz50 = color.components as [number, number, number];

    // Chromatic adaptation from D50 to D65 (Bradford)
    const xyz65 = XYZ_D50_TO_D65.multiplyVector(xyz50);

    return Color.create('xyz-d65', xyz65, color.alpha);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    const xyz65 = color.components as [number, number, number];

    // Chromatic adaptation from D65 to D50 (Bradford)
    const xyz50 = XYZ_D65_TO_D50.multiplyVector(xyz65);

    return Color.create('xyz-d50', xyz50, color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    const [x, y, z] = components as [number, number, number];
    return x >= 0 && y >= 0 && z >= 0;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    return components.map(c => Math.max(0, c));
  }
}
