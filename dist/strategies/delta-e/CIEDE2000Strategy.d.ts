import type { IDeltaEStrategy, DeltaEInterpretation, DeltaEOptions } from '../../domain/interfaces/IDeltaEStrategy.js';
import type { Color } from '../../domain/values/Color.js';
/**
 * CIEDE2000 Delta-E calculation - the current standard.
 *
 * Based on: Sharma, Wu, Dalal (2005) "The CIEDE2000 Color-Difference Formula:
 * Implementation Notes, Supplementary Test Data, and Mathematical Observations"
 *
 * Improvements over CIE94:
 * - Rotation term for blues
 * - Better hue weighting
 * - Improved chroma weighting
 */
export declare class CIEDE2000Strategy implements IDeltaEStrategy {
    readonly method: "CIEDE2000";
    readonly description = "CIEDE2000 color difference (current CIE standard)";
    calculate(color1: Color, color2: Color, options?: DeltaEOptions): number;
    /**
     * Calculate h' (hue angle in degrees).
     */
    private hPrime;
    interpret(deltaE: number): DeltaEInterpretation;
}
//# sourceMappingURL=CIEDE2000Strategy.d.ts.map