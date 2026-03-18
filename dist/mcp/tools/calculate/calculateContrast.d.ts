import { z } from 'zod';
export declare const calculateContrastSchema: z.ZodObject<{
    foreground: z.ZodString;
    background: z.ZodString;
}, z.core.$strip>;
export type CalculateContrastInput = z.infer<typeof calculateContrastSchema>;
export declare function calculateContrast(input: CalculateContrastInput): Promise<{
    foreground: {
        input: string;
        hex: string;
        luminance: number;
    };
    background: {
        input: string;
        hex: string;
        luminance: number;
    };
    contrast: {
        ratio: number;
        ratioString: string;
    };
    wcag: {
        AA: {
            normalText: boolean;
            largeText: boolean;
            required: {
                normalText: number;
                largeText: number;
            };
        };
        AAA: {
            normalText: boolean;
            largeText: boolean;
            required: {
                normalText: number;
                largeText: number;
            };
        };
    };
    recommendation: string;
}>;
//# sourceMappingURL=calculateContrast.d.ts.map