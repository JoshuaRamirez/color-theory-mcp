import { z } from 'zod';
export declare const generateDesignTokensSchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    prefix: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        w3c: "w3c";
        "css-variables": "css-variables";
        tailwind: "tailwind";
    }>>>;
}, z.core.$strip>;
export type GenerateDesignTokensInput = z.infer<typeof generateDesignTokensSchema>;
/**
 * Generates design tokens from a list of named colors in one of three output formats:
 * W3C Design Token Format, CSS custom properties, or Tailwind CSS configuration.
 * All colors are normalized to sRGB hex for output.
 */
export declare function generateDesignTokens(input: GenerateDesignTokensInput): Promise<Record<string, unknown> | {
    format: string;
    css: string;
} | {
    format: string;
    tailwind: {
        colors: Record<string, string>;
    };
}>;
//# sourceMappingURL=generateDesignTokens.d.ts.map