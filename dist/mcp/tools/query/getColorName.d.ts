import { z } from 'zod';
export declare const getColorNameSchema: z.ZodObject<{
    color: z.ZodString;
    includeAlternatives: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GetColorNameInput = z.infer<typeof getColorNameSchema>;
export declare function getColorName(input: GetColorNameInput): Promise<{
    input: string;
    exactMatch: boolean;
    name: string;
    hex: string;
    alternatives: {
        name: string;
        hex: string;
    }[] | undefined;
    difference?: undefined;
} | {
    input: string;
    exactMatch: boolean;
    name: string;
    hex: string;
    difference: {
        deltaE: number;
        description: string;
        perceptible: boolean;
    };
    alternatives: {
        name: string;
        hex: string;
        deltaE: number;
    }[] | undefined;
}>;
//# sourceMappingURL=getColorName.d.ts.map