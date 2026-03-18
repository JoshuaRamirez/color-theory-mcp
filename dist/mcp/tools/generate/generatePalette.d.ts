import { z } from 'zod';
export declare const generatePaletteSchema: z.ZodObject<{
    baseColor: z.ZodString;
    style: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        professional: "professional";
        minimal: "minimal";
        vibrant: "vibrant";
        muted: "muted";
    }>>>;
    includeNeutrals: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GeneratePaletteInput = z.infer<typeof generatePaletteSchema>;
export declare function generatePalette(input: GeneratePaletteInput): Promise<{
    baseColor: {
        input: string;
        hex: string;
    };
    style: "professional" | "minimal" | "vibrant" | "muted";
    palette: {
        primary: string | undefined;
        secondary: string | undefined;
        accent: string | undefined;
        allColors: {
            role: string;
            hex: string;
        }[];
    };
    scale: {
        description: string;
        colors: {
            step: import("../../../services/PaletteService.js").ScaleStep;
            hex: string;
        }[];
    };
    neutrals: {
        role: string;
        hex: string;
    }[] | undefined;
}>;
//# sourceMappingURL=generatePalette.d.ts.map