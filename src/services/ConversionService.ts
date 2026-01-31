import type { IColorSpaceRegistry } from '../domain/interfaces/IColorSpace.js';
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
      throw new Error(`Unknown source color space: ${color.space}`);
    }
    if (!targetColorSpace) {
      throw new Error(`Unknown target color space: ${targetSpace}`);
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
    return colors.map(color => this.convert(color, targetSpace));
  }

  /**
   * Checks if a color is within the gamut of a target color space.
   */
  isInGamut(color: Color, targetSpace: ColorSpaceType): boolean {
    const colorSpace = this.registry.get(targetSpace);
    if (!colorSpace) {
      throw new Error(`Unknown color space: ${targetSpace}`);
    }

    // Convert to target space first
    const converted = this.convert(color, targetSpace);
    return colorSpace.isInGamut(converted.components);
  }

  /**
   * Clamps a color to the gamut of its color space.
   */
  clampToGamut(color: Color): Color {
    const colorSpace = this.registry.get(color.space);
    if (!colorSpace) {
      throw new Error(`Unknown color space: ${color.space}`);
    }

    const clamped = colorSpace.clampToGamut(color.components);
    return color.withComponents(clamped);
  }

  /**
   * Lists all available color spaces.
   */
  listColorSpaces(): readonly ColorSpaceType[] {
    return this.registry.list();
  }
}
