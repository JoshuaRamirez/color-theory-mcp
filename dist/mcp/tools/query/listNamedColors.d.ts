import { z } from 'zod';
export declare const listNamedColorsSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type ListNamedColorsInput = z.infer<typeof listNamedColorsSchema>;
export declare function listNamedColors(input: ListNamedColorsInput): Promise<{
    total: number;
    returned: number;
    colors: {
        name: string;
        hex: string;
    }[];
}>;
//# sourceMappingURL=listNamedColors.d.ts.map