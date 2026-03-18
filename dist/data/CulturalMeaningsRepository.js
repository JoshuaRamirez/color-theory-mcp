import culturalMeanings from './cultural-meanings.json' with { type: 'json' };
/**
 * Repository for cultural color meanings.
 */
export class CulturalMeaningsRepository {
    data;
    constructor() {
        this.data = culturalMeanings;
    }
    /**
     * Gets meanings for a specific color.
     */
    getByColor(colorName) {
        const lowerName = colorName.toLowerCase();
        const colorData = this.data[lowerName];
        if (!colorData) {
            return undefined;
        }
        return {
            color: lowerName,
            byRegion: colorData,
        };
    }
    /**
     * Gets meanings for a color in a specific region.
     */
    getByColorAndRegion(colorName, region) {
        const colorData = this.data[colorName.toLowerCase()];
        return colorData?.[region];
    }
    /**
     * Gets a specific meaning.
     */
    getMeaning(colorName, region, context) {
        const colorData = this.data[colorName.toLowerCase()];
        return colorData?.[region]?.[context];
    }
    /**
     * Lists all colors with cultural meanings.
     */
    listColors() {
        return Object.keys(this.data);
    }
    /**
     * Gets all meanings for a given context across all regions.
     */
    getMeaningsByContext(colorName, context) {
        const colorData = this.data[colorName.toLowerCase()];
        if (!colorData) {
            return [];
        }
        const results = [];
        const regions = ['western', 'eastAsian', 'southAsian', 'middleEastern'];
        for (const region of regions) {
            const meanings = colorData[region]?.[context];
            if (meanings) {
                results.push({ region, meanings });
            }
        }
        return results;
    }
    /**
     * Searches for colors by meaning keyword.
     */
    searchByMeaning(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const results = [];
        for (const [color, regions] of Object.entries(this.data)) {
            for (const [region, contexts] of Object.entries(regions)) {
                for (const [context, meanings] of Object.entries(contexts)) {
                    const matchingMeanings = meanings.filter(m => m.toLowerCase().includes(lowerKeyword));
                    if (matchingMeanings.length > 0) {
                        results.push({
                            color,
                            region: region,
                            context: context,
                            meanings: matchingMeanings,
                        });
                    }
                }
            }
        }
        return results;
    }
}
//# sourceMappingURL=CulturalMeaningsRepository.js.map