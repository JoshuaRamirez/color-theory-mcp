import { z } from 'zod';
import type { HarmonyType } from '../../../domain/interfaces/IHarmonyAlgorithm.js';
export declare const validatePaletteHarmonySchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ValidatePaletteHarmonyInput = z.infer<typeof validatePaletteHarmonySchema>;
export declare function validatePaletteHarmony(input: ValidatePaletteHarmonyInput): Promise<{
    colorCount: number;
    colors: {
        index: number;
        input: string | undefined;
        hex: string;
        hue: number;
        lightness: number;
        chroma: number;
    }[];
    harmony: {
        detected: "unknown" | HarmonyType;
        confidence: number;
        description: string;
    };
    hueAnalysis: {
        hues: number[];
        angles: number[];
        spread: number;
    };
    differences: {
        pairwise: {
            pair: [number, number];
            deltaE: number;
        }[];
        avgDeltaE: number;
        minDeltaE: number;
        maxDeltaE: number;
    };
    score: {
        value: number;
        rating: string;
    };
    issues: string[] | undefined;
}>;
//# sourceMappingURL=validatePaletteHarmony.d.ts.map