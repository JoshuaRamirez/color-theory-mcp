import type { Color } from '../values/Color.js';
import type { Palette } from '../values/Palette.js';

/**
 * Types of color harmony relationships.
 */
export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'monochromatic';

/**
 * Options for harmony generation.
 */
export interface HarmonyOptions {
  /**
   * Number of colors to generate (for variable-count harmonies).
   */
  count?: number;

  /**
   * Angle spread for analogous harmonies.
   */
  angleSpread?: number;

  /**
   * Whether to include the base color in the result.
   */
  includeBase?: boolean;

  /**
   * Lightness variation for monochromatic harmonies.
   */
  lightnessSteps?: number[];

  /**
   * Saturation variation for monochromatic harmonies.
   */
  saturationSteps?: number[];
}

/**
 * Interface for harmony generation algorithms.
 */
export interface IHarmonyAlgorithm {
  /**
   * The harmony type this algorithm generates.
   */
  readonly type: HarmonyType;

  /**
   * Human-readable description of the harmony.
   */
  readonly description: string;

  /**
   * The angles from the base color used in this harmony.
   */
  readonly angles: readonly number[];

  /**
   * Generates a color palette based on a base color.
   */
  generate(baseColor: Color, options?: HarmonyOptions): Palette;
}

/**
 * Registry for harmony algorithms.
 */
export interface IHarmonyRegistry {
  /**
   * Registers a harmony algorithm.
   */
  register(algorithm: IHarmonyAlgorithm): void;

  /**
   * Gets a harmony algorithm by type.
   */
  get(type: HarmonyType): IHarmonyAlgorithm | undefined;

  /**
   * Lists all registered harmony types.
   */
  list(): readonly HarmonyType[];
}
