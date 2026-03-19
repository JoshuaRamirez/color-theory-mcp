import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { xyzToCam16, cam16ToXyz } from './cam16_math.js';

/**
 * CAM16 Color Space (J, C, h).
 * Uses standard viewing conditions (D65, average surround).
 * J: Lightness (0-100)
 * C: Chroma (0-~150)
 * h: Hue (0-360)
 */
export class Cam16ColorSpace implements IColorSpace {
  readonly type = 'cam16' as const;
  readonly componentCount = 3;
  readonly componentNames = ['J', 'C', 'h'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'cam16') {
      throw new Error(`Expected cam16 color, got ${color.space}`);
    }
    const [J, C, h] = color.components as [number, number, number];
    const { x, y, z } = cam16ToXyz(J, C, h);
    return Color.create('xyz-d65', [x / 100, y / 100, z / 100], color.alpha);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    const [x, y, z] = color.components as [number, number, number];
    const { J, C, h } = xyzToCam16(x * 100, y * 100, z * 100);
    return Color.create('cam16', [J, C, h], color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    const [J, C, h] = components as [number, number, number];
    return J >= 0 && J <= 100 && C >= 0 && h >= 0 && h <= 360;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    const [J, C, h] = components as [number, number, number];
    return [Math.max(0, Math.min(100, J)), Math.max(0, C), ((h % 360) + 360) % 360];
  }
}
