import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { NamedColorsRepository } from '../../../data/NamedColorsRepository.js';
import { DeltaERegistry } from '../../../strategies/delta-e/DeltaERegistry.js';
const conversionService = new ConversionService();
const namedColors = new NamedColorsRepository();
const deltaERegistry = DeltaERegistry.createDefault();
export const getColorNameSchema = z.object({
    color: z.string().describe('Color value (hex, RGB, or named color)'),
    includeAlternatives: z.boolean().optional().default(false)
        .describe('Include alternative similar named colors'),
});
export async function getColorName(input) {
    const color = parseColor(input.color);
    const srgb = conversionService.convert(color, 'srgb');
    // Find exact match first
    const exactMatch = namedColors.getByHex(srgb.toHex());
    if (exactMatch.length > 0) {
        return {
            input: input.color,
            exactMatch: true,
            name: exactMatch[0].name,
            hex: exactMatch[0].hex,
            alternatives: exactMatch.length > 1
                ? exactMatch.slice(1).map(c => ({ name: c.name, hex: c.hex }))
                : undefined,
        };
    }
    // Find closest match
    const closest = namedColors.findClosest(srgb);
    // Calculate Delta-E to show how different it is
    const deltaE = deltaERegistry.getDefault();
    const difference = deltaE.calculate(srgb, closest.color);
    const interpretation = deltaE.interpret(difference);
    // Find alternatives if requested
    let alternatives;
    if (input.includeAlternatives) {
        const allColors = namedColors.listAll();
        const withDistances = allColors.map(c => ({
            name: c.name,
            hex: c.hex,
            deltaE: deltaE.calculate(srgb, c.color),
        }));
        // Sort by Delta-E and take top 5 (excluding the closest)
        alternatives = withDistances
            .sort((a, b) => a.deltaE - b.deltaE)
            .slice(1, 6)
            .map(c => ({
            name: c.name,
            hex: c.hex,
            deltaE: Math.round(c.deltaE * 100) / 100,
        }));
    }
    return {
        input: input.color,
        exactMatch: false,
        name: closest.name,
        hex: closest.hex,
        difference: {
            deltaE: Math.round(difference * 100) / 100,
            description: interpretation.description,
            perceptible: interpretation.perceptible,
        },
        alternatives,
    };
}
//# sourceMappingURL=getColorName.js.map