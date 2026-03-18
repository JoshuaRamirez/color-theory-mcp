import type { IColorSpaceRegistry } from '../domain/interfaces/IColorSpace.js';
import { UnknownColorSpaceError } from '../domain/errors.js';
import { Color } from '../domain/values/Color.js';
import type { ColorSpaceType } from '../domain/values/ColorSpaceType.js';
import { ColorSpaceRegistry } from '../color-spaces/ColorSpaceRegistry.js';

/**
 * Service for converting colors between color spaces.
 * Uses XYZ-D65 as the connection space for all conversions.
 */
export class ConversionService {
  private readonly registry: IColorSpaceRegistry;

  constructor(registry?: IColorSpaceRegistry) {
    this.registry = registry ?? ColorSpaceRegistry.createDefault();
  }

  /**
   * Converts a color to a different color space.
   * Uses XYZ-D65 as an intermediate for all conversions.
   */
  convert(color: Color, targetSpace: ColorSpaceType): Color {
    // Short-circuit if already in target space
    if (color.space === targetSpace) {
      return color;
    }

    const sourceColorSpace = this.registry.get(color.space);
    const targetColorSpace = this.registry.get(targetSpace);

    if (!sourceColorSpace) {
      throw new UnknownColorSpaceError(color.space);
    }
    if (!targetColorSpace) {
      throw new UnknownColorSpaceError(targetSpace);
    }

    // Convert to XYZ-D65 (connection space)
    const xyzColor = sourceColorSpace.toXyzD65(color);

    // Convert from XYZ-D65 to target space
    return targetColorSpace.fromXyzD65(xyzColor);
  }

  /**
   * Converts multiple colors to a target space.
   */
  convertBatch(colors: readonly Color[], targetSpace: ColorSpaceType): Color[] {
    return colors.map((color) => this.convert(color, targetSpace));
  }

  /**
   * Checks if a color is within the gamut of a target color space.
   */
  isInGamut(color: Color, targetSpace: ColorSpaceType): boolean {
    const colorSpace = this.registry.get(targetSpace);
    if (!colorSpace) {
      throw new UnknownColorSpaceError(targetSpace);
    }

    // Convert to target space first
    const converted = this.convert(color, targetSpace);
    return colorSpace.isInGamut(converted.components);
  }

  /**
   * Clamps a color to the gamut of its color space.
   * Uses simple component clamping (fast but may desaturate).
   */
  clampToGamut(color: Color): Color {
    const colorSpace = this.registry.get(color.space);
    if (!colorSpace) {
      throw new UnknownColorSpaceError(color.space);
    }

    const clamped = colorSpace.clampToGamut(color.components);
    return color.withComponents(clamped);
  }

  /**
   * Maps a color into the gamut of a target space using perceptual
   * chroma reduction in Oklch. Based on CSS Color Level 4 §13.2.
   *
   * Instead of naively clamping RGB components (which shifts hue and
   * lightness), this holds Oklch hue and lightness constant while
   * binary-searching for the maximum chroma that still fits inside
   * the target gamut. The result is the closest perceptually uniform
   * in-gamut color.
   *
   * @param color - Any color in any supported space
   * @param targetSpace - The destination gamut (default: color's own space)
   * @param epsilon - Chroma convergence threshold (default 0.002)
   * @returns A color in targetSpace that is within gamut
   */
  mapToGamut(color: Color, targetSpace?: ColorSpaceType, epsilon: number = 0.002): Color {
    const destination = targetSpace ?? color.space;
    const destSpace = this.registry.get(destination);
    if (!destSpace) {
      throw new UnknownColorSpaceError(destination);
    }

    // Already in gamut? Return converted directly.
    const converted = this.convert(color, destination);
    if (destSpace.isInGamut(converted.components)) {
      return converted;
    }

    // Work in Oklch: hold L and H, binary-search chroma
    const oklch = this.convert(color, 'oklch');
    const [L, , H] = oklch.components as [number, number, number];

    // Achromatic edge case: chroma is zero, just clamp
    if (oklch.components[1]! <= 0) {
      return this.clampToGamut(this.convert(oklch, destination));
    }

    let low = 0;
    let high = oklch.components[1]!;

    while (high - low > epsilon) {
      const mid = (low + high) / 2;
      const candidate = Color.create('oklch', [L, mid, H], color.alpha);
      const inDest = this.convert(candidate, destination);

      if (destSpace.isInGamut(inDest.components)) {
        low = mid; // still fits, try more chroma
      } else {
        high = mid; // out of gamut, reduce chroma
      }
    }

    // Use the conservative (in-gamut) bound
    const mapped = Color.create('oklch', [L, low, H], color.alpha);
    return this.convert(mapped, destination);
  }

  /**
   * Lists all available color spaces.
   */
  listColorSpaces(): readonly ColorSpaceType[] {
    return this.registry.list();
  }
}
