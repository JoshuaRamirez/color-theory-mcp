import { z } from 'zod';
export declare const calculateDeltaESchema: z.ZodObject<{
    color1: z.ZodString;
    color2: z.ZodString;
    method: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        CIE76: "CIE76";
        CIE94: "CIE94";
        CIEDE2000: "CIEDE2000";
    }>>>;
    kL: z.ZodOptional<z.ZodNumber>;
    kC: z.ZodOptional<z.ZodNumber>;
    kH: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CalculateDeltaEInput = z.infer<typeof calculateDeltaESchema>;
export declare function calculateDeltaE(input: CalculateDeltaEInput): Promise<{
    color1: {
        input: string;
        hex: string;
        lab: {
            L: number;
            a: number;
            b: number;
        };
    };
    color2: {
        input: string;
        hex: string;
        lab: {
            L: number;
            a: number;
            b: number;
        };
    };
    deltaE: {
        value: number;
        method: "CIE76" | "CIE94" | "CIEDE2000";
        methodDescription: string;
    };
    interpretation: {
        description: string;
        perceptible: boolean;
        acceptable: boolean;
    };
    thresholds: {
        imperceptible: string;
        closeObservation: string;
        perceptibleAtGlance: string;
        moreSimilarThanDifferent: string;
        noticeablyDifferent: string;
    };
}>;
//# sourceMappingURL=calculateDeltaE.d.ts.map