import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { OklabColorSpace } from './OklabColorSpace.js';

const oklabSpace = new OklabColorSpace();

/**
 * Oklch color space implementation.
 * Cylindrical representation of Oklab (Lightness, Chroma, Hue).
 * The recommended color space for CSS Color Level 4 perceptual color manipulation.
 *
 * Reference: https://www.w3.org/TR/css-color-4/#ok-lab
 */
export class OklchColorSpace implements IColorSpace {
  readonly type = 'oklch' as const;
  readonly componentCount = 3;
  readonly componentNames = ['Lightness', 'Chroma', 'Hue'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'oklch') {
      throw new Error(`Expected oklch color, got ${color.space}`);
    }
    const [L, C, H] = color.components as [number, number, number];

    // Oklch to Oklab
    const hRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);

    const oklabColor = Color.create('oklab', [L, a, b], color.alpha);
    return oklabSpace.toXyzD65(oklabColor);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }

    // First convert to Oklab
    const oklabColor = oklabSpace.fromXyzD65(color);
    const [L, a, b] = oklabColor.components as [number, number, number];

    // Oklab to Oklch
    const C = Math.sqrt(a * a + b * b);
    let H = (Math.atan2(b, a) * 180) / Math.PI;
    if (H < 0) {
      H += 360;
    }

    // Handle achromatic colors
    if (C < 0.00001) {
      return Color.create('oklch', [L, 0, 0], color.alpha);
    }

    return Color.create('oklch', [L, C, H], color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    const [L, C, H] = components as [number, number, number];
    return L >= 0 && L <= 1 && C >= 0 && C <= 0.4 && H >= 0 && H <= 360;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    const [L, C, H] = components as [number, number, number];
    return [
      Math.max(0, Math.min(1, L)),
      Math.max(0, Math.min(0.4, C)),
      ((H % 360) + 360) % 360,
    ];
  }
}
