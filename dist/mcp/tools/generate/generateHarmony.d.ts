import { z } from 'zod';
export declare const generateHarmonySchema: z.ZodObject<{
    baseColor: z.ZodString;
    harmonyType: z.ZodEnum<{
        complementary: "complementary";
        analogous: "analogous";
        triadic: "triadic";
        "split-complementary": "split-complementary";
        tetradic: "tetradic";
        square: "square";
        monochromatic: "monochromatic";
    }>;
    count: z.ZodOptional<z.ZodNumber>;
    angleSpread: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type GenerateHarmonyInput = z.infer<typeof generateHarmonySchema>;
export declare function generateHarmony(input: GenerateHarmonyInput): Promise<{
    baseColor: {
        input: string;
        hex: string;
    };
    harmonyType: "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "square" | "monochromatic";
    description: string;
    angles: readonly number[];
    palette: {
        count: number;
        colors: {
            index: number;
            hex: string;
            hue: number;
        }[];
    };
    usage: string;
}>;
//# sourceMappingURL=generateHarmony.d.ts.map