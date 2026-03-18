import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ThemeService } from '../../../services/ThemeService.js';
const themeService = new ThemeService();
export const generateThemeSchema = z.object({
    seedColor: z.string().describe('Seed color for theme generation'),
    mode: z.enum(['light', 'dark', 'both']).optional().default('both').describe('Theme mode to generate'),
});
/**
 * Generates a Material Design 3 theme from a seed color.
 * Produces light and/or dark color roles and all six tonal palettes
 * (primary, secondary, tertiary, neutral, neutral-variant, error).
 */
export async function generateTheme(input) {
    const seedColor = parseColor(input.seedColor);
    const mode = input.mode ?? 'both';
    const theme = themeService.generateTheme(seedColor);
    const result = {
        seed: theme.seed,
        mode,
    };
    if (mode === 'light' || mode === 'both') {
        result.light = theme.light;
    }
    if (mode === 'dark' || mode === 'both') {
        result.dark = theme.dark;
    }
    result.palettes = serializePalettes(theme.palettes);
    return result;
}
/**
 * Converts the Map-based TonalPalette entries into plain objects (tone -> hex string)
 * for JSON serialization.
 */
function serializePalettes(palettes) {
    const serialized = {};
    for (const [name, palette] of Object.entries(palettes)) {
        serialized[name] = serializeTonalPalette(palette);
    }
    return serialized;
}
/**
 * Converts a single TonalPalette's Map<number, Color> into a plain { tone: hex } object.
 */
function serializeTonalPalette(palette) {
    const toneMap = {};
    for (const [tone, color] of palette.tones.entries()) {
        toneMap[tone] = color.toHex();
    }
    return toneMap;
}
//# sourceMappingURL=generateTheme.js.map