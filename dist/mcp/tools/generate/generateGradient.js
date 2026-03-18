import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
const paletteService = new PaletteService();
const conversionService = new ConversionService();
export const generateGradientSchema = z.object({
    startColor: z.string().describe('Starting color of the gradient'),
    endColor: z.string().describe('Ending color of the gradient'),
    steps: z.number().min(2).max(20).optional().default(5)
        .describe('Number of color stops in the gradient'),
    includeCSS: z.boolean().optional().default(true)
        .describe('Include CSS gradient string'),
});
export async function generateGradient(input) {
    const startColor = parseColor(input.startColor);
    const endColor = parseColor(input.endColor);
    const gradientColors = paletteService.generateGradient(startColor, endColor, input.steps);
    // Convert all to sRGB
    const startSrgb = conversionService.convert(startColor, 'srgb');
    const endSrgb = conversionService.convert(endColor, 'srgb');
    const stops = gradientColors.map((color, index) => {
        const srgb = conversionService.convert(color, 'srgb');
        const position = Math.round((index / (input.steps - 1)) * 100);
        return {
            index,
            position: `${position}%`,
            hex: srgb.toHex(),
        };
    });
    // Generate CSS
    let cssGradient;
    if (input.includeCSS) {
        const cssStops = stops.map(s => `${s.hex} ${s.position}`).join(', ');
        cssGradient = {
            linear: `linear-gradient(to right, ${cssStops})`,
            radial: `radial-gradient(circle, ${cssStops})`,
        };
    }
    return {
        startColor: {
            input: input.startColor,
            hex: startSrgb.toHex(),
        },
        endColor: {
            input: input.endColor,
            hex: endSrgb.toHex(),
        },
        steps: input.steps,
        gradient: {
            stops,
        },
        css: cssGradient,
        note: 'Gradient uses Oklch interpolation for perceptually uniform color transitions',
    };
}
//# sourceMappingURL=generateGradient.js.map