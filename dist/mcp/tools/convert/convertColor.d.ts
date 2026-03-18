import { z } from 'zod';
export declare const convertColorSchema: z.ZodObject<{
    color: z.ZodString;
    targetSpace: z.ZodEnum<{
        srgb: "srgb";
        "linear-srgb": "linear-srgb";
        "display-p3": "display-p3";
        "xyz-d65": "xyz-d65";
        "xyz-d50": "xyz-d50";
        lab: "lab";
        lch: "lch";
        oklab: "oklab";
        oklch: "oklch";
        hsl: "hsl";
        hsv: "hsv";
        hwb: "hwb";
        cmyk: "cmyk";
    }>;
}, z.core.$strip>;
export type ConvertColorInput = z.infer<typeof convertColorSchema>;
export declare function convertColor(input: ConvertColorInput): Promise<{
    input: string;
    targetSpace: "srgb" | "linear-srgb" | "display-p3" | "xyz-d65" | "xyz-d50" | "lab" | "lch" | "oklab" | "oklch" | "hsl" | "hsv" | "hwb" | "cmyk";
    components: Record<string, number>;
    rawComponents: number[];
    alpha: number;
    hex: string | undefined;
    cssString: string;
}>;
//# sourceMappingURL=convertColor.d.ts.map