import type { ICVDSimulator, CVDInfo, CVDType, CVDSimulationOptions } from '../../domain/interfaces/ICVDSimulator.js';
import type { Matrix3x3 } from '../../domain/values/Matrix3x3.js';
import { Color } from '../../domain/values/Color.js';
/**
 * Base CVD simulator using Machado matrices.
 */
declare abstract class MachadoCVDSimulator implements ICVDSimulator {
    abstract readonly type: CVDType;
    abstract readonly info: CVDInfo;
    protected abstract readonly matrices: Record<number, Matrix3x3>;
    simulate(color: Color, options?: CVDSimulationOptions): Color;
    simulateBatch(colors: readonly Color[], options?: CVDSimulationOptions): Color[];
}
/**
 * Protanopia simulator (L-cone/red deficiency).
 */
export declare class ProtanopiaSimulator extends MachadoCVDSimulator {
    readonly type: "protanopia";
    readonly info: CVDInfo;
    protected readonly matrices: Record<number, Matrix3x3>;
}
/**
 * Protanomaly simulator (L-cone/red deficiency - partial).
 */
export declare class ProtanomalySimulator extends MachadoCVDSimulator {
    readonly type: "protanomaly";
    readonly info: CVDInfo;
    protected readonly matrices: Record<number, Matrix3x3>;
    simulate(color: Color, options?: CVDSimulationOptions): Color;
}
/**
 * Deuteranopia simulator (M-cone/green deficiency).
 */
export declare class DeuteranopiaSimulator extends MachadoCVDSimulator {
    readonly type: "deuteranopia";
    readonly info: CVDInfo;
    protected readonly matrices: Record<number, Matrix3x3>;
}
/**
 * Deuteranomaly simulator (M-cone/green deficiency - partial).
 */
export declare class DeuteranomalySimulator extends MachadoCVDSimulator {
    readonly type: "deuteranomaly";
    readonly info: CVDInfo;
    protected readonly matrices: Record<number, Matrix3x3>;
    simulate(color: Color, options?: CVDSimulationOptions): Color;
}
/**
 * Tritanopia simulator (S-cone/blue deficiency).
 */
export declare class TritanopiaSimulator extends MachadoCVDSimulator {
    readonly type: "tritanopia";
    readonly info: CVDInfo;
    protected readonly matrices: Record<number, Matrix3x3>;
}
/**
 * Tritanomaly simulator (S-cone/blue deficiency - partial).
 */
export declare class TritanomalySimulator extends MachadoCVDSimulator {
    readonly type: "tritanomaly";
    readonly info: CVDInfo;
    protected readonly matrices: Record<number, Matrix3x3>;
    simulate(color: Color, options?: CVDSimulationOptions): Color;
}
/**
 * Achromatopsia simulator (total color blindness).
 */
export declare class AchromatopsiaSimulator implements ICVDSimulator {
    readonly type: "achromatopsia";
    readonly info: CVDInfo;
    simulate(color: Color, _options?: CVDSimulationOptions): Color;
    simulateBatch(colors: readonly Color[], options?: CVDSimulationOptions): Color[];
}
/**
 * Achromatomaly simulator (partial total color blindness).
 */
export declare class AchromatomalySimulator implements ICVDSimulator {
    readonly type: "achromatomaly";
    readonly info: CVDInfo;
    simulate(color: Color, options?: CVDSimulationOptions): Color;
    simulateBatch(colors: readonly Color[], options?: CVDSimulationOptions): Color[];
}
export {};
//# sourceMappingURL=CVDSimulators.d.ts.map