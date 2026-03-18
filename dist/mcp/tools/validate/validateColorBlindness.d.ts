import { z } from 'zod';
export declare const validateColorBlindnessSchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodString>;
    cvdType: z.ZodOptional<z.ZodEnum<{
        protanopia: "protanopia";
        protanomaly: "protanomaly";
        deuteranopia: "deuteranopia";
        deuteranomaly: "deuteranomaly";
        tritanopia: "tritanopia";
        tritanomaly: "tritanomaly";
        achromatopsia: "achromatopsia";
        achromatomaly: "achromatomaly";
    }>>;
    severity: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type ValidateColorBlindnessInput = z.infer<typeof validateColorBlindnessSchema>;
export declare function validateColorBlindness(input: ValidateColorBlindnessInput): Promise<{
    severity: number;
    colorCount: number;
    results: Record<string, unknown>;
    overallAssessment: {
        accessible: boolean;
        message: string;
        recommendation: string | undefined;
    };
}>;
//# sourceMappingURL=validateColorBlindness.d.ts.map