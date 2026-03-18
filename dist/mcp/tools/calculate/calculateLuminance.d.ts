import { z } from 'zod';
export declare const calculateLuminanceSchema: z.ZodObject<{
    color: z.ZodString;
}, z.core.$strip>;
export type CalculateLuminanceInput = z.infer<typeof calculateLuminanceSchema>;
export declare function calculateLuminance(input: CalculateLuminanceInput): Promise<{
    input: string;
    hex: string;
    rgb: {
        r: number;
        g: number;
        b: number;
    };
    luminance: {
        value: number;
        percentage: number;
    };
    perception: {
        category: string;
        isLight: boolean;
        isDark: boolean;
    };
    recommendation: {
        suggestedTextColor: string;
        note: string;
    };
    formula: string;
}>;
//# sourceMappingURL=calculateLuminance.d.ts.map