import { z } from 'zod';
export declare const mixColorsSchema: z.ZodObject<{
    color1: z.ZodString;
    color2: z.ZodString;
    ratio: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    steps: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type MixColorsInput = z.infer<typeof mixColorsSchema>;
export declare function mixColors(input: MixColorsInput): Promise<Record<string, unknown>>;
//# sourceMappingURL=mixColors.d.ts.map