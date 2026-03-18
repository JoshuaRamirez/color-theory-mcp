import { z } from 'zod';
export declare const validateWcagContrastSchema: z.ZodObject<{
    foreground: z.ZodString;
    background: z.ZodString;
    level: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        AA: "AA";
        AAA: "AAA";
    }>>>;
    textSize: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        normal: "normal";
        large: "large";
    }>>>;
}, z.core.$strip>;
export type ValidateWcagContrastInput = z.infer<typeof validateWcagContrastSchema>;
export declare function validateWcagContrast(input: ValidateWcagContrastInput): Promise<{
    valid: boolean;
    foreground: {
        input: string;
        hex: string;
    };
    background: {
        input: string;
        hex: string;
    };
    contrast: {
        ratio: number;
        ratioString: string;
    };
    requirement: {
        level: "AA" | "AAA";
        textSize: "normal" | "large";
        minimumRatio: number;
    };
    result: string;
    suggestion: {
        hex: string;
        contrast: number;
        message: string;
    } | undefined;
    allLevels: {
        'AA-normal': boolean;
        'AA-large': boolean;
        'AAA-normal': boolean;
        'AAA-large': boolean;
    };
}>;
//# sourceMappingURL=validateWcagContrast.d.ts.map