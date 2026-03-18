import type { HarmonyOptions } from '../../domain/interfaces/IHarmonyAlgorithm.js';
import { Color } from '../../domain/values/Color.js';
import { Palette } from '../../domain/values/Palette.js';
import { BaseHarmonyAlgorithm } from './BaseHarmonyAlgorithm.js';
/**
 * Complementary harmony - colors opposite on the color wheel.
 * Creates maximum contrast.
 */
export declare class ComplementaryHarmony extends BaseHarmonyAlgorithm {
    readonly type: "complementary";
    readonly description = "Two colors opposite on the color wheel (180\u00B0 apart)";
    readonly angles: readonly [0, 180];
}
/**
 * Analogous harmony - colors adjacent on the color wheel.
 * Creates visual comfort and unity.
 */
export declare class AnalogousHarmony extends BaseHarmonyAlgorithm {
    readonly type: "analogous";
    readonly description = "Three colors adjacent on the color wheel (\u00B130\u00B0)";
    readonly angles: readonly [-30, 0, 30];
    generate(baseColor: Color, options?: HarmonyOptions): Palette;
}
/**
 * Triadic harmony - three colors equally spaced on the color wheel.
 * Creates vibrant contrast while maintaining balance.
 */
export declare class TriadicHarmony extends BaseHarmonyAlgorithm {
    readonly type: "triadic";
    readonly description = "Three colors equally spaced on the color wheel (120\u00B0 apart)";
    readonly angles: readonly [0, 120, 240];
}
/**
 * Split-complementary harmony - base color plus two colors adjacent to its complement.
 * High contrast but less tension than complementary.
 */
export declare class SplitComplementaryHarmony extends BaseHarmonyAlgorithm {
    readonly type: "split-complementary";
    readonly description = "Base color plus two colors adjacent to its complement (150\u00B0 and 210\u00B0)";
    readonly angles: readonly [0, 150, 210];
}
/**
 * Tetradic (rectangular) harmony - four colors forming a rectangle on the color wheel.
 * Rich color scheme with multiple complementary pairs.
 */
export declare class TetradicHarmony extends BaseHarmonyAlgorithm {
    readonly type: "tetradic";
    readonly description = "Four colors forming a rectangle on the color wheel";
    readonly angles: readonly [0, 60, 180, 240];
}
/**
 * Square harmony - four colors equally spaced on the color wheel.
 * Balanced scheme with strong contrast.
 */
export declare class SquareHarmony extends BaseHarmonyAlgorithm {
    readonly type: "square";
    readonly description = "Four colors equally spaced on the color wheel (90\u00B0 apart)";
    readonly angles: readonly [0, 90, 180, 270];
}
/**
 * Monochromatic harmony - variations of a single hue.
 * Creates unity through lightness and saturation variations.
 */
export declare class MonochromaticHarmony extends BaseHarmonyAlgorithm {
    readonly type: "monochromatic";
    readonly description = "Variations of a single hue with different lightness and saturation";
    readonly angles: readonly [0];
    generate(baseColor: Color, options?: HarmonyOptions): Palette;
    private generateLightnessSteps;
}
//# sourceMappingURL=HarmonyAlgorithms.d.ts.map