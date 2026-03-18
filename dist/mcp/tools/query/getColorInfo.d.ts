import { z } from 'zod';
export declare const getColorInfoSchema: z.ZodObject<{
    color: z.ZodString;
}, z.core.$strip>;
export type GetColorInfoInput = z.infer<typeof getColorInfoSchema>;
export declare function getColorInfo(input: GetColorInfoInput): Promise<{
    input: string;
    formats: {
        hex: string;
        hexWithAlpha: string;
        rgb: {
            r: number;
            g: number;
            b: number;
        };
        rgbString: string;
        hsl: {
            h: number;
            s: number;
            l: number;
        };
        hslString: string;
        hsv: {
            h: number;
            s: number;
            v: number;
        };
    };
    perceptual: {
        lab: {
            L: number;
            a: number;
            b: number;
        };
        lch: {
            L: number;
            C: number;
            H: number;
        };
        oklab: {
            L: number;
            a: number;
            b: number;
        };
        oklch: {
            L: number;
            C: number;
            H: number;
        };
    };
    analysis: {
        luminance: number;
        isLight: boolean;
        suggestedTextColor: string;
        contrastWithWhite: number;
        contrastWithBlack: number;
    };
    closestNamedColor: {
        name: string;
        hex: string;
    };
    alpha: number;
}>;
//# sourceMappingURL=getColorInfo.d.ts.map