import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { SrgbColorSpace } from './SrgbColorSpace.js';

const srgbSpace = new SrgbColorSpace();

/**
 * HSL color space implementation.
 * Hue, Saturation, Lightness - an artist-intuitive color model.
 * Note: HSL is device-dependent (based on sRGB).
 */
export class HslColorSpace implements IColorSpace {
  readonly type = 'hsl' as const;
  readonly componentCount = 3;
  readonly componentNames = ['Hue', 'Saturation', 'Lightness'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'hsl') {
      throw new Error(`Expected hsl color, got ${color.space}`);
    }
    const [h, s, l] = color.components as [number, number, number];

    // HSL to RGB algorithm
    const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r: number, g: number, b: number;

    if (h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    const srgbColor = Color.create('srgb', [r + m, g + m, b + m], color.alpha);
    return srgbSpace.toXyzD65(srgbColor);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }

    // First convert to sRGB
    const srgbColor = srgbSpace.fromXyzD65(color);
    const [r, g, b] = srgbColor.components as [number, number, number];

    // RGB to HSL algorithm
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;

    let h = 0;
    let s = 0;

    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          break;
        case g:
          h = ((b - r) / d + 2) * 60;
          break;
        case b:
          h = ((r - g) / d + 4) * 60;
          break;
      }
    }

    return Color.create('hsl', [h, s, l], color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    const [h, s, l] = components as [number, number, number];
    return h >= 0 && h <= 360 && s >= 0 && s <= 1 && l >= 0 && l <= 1;
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    const [h, s, l] = components as [number, number, number];
    return [
      ((h % 360) + 360) % 360,
      Math.max(0, Math.min(1, s)),
      Math.max(0, Math.min(1, l)),
    ];
  }
}
