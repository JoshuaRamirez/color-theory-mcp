import type { IDeltaEStrategy, DeltaEInterpretation, DeltaEOptions } from '../../domain/interfaces/IDeltaEStrategy.js';
import type { Color } from '../../domain/values/Color.js';
/**
 * CIE76 Delta-E calculation (simple Euclidean distance in Lab).
 *
 * Formula: ΔE*ab = √((ΔL*)² + (Δa*)² + (Δb*)²)
 *
 * The simplest Delta-E formula. Fast but less accurate than modern methods.
 */
export declare class CIE76Strategy implements IDeltaEStrategy {
    readonly method: "CIE76";
    readonly description = "CIE 1976 Lab color difference (Euclidean distance)";
    calculate(color1: Color, color2: Color, _options?: DeltaEOptions): number;
    interpret(deltaE: number): DeltaEInterpretation;
}
//# sourceMappingURL=CIE76Strategy.d.ts.map