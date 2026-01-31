import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { SRGB_TO_XYZ_D65, XYZ_D65_TO_SRGB } from './constants.js';

/**
 * Linear sRGB color space implementation.
 * sRGB without gamma encoding - used for color math operations.
 */
export class LinearSrgbColorSpace implements IColorSpace {
  readonly type = 'linear-srgb' as const;
  readonly componentCount = 3;
  readonly componentNames = ['Red', 'Green', 'Blue'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'linear-srgb') {
      throw new Error(`Expected linear-srgb color, got ${color.space}`);
    }
    const rgb = color.components as [number, number, number];

    // Direct matrix transform (already linear)
    const xyz = SRGB_TO_XYZ_D65.multiplyVector(rgb);

    return Color.create('xyz-d65', xyz, color.alpha);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    const xyz = color.components as [number, number, number];

    // Direct matrix transform
    const rgb = XYZ_D65_TO_SRGB.multiplyVector(xyz);

    return Color.create('linear-srgb', rgb, color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    return components.every(c => c >= 0 && c <= 1);
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    return components.map(c => Math.max(0, Math.min(1, c)));
  }
}
