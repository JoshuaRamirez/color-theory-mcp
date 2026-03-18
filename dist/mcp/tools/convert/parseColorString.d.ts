import { z } from 'zod';
export declare const parseColorStringSchema: z.ZodObject<{
    color: z.ZodString;
}, z.core.$strip>;
export type ParseColorStringInput = z.infer<typeof parseColorStringSchema>;
export declare function parseColorString(input: ParseColorStringInput): Promise<{
    input: string;
    valid: boolean;
    detectedFormat: string;
    parsed: {
        space: import("../../../domain/index.js").ColorSpaceType;
        components: number[];
        alpha: number;
    };
    normalized: {
        hex: string;
        rgb: {
            r: number;
            g: number;
            b: number;
        };
        rgbString: string;
        rgbaString: string;
    };
    error?: undefined;
    supportedFormats?: undefined;
} | {
    input: string;
    valid: boolean;
    error: string;
    supportedFormats: string[];
    detectedFormat?: undefined;
    parsed?: undefined;
    normalized?: undefined;
}>;
//# sourceMappingURL=parseColorString.d.ts.map