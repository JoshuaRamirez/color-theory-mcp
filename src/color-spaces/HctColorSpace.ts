import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { xyzToCam16, cam16ToXyz } from './cam16_math.js';

/**
 * HCT Color Space (Hue, Chroma, Tone).
 * The color system used by Material Design 3.
 * H: CAM16 Hue (0-360)
 * C: CAM16 Chroma (0-~150)
 * T: CAM16 Lightness (J) (0-100)
 */
export class HctColorSpace implements IColorSpace {
  readonly type = 'hct' as const;
  readonly componentCount = 3;
  readonly componentNames = ['H', 'C', 'T'] as const; // HCT standard order

  toXyzD65(color: Color): Color {
    if (color.space !== 'hct') {
      throw new Error(`Expected hct color, got ${color.space}`);
    }
    const [H, C, T] = color.components as [number, number, number];
    // Map T -> J
    const { x, y, z } = cam16ToXyz(T, C, H);
    return Color.create('xyz-d65', [x / 100, y / 100, z / 100], color.alpha);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }
    const [x, y, z] = color.components as [number, number, number];
    const { J, C, h } = xyzToCam16(x * 100, y * 100, z * 100);
    // Map J -> T, h -> H
    return Color.create('hct', [h, C, J], color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    const [H, C, T] = components as [number, number, number];
    return T >= 0 && T <= 100 && C >= 0 && H >= 0 && H <= 360;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    const [H, C, T] = components as [number, number, number];
    return [((H % 360) + 360) % 360, Math.max(0, C), Math.max(0, Math.min(100, T))];
  }
}
