import { z } from 'zod';
export declare const calculateAPCASchema: z.ZodObject<{
    textColor: z.ZodString;
    backgroundColor: z.ZodString;
}, z.core.$strip>;
export type CalculateAPCAInput = z.infer<typeof calculateAPCASchema>;
/**
 * Calculates the APCA (Accessible Perceptual Contrast Algorithm) lightness contrast
 * between a text color and a background color. APCA is the contrast algorithm
 * proposed for WCAG 3.0 and is polarity-aware.
 */
export declare function calculateAPCA(input: CalculateAPCAInput): Promise<{
    textColor: string;
    backgroundColor: string;
    Lc: number;
    absoluteLc: number;
    polarity: "reverse" | "normal";
    interpretation: string;
    passes: {
        bodyText: boolean;
        largeText: boolean;
        nonText: boolean;
        spotText: boolean;
    };
    note: string;
}>;
//# sourceMappingURL=calculateAPCA.d.ts.map