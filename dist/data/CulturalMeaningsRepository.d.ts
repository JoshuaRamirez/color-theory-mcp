/**
 * Culture regions supported.
 */
export type CultureRegion = 'western' | 'eastAsian' | 'southAsian' | 'middleEastern' | 'african' | 'latinAmerican' | 'indigenous';
/**
 * Context types for color meanings.
 */
export type MeaningContext = 'general' | 'business' | 'wedding' | 'mourning';
/**
 * Color meaning entry.
 */
export interface ColorMeaning {
    color: string;
    region: CultureRegion;
    context: MeaningContext;
    meanings: string[];
}
/**
 * Complete color meanings for a color.
 */
export interface ColorMeanings {
    color: string;
    byRegion: Record<CultureRegion, Record<MeaningContext, string[]>>;
}
/**
 * Repository for cultural color meanings.
 */
export declare class CulturalMeaningsRepository {
    private readonly data;
    constructor();
    /**
     * Gets meanings for a specific color.
     */
    getByColor(colorName: string): ColorMeanings | undefined;
    /**
     * Gets meanings for a color in a specific region.
     */
    getByColorAndRegion(colorName: string, region: CultureRegion): Record<MeaningContext, string[]> | undefined;
    /**
     * Gets a specific meaning.
     */
    getMeaning(colorName: string, region: CultureRegion, context: MeaningContext): string[] | undefined;
    /**
     * Lists all colors with cultural meanings.
     */
    listColors(): string[];
    /**
     * Gets all meanings for a given context across all regions.
     */
    getMeaningsByContext(colorName: string, context: MeaningContext): {
        region: CultureRegion;
        meanings: string[];
    }[];
    /**
     * Searches for colors by meaning keyword.
     */
    searchByMeaning(keyword: string): ColorMeaning[];
}
//# sourceMappingURL=CulturalMeaningsRepository.d.ts.map