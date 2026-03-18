import type { IDeltaEStrategy, DeltaEInterpretation, DeltaEOptions } from '../../domain/interfaces/IDeltaEStrategy.js';
import type { Color } from '../../domain/values/Color.js';
/**
 * CIE94 Delta-E calculation with weighted chroma and hue.
 *
 * Improves upon CIE76 by adding weighting factors that account for
 * human perception being more sensitive to lightness changes than
 * chroma or hue changes.
 */
export declare class CIE94Strategy implements IDeltaEStrategy {
    readonly method: "CIE94";
    readonly description = "CIE 1994 color difference with chroma/hue weighting";
    calculate(color1: Color, color2: Color, options?: DeltaEOptions): number;
    interpret(deltaE: number): DeltaEInterpretation;
}
//# sourceMappingURL=CIE94Strategy.d.ts.map