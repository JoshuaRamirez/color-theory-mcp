import { z } from 'zod';
import { type CultureRegion, type MeaningContext } from '../../../data/CulturalMeaningsRepository.js';
export declare const getColorMeaningSchema: z.ZodObject<{
    color: z.ZodString;
    region: z.ZodOptional<z.ZodEnum<{
        western: "western";
        eastAsian: "eastAsian";
        southAsian: "southAsian";
        middleEastern: "middleEastern";
        african: "african";
        latinAmerican: "latinAmerican";
        indigenous: "indigenous";
    }>>;
    context: z.ZodOptional<z.ZodEnum<{
        general: "general";
        business: "business";
        wedding: "wedding";
        mourning: "mourning";
    }>>;
}, z.core.$strip>;
export type GetColorMeaningInput = z.infer<typeof getColorMeaningSchema>;
export declare function getColorMeaning(input: GetColorMeaningInput): Promise<{
    error: string;
    availableColors: string[];
    suggestion: string;
    color?: undefined;
    region?: undefined;
    context?: undefined;
    meanings?: undefined;
    meaningsByRegion?: undefined;
} | {
    color: string;
    region: "western" | "eastAsian" | "southAsian" | "middleEastern" | "african" | "latinAmerican" | "indigenous";
    context: "general" | "business" | "wedding" | "mourning";
    meanings: string[];
    error?: undefined;
    availableColors?: undefined;
    suggestion?: undefined;
    meaningsByRegion?: undefined;
} | {
    color: string;
    region: "western" | "eastAsian" | "southAsian" | "middleEastern" | "african" | "latinAmerican" | "indigenous";
    meanings: Record<MeaningContext, string[]>;
    error?: undefined;
    availableColors?: undefined;
    suggestion?: undefined;
    context?: undefined;
    meaningsByRegion?: undefined;
} | {
    color: string;
    context: "general" | "business" | "wedding" | "mourning";
    meaningsByRegion: {
        region: CultureRegion;
        meanings: string[];
    }[];
    error?: undefined;
    availableColors?: undefined;
    suggestion?: undefined;
    region?: undefined;
    meanings?: undefined;
} | {
    color: string;
    meanings: Record<CultureRegion, Record<MeaningContext, string[]>>;
    error?: undefined;
    availableColors?: undefined;
    suggestion?: undefined;
    region?: undefined;
    context?: undefined;
    meaningsByRegion?: undefined;
}>;
//# sourceMappingURL=getColorMeaning.d.ts.map