import { z } from 'zod';
export declare const generateThemeSchema: z.ZodObject<{
    seedColor: z.ZodString;
    mode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        dark: "dark";
        light: "light";
        both: "both";
    }>>>;
}, z.core.$strip>;
export type GenerateThemeInput = z.infer<typeof generateThemeSchema>;
/**
 * Generates a Material Design 3 theme from a seed color.
 * Produces light and/or dark color roles and all six tonal palettes
 * (primary, secondary, tertiary, neutral, neutral-variant, error).
 */
export declare function generateTheme(input: GenerateThemeInput): Promise<Record<string, unknown>>;
//# sourceMappingURL=generateTheme.d.ts.map