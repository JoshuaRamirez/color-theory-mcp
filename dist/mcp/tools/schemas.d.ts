import { z } from 'zod';
/**
 * Common schema for color input (accepts hex, rgb, or named colors).
 */
export declare const ColorInputSchema: z.ZodString;
/**
 * Schema for color space type.
 */
export declare const ColorSpaceSchema: z.ZodEnum<{
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
/**
 * Schema for harmony types.
 */
export declare const HarmonyTypeSchema: z.ZodEnum<{
    complementary: "complementary";
    analogous: "analogous";
    triadic: "triadic";
    "split-complementary": "split-complementary";
    tetradic: "tetradic";
    square: "square";
    monochromatic: "monochromatic";
}>;
/**
 * Schema for Delta-E methods.
 */
export declare const DeltaEMethodSchema: z.ZodEnum<{
    CIE76: "CIE76";
    CIE94: "CIE94";
    CIEDE2000: "CIEDE2000";
}>;
/**
 * Schema for CVD types.
 */
export declare const CVDTypeSchema: z.ZodEnum<{
    protanopia: "protanopia";
    protanomaly: "protanomaly";
    deuteranopia: "deuteranopia";
    deuteranomaly: "deuteranomaly";
    tritanopia: "tritanopia";
    tritanomaly: "tritanomaly";
    achromatopsia: "achromatopsia";
    achromatomaly: "achromatomaly";
}>;
/**
 * Schema for WCAG levels.
 */
export declare const WCAGLevelSchema: z.ZodEnum<{
    AA: "AA";
    AAA: "AAA";
}>;
/**
 * Schema for text size.
 */
export declare const TextSizeSchema: z.ZodEnum<{
    normal: "normal";
    large: "large";
}>;
/**
 * Schema for culture regions.
 */
export declare const CultureRegionSchema: z.ZodEnum<{
    western: "western";
    eastAsian: "eastAsian";
    southAsian: "southAsian";
    middleEastern: "middleEastern";
}>;
/**
 * Schema for meaning contexts.
 */
export declare const MeaningContextSchema: z.ZodEnum<{
    general: "general";
    business: "business";
    wedding: "wedding";
    mourning: "mourning";
}>;
//# sourceMappingURL=schemas.d.ts.map