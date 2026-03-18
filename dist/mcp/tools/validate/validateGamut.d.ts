import { z } from 'zod';
export declare const validateGamutSchema: z.ZodObject<{
    color: z.ZodString;
    targetGamut: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
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
    }>>>;
}, z.core.$strip>;
export type ValidateGamutInput = z.infer<typeof validateGamutSchema>;
export declare function validateGamut(input: ValidateGamutInput): Promise<{
    input: string;
    targetGamut: "srgb" | "linear-srgb" | "display-p3" | "rec2020" | "prophoto-rgb" | "acescg" | "xyz-d65" | "xyz-d50" | "lab" | "lch" | "oklab" | "oklch" | "hsl" | "hsv" | "hwb" | "cmyk";
    inGamut: boolean;
    original: {
        hex: string;
        components: number[];
    };
    analysis: {
        message: string;
        outOfGamutComponents?: undefined;
        clampedVersion?: undefined;
        mappedVersion?: undefined;
    } | {
        message: string;
        outOfGamutComponents: {
            index: number;
            value: number;
            range: string;
        }[];
        clampedVersion: {
            hex: string;
            note: string;
        };
        mappedVersion: {
            hex: string;
            note: string;
        };
    };
    gamutInfo: {
        srgb: string;
        'display-p3': string;
        rec2020: string;
        'prophoto-rgb': string;
        acescg: string;
        'linear-srgb': string;
    };
}>;
//# sourceMappingURL=validateGamut.d.ts.map