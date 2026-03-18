import { Matrix3x3 } from '../../domain/values/Matrix3x3.js';
/**
 * CVD simulation matrices based on Machado et al. 2009.
 * "A Physiologically-based Model for Simulation of Color Vision Deficiency"
 *
 * These matrices transform linear sRGB values to simulate color vision deficiencies.
 * Matrices provided for severity levels from 0.0 (normal vision) to 1.0 (complete deficiency).
 */
/**
 * Protanopia simulation matrices (L-cone/red deficiency).
 * Key severity: 1.0 = complete protanopia
 */
export declare const PROTANOPIA_MATRICES: Record<number, Matrix3x3>;
/**
 * Deuteranopia simulation matrices (M-cone/green deficiency).
 * Key severity: 1.0 = complete deuteranopia
 */
export declare const DEUTERANOPIA_MATRICES: Record<number, Matrix3x3>;
/**
 * Tritanopia simulation matrices (S-cone/blue deficiency).
 * Key severity: 1.0 = complete tritanopia
 */
export declare const TRITANOPIA_MATRICES: Record<number, Matrix3x3>;
/**
 * Gets the appropriate matrix for a given severity, interpolating if necessary.
 */
export declare function getMatrixForSeverity(matrices: Record<number, Matrix3x3>, severity: number): Matrix3x3;
//# sourceMappingURL=MachadoMatrices.d.ts.map