import { z } from 'zod';
import { CultureRegionSchema, MeaningContextSchema } from '../schemas.js';
import { CulturalMeaningsRepository, type CultureRegion, type MeaningContext } from '../../../data/CulturalMeaningsRepository.js';

const culturalMeanings = new CulturalMeaningsRepository();

export const getColorMeaningSchema = z.object({
  color: z.string().describe('Color name (red, blue, green, etc.)'),
  region: CultureRegionSchema.optional()
    .describe('Specific cultural region to get meanings for'),
  context: MeaningContextSchema.optional()
    .describe('Specific context (general, business, wedding, mourning)'),
});

export type GetColorMeaningInput = z.infer<typeof getColorMeaningSchema>;

export async function getColorMeaning(input: GetColorMeaningInput) {
  const colorData = culturalMeanings.getByColor(input.color);

  if (!colorData) {
    // List available colors
    const availableColors = culturalMeanings.listColors();
    return {
      error: `No cultural meanings found for color: ${input.color}`,
      availableColors,
      suggestion: 'Try one of the available colors listed above',
    };
  }

  // If specific region requested
  if (input.region) {
    const regionData = colorData.byRegion[input.region as CultureRegion];

    // If specific context requested
    if (input.context) {
      const contextMeanings = regionData?.[input.context as MeaningContext];
      return {
        color: input.color,
        region: input.region,
        context: input.context,
        meanings: contextMeanings ?? [],
      };
    }

    // Return all contexts for the region
    return {
      color: input.color,
      region: input.region,
      meanings: regionData,
    };
  }

  // If specific context requested (all regions)
  if (input.context) {
    const contextMeanings = culturalMeanings.getMeaningsByContext(
      input.color,
      input.context as MeaningContext
    );
    return {
      color: input.color,
      context: input.context,
      meaningsByRegion: contextMeanings,
    };
  }

  // Return all meanings
  return {
    color: input.color,
    meanings: colorData.byRegion,
  };
}
