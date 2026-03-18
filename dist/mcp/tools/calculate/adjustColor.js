import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
const paletteService = new PaletteService();
const conversionService = new ConversionService();
export const adjustColorSchema = z.object({
    color: z.string().describe('Color to adjust'),
    lighten: z.number().min(0).max(1).optional()
        .describe('Amount to lighten (0-1)'),
    darken: z.number().min(0).max(1).optional()
        .describe('Amount to darken (0-1)'),
    saturate: z.number().min(0).max(1).optional()
        .describe('Amount to increase saturation (0-1)'),
    desaturate: z.number().min(0).max(1).optional()
        .describe('Amount to decrease saturation (0-1)'),
    rotate: z.number().min(-360).max(360).optional()
        .describe('Degrees to rotate hue (-360 to 360)'),
});
export async function adjustColor(input) {
    const color = parseColor(input.color);
    const adjusted = paletteService.adjustColor(color, {
        lighten: input.lighten,
        darken: input.darken,
        saturate: input.saturate,
        desaturate: input.desaturate,
        rotate: input.rotate,
    });
    // Convert to sRGB for display
    const originalSrgb = conversionService.convert(color, 'srgb');
    const adjustedSrgb = conversionService.convert(adjusted, 'srgb');
    // Get Oklch values for comparison
    const originalOklch = conversionService.convert(color, 'oklch');
    const adjustedOklch = conversionService.convert(adjusted, 'oklch');
    const [origL, origC, origH] = originalOklch.components;
    const [adjL, adjC, adjH] = adjustedOklch.components;
    const adjustments = [];
    if (input.lighten)
        adjustments.push(`lightened by ${Math.round(input.lighten * 100)}%`);
    if (input.darken)
        adjustments.push(`darkened by ${Math.round(input.darken * 100)}%`);
    if (input.saturate)
        adjustments.push(`saturated by ${Math.round(input.saturate * 100)}%`);
    if (input.desaturate)
        adjustments.push(`desaturated by ${Math.round(input.desaturate * 100)}%`);
    if (input.rotate)
        adjustments.push(`hue rotated by ${input.rotate}°`);
    return {
        original: {
            input: input.color,
            hex: originalSrgb.toHex(),
            oklch: {
                L: Math.round(origL * 1000) / 1000,
                C: Math.round(origC * 1000) / 1000,
                H: Math.round(origH * 100) / 100,
            },
        },
        adjusted: {
            hex: adjustedSrgb.toHex(),
            oklch: {
                L: Math.round(adjL * 1000) / 1000,
                C: Math.round(adjC * 1000) / 1000,
                H: Math.round(adjH * 100) / 100,
            },
        },
        changes: {
            lightness: Math.round((adjL - origL) * 1000) / 1000,
            chroma: Math.round((adjC - origC) * 1000) / 1000,
            hue: Math.round((adjH - origH) * 100) / 100,
        },
        appliedAdjustments: adjustments.length > 0 ? adjustments : ['no adjustments applied'],
    };
}
//# sourceMappingURL=adjustColor.js.map