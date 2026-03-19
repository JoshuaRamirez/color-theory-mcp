import { z } from 'zod';
/**
 * Schema for generate-gradient tool input.
 * Accepts either startColor+endColor (backward-compatible 2-color mode)
 * or a colors array for multi-stop gradients.
 */
export declare const generateGradientSchema: z.ZodObject<{
    startColor: z.ZodOptional<z.ZodString>;
    endColor: z.ZodOptional<z.ZodString>;
    colors: z.ZodOptional<z.ZodArray<z.ZodString>>;
    steps: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    interpolationSpace: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        srgb: "srgb";
        lab: "lab";
        lch: "lch";
        oklab: "oklab";
        oklch: "oklch";
        hsl: "hsl";
    }>>>;
    includeCSS: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GenerateGradientInput = z.infer<typeof generateGradientSchema>;
export declare function generateGradient(input: GenerateGradientInput): Promise<{
    inputColors: {
        input: string;
        hex: string;
    }[];
    steps: number;
    interpolationSpace: "srgb" | "lab" | "lch" | "oklab" | "oklch" | "hsl";
    gradient: {
        stops: {
            index: number;
            position: string;
            hex: string;
        }[];
    };
    css: {
        linear: string;
        radial: string;
        conic: string;
    } | undefined;
    note: string;
}>;
//# sourceMappingURL=generateGradient.d.ts.map