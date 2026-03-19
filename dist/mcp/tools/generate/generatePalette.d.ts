import { z } from 'zod';
export declare const generatePaletteSchema: z.ZodObject<{
    baseColor: z.ZodString;
    style: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        earth: "earth";
        warm: "warm";
        cool: "cool";
        professional: "professional";
        minimal: "minimal";
        vibrant: "vibrant";
        muted: "muted";
        pastel: "pastel";
        jewel: "jewel";
        neon: "neon";
    }>>>;
    includeNeutrals: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type GeneratePaletteInput = z.infer<typeof generatePaletteSchema>;
export declare function generatePalette(input: GeneratePaletteInput): Promise<{
    baseColor: {
        input: string;
        hex: string;
    };
    style: "earth" | "warm" | "cool" | "professional" | "minimal" | "vibrant" | "muted" | "pastel" | "jewel" | "neon";
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
    semantic: {
        error: {
            base: string;
            light: string;
            dark: string;
            onBase: string;
        };
        success: {
            base: string;
            light: string;
            dark: string;
            onBase: string;
        };
        warning: {
            base: string;
            light: string;
            dark: string;
            onBase: string;
        };
        info: {
            base: string;
            light: string;
            dark: string;
            onBase: string;
        };
    };
}>;
//# sourceMappingURL=generatePalette.d.ts.map