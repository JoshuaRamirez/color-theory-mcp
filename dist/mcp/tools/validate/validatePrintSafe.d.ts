import { z } from 'zod';
export declare const validatePrintSafeSchema: z.ZodObject<{
    color: z.ZodString;
}, z.core.$strip>;
export type ValidatePrintSafeInput = z.infer<typeof validatePrintSafeSchema>;
export declare function validatePrintSafe(input: ValidatePrintSafeInput): Promise<{
    input: string;
    hex: string;
    printSafe: boolean;
    cmyk: {
        c: number;
        m: number;
        y: number;
        k: number;
        string: string;
    };
    analysis: {
        totalInkCoverage: string;
        recommendedMax: string;
        issues: string[] | undefined;
        warnings: string[] | undefined;
    };
    recommendations: string[];
    note: string;
}>;
//# sourceMappingURL=validatePrintSafe.d.ts.map