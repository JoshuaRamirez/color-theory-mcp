import { z } from 'zod';
export declare const generateGradientSchema: z.ZodObject<{
    startColor: z.ZodString;
    endColor: z.ZodString;
    steps: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    includeCSS: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GenerateGradientInput = z.infer<typeof generateGradientSchema>;
export declare function generateGradient(input: GenerateGradientInput): Promise<{
    startColor: {
        input: string;
        hex: string;
    };
    endColor: {
        input: string;
        hex: string;
    };
    steps: number;
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
    } | undefined;
    note: string;
}>;
//# sourceMappingURL=generateGradient.d.ts.map