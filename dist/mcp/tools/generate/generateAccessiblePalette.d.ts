import { z } from 'zod';
export declare const generateAccessiblePaletteSchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodString>;
    backgroundColor: z.ZodString;
    level: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        AA: "AA";
        AAA: "AAA";
    }>>>;
}, z.core.$strip>;
export type GenerateAccessiblePaletteInput = z.infer<typeof generateAccessiblePaletteSchema>;
export declare function generateAccessiblePalette(input: GenerateAccessiblePaletteInput): Promise<{
    background: {
        input: string;
        hex: string;
    };
    targetLevel: "AA" | "AAA";
    requiredContrast: string;
    summary: {
        total: number;
        alreadyAccessible: number;
        adjusted: number;
    };
    colors: ({
        input: string;
        original: {
            hex: string;
            contrast: number;
            passes: boolean;
        };
        adjusted: null;
        note: string;
    } | {
        input: string;
        original: {
            hex: string;
            contrast: number;
            passes: boolean;
        };
        adjusted: {
            hex: string;
            contrast: number;
            passes: boolean;
            lightnessChange: number;
        };
        note: string;
    })[];
}>;
//# sourceMappingURL=generateAccessiblePalette.d.ts.map