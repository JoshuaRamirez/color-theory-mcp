import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';

/**
 * CIE XYZ color space with D65 illuminant.
 * This is the "connection space" - all conversions go through XYZ-D65.
 */
export class XyzD65ColorSpace implements IColorSpace {
  readonly type = 'xyz-d65' as const;
  readonly componentCount = 3;
  readonly componentNames = ['X', 'Y', 'Z'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    // Identity transformation - already in XYZ-D65
    return color;
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    // Identity transformation
    return color;
  }

  isInGamut(components: readonly number[]): boolean {
    // XYZ can represent any visible color; no strict gamut
    const [x, y, z] = components as [number, number, number];
    return x >= 0 && y >= 0 && z >= 0;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    return components.map(c => Math.max(0, c));
  }
}
