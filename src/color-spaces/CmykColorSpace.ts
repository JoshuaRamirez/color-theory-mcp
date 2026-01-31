import type { IColorSpace } from '../domain/interfaces/IColorSpace.js';
import { Color } from '../domain/values/Color.js';
import { SrgbColorSpace } from './SrgbColorSpace.js';

const srgbSpace = new SrgbColorSpace();

/**
 * CMYK color space implementation.
 * Cyan, Magenta, Yellow, Key (Black) - subtractive color model for print.
 *
 * Note: This is a simplified device-independent CMYK approximation.
 * Real CMYK conversions require ICC profiles for accuracy.
 */
export class CmykColorSpace implements IColorSpace {
  readonly type = 'cmyk' as const;
  readonly componentCount = 4;
  readonly componentNames = ['Cyan', 'Magenta', 'Yellow', 'Key (Black)'] as const;

  toXyzD65(color: Color): Color {
    if (color.space !== 'cmyk') {
      throw new Error(`Expected cmyk color, got ${color.space}`);
    }
    const [c, m, y, k] = color.components as [number, number, number, number];

    // CMYK to RGB (simplified conversion)
    const r = (1 - c) * (1 - k);
    const g = (1 - m) * (1 - k);
    const b = (1 - y) * (1 - k);

    const srgbColor = Color.create('srgb', [r, g, b], color.alpha);
    return srgbSpace.toXyzD65(srgbColor);
  }

  fromXyzD65(color: Color): Color {
    if (color.space !== 'xyz-d65') {
      throw new Error(`Expected xyz-d65 color, got ${color.space}`);
    }

    // First convert to sRGB
    const srgbColor = srgbSpace.fromXyzD65(color);
    const [r, g, b] = srgbColor.components as [number, number, number];

    // Clamp RGB values
    const rc = Math.max(0, Math.min(1, r));
    const gc = Math.max(0, Math.min(1, g));
    const bc = Math.max(0, Math.min(1, b));

    // RGB to CMYK (simplified conversion)
    const k = 1 - Math.max(rc, gc, bc);

    // Handle pure black
    if (k === 1) {
      return Color.create('cmyk', [0, 0, 0, 1], color.alpha);
    }

    const c = (1 - rc - k) / (1 - k);
    const m = (1 - gc - k) / (1 - k);
    const y = (1 - bc - k) / (1 - k);

    return Color.create('cmyk', [c, m, y, k], color.alpha);
  }

  isInGamut(components: readonly number[]): boolean {
    return components.every(c => c >= 0 && c <= 1);
  }

  clampToGamut(components: readonly number[]): readonly number[] {
    return components.map(c => Math.max(0, Math.min(1, c)));
  }
}
