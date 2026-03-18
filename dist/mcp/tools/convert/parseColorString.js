import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { NamedColorsRepository } from '../../../data/NamedColorsRepository.js';
const conversionService = new ConversionService();
const namedColors = new NamedColorsRepository();
export const parseColorStringSchema = z.object({
    color: z.string().describe('Color string in any CSS format'),
});
export async function parseColorString(input) {
    try {
        const color = parseColor(input.color);
        const srgb = conversionService.convert(color, 'srgb');
        const [r, g, b] = srgb.toRgbArray();
        // Determine what format the input was in
        const trimmed = input.color.trim().toLowerCase();
        let detectedFormat;
        if (trimmed.startsWith('#')) {
            detectedFormat = 'hex';
        }
        else if (trimmed.startsWith('rgb')) {
            detectedFormat = 'rgb';
        }
        else if (trimmed.startsWith('hsl')) {
            detectedFormat = 'hsl';
        }
        else if (namedColors.getByName(trimmed)) {
            detectedFormat = 'named';
        }
        else {
            detectedFormat = 'unknown';
        }
        return {
            input: input.color,
            valid: true,
            detectedFormat,
            parsed: {
                space: color.space,
                components: color.components.map(c => Math.round(c * 10000) / 10000),
                alpha: color.alpha,
            },
            normalized: {
                hex: srgb.toHex(),
                rgb: { r, g, b },
                rgbString: `rgb(${r}, ${g}, ${b})`,
                rgbaString: srgb.alpha < 1
                    ? `rgba(${r}, ${g}, ${b}, ${srgb.alpha})`
                    : `rgb(${r}, ${g}, ${b})`,
            },
        };
    }
    catch (error) {
        return {
            input: input.color,
            valid: false,
            error: error instanceof Error ? error.message : 'Unable to parse color',
            supportedFormats: [
                '#RGB',
                '#RGBA',
                '#RRGGBB',
                '#RRGGBBAA',
                'rgb(r, g, b)',
                'rgba(r, g, b, a)',
                'hsl(h, s%, l%)',
                'hsla(h, s%, l%, a)',
                'Named colors (red, blue, etc.)',
            ],
        };
    }
}
//# sourceMappingURL=parseColorString.js.map