import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { HarmonyTypeSchema } from '../schemas.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { HarmonyRegistry } from '../../../strategies/harmony/HarmonyRegistry.js';
const paletteService = new PaletteService();
const conversionService = new ConversionService();
const harmonyRegistry = HarmonyRegistry.createDefault();
export const generateHarmonySchema = z.object({
    baseColor: z.string().describe('Base color for harmony generation'),
    harmonyType: HarmonyTypeSchema.describe('Type of harmony to generate'),
    count: z.number().min(2).max(12).optional()
        .describe('Number of colors (for variable-count harmonies like monochromatic)'),
    angleSpread: z.number().min(10).max(60).optional()
        .describe('Angle spread for analogous harmony (default 30)'),
});
export async function generateHarmony(input) {
    const baseColor = parseColor(input.baseColor);
    const palette = paletteService.generateHarmony(baseColor, input.harmonyType, {
        count: input.count,
        angleSpread: input.angleSpread,
    });
    // Get algorithm info
    const algorithm = harmonyRegistry.get(input.harmonyType);
    // Convert all colors to sRGB for display
    const baseSrgb = conversionService.convert(baseColor, 'srgb');
    const colors = palette.colors.map((color, index) => {
        const srgb = conversionService.convert(color, 'srgb');
        const oklch = conversionService.convert(color, 'oklch');
        const [, , h] = oklch.components;
        return {
            index,
            hex: srgb.toHex(),
            hue: Math.round(h),
        };
    });
    return {
        baseColor: {
            input: input.baseColor,
            hex: baseSrgb.toHex(),
        },
        harmonyType: input.harmonyType,
        description: algorithm?.description ?? 'Unknown harmony type',
        angles: algorithm?.angles ?? [],
        palette: {
            count: colors.length,
            colors,
        },
        usage: getUsageTips(input.harmonyType),
    };
}
function getUsageTips(harmonyType) {
    switch (harmonyType) {
        case 'complementary':
            return 'Use for high contrast designs. Good for call-to-action elements against backgrounds.';
        case 'analogous':
            return 'Creates harmony and unity. Best for nature-inspired or calming designs.';
        case 'triadic':
            return 'Vibrant and balanced. Use one color as dominant, others as accents.';
        case 'split-complementary':
            return 'High contrast but less tension than complementary. Versatile for many designs.';
        case 'tetradic':
            return 'Rich color scheme. Works best when one color dominates and others accent.';
        case 'square':
            return 'Bold and dynamic. Requires careful balance - use muted versions for harmony.';
        case 'monochromatic':
            return 'Elegant and cohesive. Add texture and contrast through value variations.';
        default:
            return '';
    }
}
//# sourceMappingURL=generateHarmony.js.map