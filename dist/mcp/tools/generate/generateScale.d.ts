import { z } from 'zod';
import { type ScaleStep } from '../../../services/PaletteService.js';
export declare const generateScaleSchema: z.ZodObject<{
    baseColor: z.ZodString;
    steps: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export type GenerateScaleInput = z.infer<typeof generateScaleSchema>;
export declare function generateScale(input: GenerateScaleInput): Promise<{
    baseColor: {
        input: string;
        hex: string;
    };
    scale: {
        step: ScaleStep;
        hex: string;
        lightness: number;
        chroma: number;
        hue: number;
    }[];
    usage: {
        tailwindConfig: {
            description: string;
            config: {
                [k: string]: string;
            };
        };
        cssVariables: {
            description: string;
            css: string;
        };
    };
    guidelines: {
        '50-100': string;
        '200-300': string;
        '400-500': string;
        '600-700': string;
        '800-950': string;
    };
}>;
//# sourceMappingURL=generateScale.d.ts.map