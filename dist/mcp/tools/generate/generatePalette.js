import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
const paletteService = new PaletteService();
const conversionService = new ConversionService();
export const generatePaletteSchema = z.object({
    baseColor: z.string().describe('Primary brand color'),
    style: z.enum(['minimal', 'vibrant', 'muted', 'professional']).optional().default('professional')
        .describe('Palette style'),
    includeNeutrals: z.boolean().optional().default(true)
        .describe('Include neutral colors (grays)'),
});
export async function generatePalette(input) {
    const baseColor = parseColor(input.baseColor);
    // Generate based on style
    let harmonyType;
    let adjustments = {};
    switch (input.style) {
        case 'minimal':
            harmonyType = 'monochromatic';
            adjustments = { desaturate: 0.3 };
            break;
        case 'vibrant':
            harmonyType = 'triadic';
            break;
        case 'muted':
            harmonyType = 'analogous';
            adjustments = { desaturate: 0.2 };
            break;
        case 'professional':
        default:
            harmonyType = 'split-complementary';
            adjustments = { desaturate: 0.1 };
            break;
    }
    // Generate harmony
    const harmony = paletteService.generateHarmony(baseColor, harmonyType);
    // Apply style adjustments
    const colors = harmony.colors.map((color, index) => {
        let adjusted = color;
        if (Object.keys(adjustments).length > 0) {
            adjusted = paletteService.adjustColor(color, adjustments);
        }
        const srgb = conversionService.convert(adjusted, 'srgb');
        return {
            role: getRoleForIndex(index, harmony.colors.length),
            hex: srgb.toHex(),
        };
    });
    // Generate neutrals if requested
    let neutrals;
    if (input.includeNeutrals) {
        const baseOklch = conversionService.convert(baseColor, 'oklch');
        const [, , h] = baseOklch.components;
        neutrals = [
            { role: 'background', hex: '#FFFFFF' },
            { role: 'surface', hex: '#F8F9FA' },
            { role: 'border', hex: '#DEE2E6' },
            { role: 'muted', hex: '#6C757D' },
            { role: 'foreground', hex: '#212529' },
        ];
        // Tint neutrals slightly with base hue for cohesion
        neutrals = neutrals.map(n => {
            const color = parseColor(n.hex);
            const oklch = conversionService.convert(color, 'oklch');
            const [l, ,] = oklch.components;
            // Add very subtle chroma with base hue
            const tinted = conversionService.convert(color.withComponents([l, 0.005, h]), 'srgb');
            return {
                role: n.role,
                hex: l > 0.9 || l < 0.2 ? n.hex : tinted.toHex(), // Keep pure white/black
            };
        });
    }
    // Generate scale for primary color
    const scale = paletteService.generateScale(baseColor);
    const scaleColors = [...scale.steps.entries()].map(([step, color]) => ({
        step,
        hex: conversionService.convert(color, 'srgb').toHex(),
    }));
    const baseSrgb = conversionService.convert(baseColor, 'srgb');
    return {
        baseColor: {
            input: input.baseColor,
            hex: baseSrgb.toHex(),
        },
        style: input.style,
        palette: {
            primary: colors[0]?.hex,
            secondary: colors[1]?.hex,
            accent: colors[2]?.hex,
            allColors: colors,
        },
        scale: {
            description: 'Tailwind-style lightness scale for the primary color',
            colors: scaleColors,
        },
        neutrals: neutrals ?? undefined,
    };
}
function getRoleForIndex(index, _total) {
    if (index === 0)
        return 'primary';
    if (index === 1)
        return 'secondary';
    if (index === 2)
        return 'accent';
    if (index === 3)
        return 'accent2';
    return `color${index + 1}`;
}
//# sourceMappingURL=generatePalette.js.map