import culturalMeanings from './cultural-meanings.json' with { type: 'json' };
import expandedMeanings from './expanded-cultural-meanings.json' with { type: 'json' };

/**
 * Culture regions supported.
 */
export type CultureRegion =
  | 'western'
  | 'eastAsian'
  | 'southAsian'
  | 'middleEastern'
  | 'african'
  | 'latinAmerican'
  | 'indigenous';

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
export class CulturalMeaningsRepository {
  private readonly data: Record<string, Record<CultureRegion, Record<MeaningContext, string[]>>>;

  constructor() {
    // Merge base meanings with expanded regional meanings
    const base = culturalMeanings as Record<string, Record<string, Record<string, string[]>>>;
    const expanded = expandedMeanings as Record<string, Record<string, Record<string, string[]>>>;
    const merged: Record<string, Record<string, Record<string, string[]>>> = {};

    // Copy base data
    for (const [color, regions] of Object.entries(base)) {
      merged[color] = { ...regions };
    }

    // Merge expanded data
    for (const [color, regions] of Object.entries(expanded)) {
      if (!merged[color]) {
        merged[color] = {};
      }
      for (const [region, contexts] of Object.entries(regions)) {
        merged[color]![region] = contexts;
      }
    }

    this.data = merged as typeof this.data;
  }

  /**
   * Gets meanings for a specific color.
   */
  getByColor(colorName: string): ColorMeanings | undefined {
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
  getByColorAndRegion(
    colorName: string,
    region: CultureRegion
  ): Record<MeaningContext, string[]> | undefined {
    const colorData = this.data[colorName.toLowerCase()];
    return colorData?.[region];
  }

  /**
   * Gets a specific meaning.
   */
  getMeaning(
    colorName: string,
    region: CultureRegion,
    context: MeaningContext
  ): string[] | undefined {
    const colorData = this.data[colorName.toLowerCase()];
    return colorData?.[region]?.[context];
  }

  /**
   * Lists all colors with cultural meanings.
   */
  listColors(): string[] {
    return Object.keys(this.data);
  }

  /**
   * Gets all meanings for a given context across all regions.
   */
  getMeaningsByContext(
    colorName: string,
    context: MeaningContext
  ): { region: CultureRegion; meanings: string[] }[] {
    const colorData = this.data[colorName.toLowerCase()];
    if (!colorData) {
      return [];
    }

    const results: { region: CultureRegion; meanings: string[] }[] = [];
    const regions: CultureRegion[] = [
      'western',
      'eastAsian',
      'southAsian',
      'middleEastern',
      'african',
      'latinAmerican',
      'indigenous',
    ];

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
  searchByMeaning(keyword: string): ColorMeaning[] {
    const lowerKeyword = keyword.toLowerCase();
    const results: ColorMeaning[] = [];

    for (const [color, regions] of Object.entries(this.data)) {
      for (const [region, contexts] of Object.entries(regions)) {
        for (const [context, meanings] of Object.entries(contexts)) {
          const matchingMeanings = (meanings as string[]).filter((m) =>
            m.toLowerCase().includes(lowerKeyword)
          );
          if (matchingMeanings.length > 0) {
            results.push({
              color,
              region: region as CultureRegion,
              context: context as MeaningContext,
              meanings: matchingMeanings,
            });
          }
        }
      }
    }

    return results;
  }
}
