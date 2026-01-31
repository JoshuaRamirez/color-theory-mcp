import { z } from 'zod';
import { NamedColorsRepository } from '../../../data/NamedColorsRepository.js';

const namedColors = new NamedColorsRepository();

export const listNamedColorsSchema = z.object({
  search: z.string().optional()
    .describe('Filter colors by name (partial match)'),
  limit: z.number().optional().default(50)
    .describe('Maximum number of colors to return'),
});

export type ListNamedColorsInput = z.infer<typeof listNamedColorsSchema>;

export async function listNamedColors(input: ListNamedColorsInput) {
  let colors = input.search
    ? namedColors.search(input.search)
    : namedColors.listAll();

  const total = colors.length;

  // Apply limit
  if (input.limit && colors.length > input.limit) {
    colors = colors.slice(0, input.limit);
  }

  return {
    total,
    returned: colors.length,
    colors: colors.map(c => ({
      name: c.name,
      hex: c.hex,
    })),
  };
}
