import type { IHarmonyAlgorithm, HarmonyType, HarmonyOptions } from '../../domain/interfaces/IHarmonyAlgorithm.js';
import { Color } from '../../domain/values/Color.js';
import { Palette } from '../../domain/values/Palette.js';
/**
 * Base class for harmony algorithms using hue rotation.
 * Uses Oklch for perceptually uniform color manipulation.
 */
export declare abstract class BaseHarmonyAlgorithm implements IHarmonyAlgorithm {
    abstract readonly type: HarmonyType;
    abstract readonly description: string;
    abstract readonly angles: readonly number[];
    generate(baseColor: Color, options?: HarmonyOptions): Palette;
}
//# sourceMappingURL=BaseHarmonyAlgorithm.d.ts.map