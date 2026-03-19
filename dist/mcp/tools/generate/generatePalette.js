import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { ContrastService } from '../../../services/ContrastService.js';
import { Color } from '../../../domain/values/Color.js';
const paletteService = new PaletteService();
const conversionService = new ConversionService();
export const generatePaletteSchema = z.object({
    baseColor: z.string().describe('Primary brand color'),
    style: z.enum([
        'minimal', 'vibrant', 'muted', 'professional',
        'warm', 'cool', 'pastel', 'earth', 'jewel', 'neon'
    ]).optional().default('professional')
        .describe('Palette style'),
    includeNeutrals: z.boolean().optional().default(true)
        .describe('Include neutral colors (grays)'),
});
function generateSemanticColor(hue, chroma, lightness) {
    const base = Color.create('oklch', [lightness, chroma, hue], 1);
    const baseSrgb = conversionService.convert(base, 'srgb');
    const light = Color.create('oklch', [0.92, chroma * 0.4, hue], 1);
    const lightSrgb = conversionService.convert(light, 'srgb');
    const dark = Color.create('oklch', [0.25, chroma * 0.6, hue], 1);
    const darkSrgb = conversionService.convert(dark, 'srgb');
    // Black or white text on the base
    const contrastSvc = new ContrastService();
    const onBase = contrastSvc.suggestForeground(baseSrgb);
    const onBaseSrgb = conversionService.convert(onBase, 'srgb');
    return {
        base: baseSrgb.toHex(),
        light: lightSrgb.toHex(),
        dark: darkSrgb.toHex(),
        onBase: onBaseSrgb.toHex(),
    };
}
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
        case 'warm':
            harmonyType = 'analogous';
            adjustments = {};
            break;
        case 'cool':
            harmonyType = 'analogous';
            adjustments = {};
            break;
        case 'pastel':
            harmonyType = 'triadic';
            adjustments = { desaturate: 0.4, lighten: 0.3 };
            break;
        case 'earth':
            harmonyType = 'analogous';
            adjustments = { desaturate: 0.5, darken: 0.15 };
            break;
        case 'jewel':
            harmonyType = 'tetradic';
            adjustments = { darken: 0.15, saturate: 0.2 };
            break;
        case 'neon':
            harmonyType = 'split-complementary';
            adjustments = { saturate: 0.4, lighten: 0.15 };
            break;
        case 'professional':
        default:
            harmonyType = 'split-complementary';
            adjustments = { desaturate: 0.1 };
            break;
    }
    // Generate harmony
    let harmony = paletteService.generateHarmony(baseColor, harmonyType);
    // For warm/cool styles, shift harmony colors into the target hue range
    if (input.style === 'warm' || input.style === 'cool') {
        const targetHueCenter = input.style === 'warm' ? 30 : 220;
        const hueRange = 60; // +/-30 degrees from center
        const baseOklchForShift = conversionService.convert(baseColor, 'oklch');
        const [, , baseHForShift] = baseOklchForShift.components;
        harmony = harmony.map(color => {
            const oklch = conversionService.convert(color, 'oklch');
            const [l, c] = oklch.components;
            const colorH = oklch.components[2];
            const hueDelta = ((colorH - baseHForShift + 540) % 360) - 180;
            const mappedHue = ((targetHueCenter + hueDelta * (hueRange / 180)) + 360) % 360;
            return conversionService.convert(Color.create('oklch', [l, c, mappedHue], color.alpha), 'srgb');
        });
    }
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
    // Generate semantic roles
    const baseOklch2 = conversionService.convert(baseColor, 'oklch');
    const [baseL, baseC] = baseOklch2.components;
    const semanticRoles = {
        error: generateSemanticColor(0, 0.18, 0.45), // Red hue ~0-25
        success: generateSemanticColor(145, 0.15, 0.45), // Green hue ~145
        warning: generateSemanticColor(85, 0.16, 0.55), // Amber/yellow hue ~85
        info: generateSemanticColor(240, 0.12, 0.50), // Blue hue ~240
    };
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
        semantic: semanticRoles,
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