import type { Color } from '../../domain/values/Color.js';
import type { CVDType } from '../../domain/interfaces/ICVDSimulator.js';
export interface DaltonizeResult {
    original: Color;
    corrected: Color;
    cvdType: CVDType;
    severity: number;
}
/**
 * Daltonizes a color to improve distinguishability for people with CVD.
 *
 * The classic daltonization algorithm:
 * 1. Simulate the CVD view of the original color
 * 2. Compute the error (difference between original and simulated in linear RGB)
 * 3. Redistribute the error to channels the person CAN see
 * 4. Add the redistributed error back to the original
 */
export declare function daltonize(color: Color, cvdType: CVDType, options?: {
    severity?: number;
    strength?: number;
}): DaltonizeResult;
/**
 * Daltonizes multiple colors to maximize mutual distinguishability.
 */
export declare function daltonizePalette(colors: Color[], cvdType: CVDType, options?: {
    severity?: number;
    strength?: number;
}): DaltonizeResult[];
//# sourceMappingURL=Daltonizer.d.ts.map