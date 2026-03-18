import { z } from 'zod';
export declare const generateAccessibleReportSchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodString>;
    backgroundColor: z.ZodString;
    includeAPCA: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeCVD: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GenerateAccessibleReportInput = z.infer<typeof generateAccessibleReportSchema>;
/**
 * Generates a comprehensive accessibility audit for a palette of colors
 * against a background. Evaluates WCAG contrast, optionally APCA contrast,
 * optionally CVD simulation, and checks pairwise distinguishability via Delta-E.
 */
export declare function generateAccessibleReport(input: GenerateAccessibleReportInput): Promise<{
    background: {
        hex: string;
    };
    summary: Record<string, unknown>;
    colors: Record<string, unknown>[];
    pairwiseDistinguishability: {
        color1: string;
        color2: string;
        deltaE: number;
        distinguishable: boolean;
    }[] | undefined;
}>;
//# sourceMappingURL=generateAccessibleReport.d.ts.map