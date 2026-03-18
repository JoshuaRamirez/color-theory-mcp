import { z } from 'zod';
export declare const adjustColorSchema: z.ZodObject<{
    color: z.ZodString;
    lighten: z.ZodOptional<z.ZodNumber>;
    darken: z.ZodOptional<z.ZodNumber>;
    saturate: z.ZodOptional<z.ZodNumber>;
    desaturate: z.ZodOptional<z.ZodNumber>;
    rotate: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type AdjustColorInput = z.infer<typeof adjustColorSchema>;
export declare function adjustColor(input: AdjustColorInput): Promise<{
    original: {
        input: string;
        hex: string;
        oklch: {
            L: number;
            C: number;
            H: number;
        };
    };
    adjusted: {
        hex: string;
        oklch: {
            L: number;
            C: number;
            H: number;
        };
    };
    changes: {
        lightness: number;
        chroma: number;
        hue: number;
    };
    appliedAdjustments: string[];
}>;
//# sourceMappingURL=adjustColor.d.ts.map