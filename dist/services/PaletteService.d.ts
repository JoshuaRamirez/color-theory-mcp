import type { HarmonyType, HarmonyOptions } from '../domain/interfaces/IHarmonyAlgorithm.js';
import { Color } from '../domain/values/Color.js';
import type { Palette } from '../domain/values/Palette.js';
import { HarmonyRegistry } from '../strategies/harmony/HarmonyRegistry.js';
/**
 * Tailwind-style scale steps.
 */
export type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
/**
 * Result of scale generation.
 */
export interface ColorScale {
    readonly baseColor: Color;
    readonly steps: Map<ScaleStep, Color>;
}
/**
 * Service for generating color palettes and scales.
 */
export declare class PaletteService {
    private readonly harmonyRegistry;
    constructor(harmonyRegistry?: HarmonyRegistry);
    /**
     * Generates a harmony palette from a base color.
     */
    generateHarmony(baseColor: Color, harmonyType: HarmonyType, options?: HarmonyOptions): Palette;
    /**
     * Generates a Tailwind-style color scale (50-950).
     * Uses Oklch for perceptually uniform lightness distribution.
     */
    generateScale(baseColor: Color, options?: {
        steps?: ScaleStep[];
    }): ColorScale;
    /**
     * Mixes two colors together.
     * Uses Oklch for perceptually uniform blending.
     */
    mixColors(color1: Color, color2: Color, ratio?: number): Color;
    /**
     * Adjusts a color's properties.
     */
    adjustColor(color: Color, adjustments: {
        lighten?: number;
        darken?: number;
        saturate?: number;
        desaturate?: number;
        rotate?: number;
    }): Color;
    /**
     * Generates a gradient between colors.
     */
    generateGradient(startColor: Color, endColor: Color, steps: number): Color[];
}
//# sourceMappingURL=PaletteService.d.ts.map