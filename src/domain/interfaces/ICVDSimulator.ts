import type { Color } from '../values/Color.js';

/**
 * Types of color vision deficiency.
 */
export type CVDType =
  | 'protanopia'    // L-cone (red) missing - complete
  | 'protanomaly'   // L-cone (red) deficient - partial
  | 'deuteranopia'  // M-cone (green) missing - complete
  | 'deuteranomaly' // M-cone (green) deficient - partial
  | 'tritanopia'    // S-cone (blue) missing - complete
  | 'tritanomaly'   // S-cone (blue) deficient - partial
  | 'achromatopsia' // Total color blindness
  | 'achromatomaly'; // Partial total color blindness

/**
 * Information about a CVD type.
 */
export interface CVDInfo {
  readonly type: CVDType;
  readonly name: string;
  readonly description: string;
  readonly affectedCone: 'L' | 'M' | 'S' | 'all';
  readonly prevalence: {
    readonly male: number;
    readonly female: number;
  };
}

/**
 * Options for CVD simulation.
 */
export interface CVDSimulationOptions {
  /**
   * Severity of the deficiency (0-1).
   * 1.0 = complete deficiency (protanopia, deuteranopia, tritanopia)
   * 0.5 = moderate deficiency (typical anomalous trichromacy)
   */
  severity?: number;
}

/**
 * Interface for color vision deficiency simulators.
 */
export interface ICVDSimulator {
  /**
   * The CVD type this simulator handles.
   */
  readonly type: CVDType;

  /**
   * Information about this CVD type.
   */
  readonly info: CVDInfo;

  /**
   * Simulates how a color appears to someone with this CVD.
   */
  simulate(color: Color, options?: CVDSimulationOptions): Color;

  /**
   * Simulates an array of colors.
   */
  simulateBatch(colors: readonly Color[], options?: CVDSimulationOptions): Color[];
}

/**
 * Registry for CVD simulators.
 */
export interface ICVDSimulatorRegistry {
  /**
   * Registers a CVD simulator.
   */
  register(simulator: ICVDSimulator): void;

  /**
   * Gets a CVD simulator by type.
   */
  get(type: CVDType): ICVDSimulator | undefined;

  /**
   * Lists all registered CVD types.
   */
  list(): readonly CVDType[];

  /**
   * Gets information about all CVD types.
   */
  getAllInfo(): readonly CVDInfo[];
}
