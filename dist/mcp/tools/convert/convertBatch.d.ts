import { z } from 'zod';
export declare const convertBatchSchema: z.ZodObject<{
    colors: z.ZodArray<z.ZodString>;
    targetSpace: z.ZodEnum<{
        srgb: "srgb";
        "linear-srgb": "linear-srgb";
        "display-p3": "display-p3";
        rec2020: "rec2020";
        "prophoto-rgb": "prophoto-rgb";
        acescg: "acescg";
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
export type ConvertBatchInput = z.infer<typeof convertBatchSchema>;
export declare function convertBatch(input: ConvertBatchInput): Promise<{
    targetSpace: "srgb" | "linear-srgb" | "display-p3" | "rec2020" | "prophoto-rgb" | "acescg" | "xyz-d65" | "xyz-d50" | "lab" | "lch" | "oklab" | "oklch" | "hsl" | "hsv" | "hwb" | "cmyk";
    total: number;
    successful: number;
    failed: number;
    results: ({
        index: number;
        input: string;
        components: number[];
        alpha: number;
        hex: string | undefined;
        success: boolean;
        error?: undefined;
    } | {
        index: number;
        input: string;
        success: boolean;
        error: string;
        components?: undefined;
        alpha?: undefined;
        hex?: undefined;
    })[];
}>;
//# sourceMappingURL=convertBatch.d.ts.map