import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ColorSpaceSchema } from '../schemas.js';
import { ConversionService } from '../../../services/ConversionService.js';
const conversionService = new ConversionService();
export const validateGamutSchema = z.object({
    color: z.string().describe('Color to check'),
    targetGamut: ColorSpaceSchema.optional().default('srgb')
        .describe('Target color space gamut to check against'),
});
export async function validateGamut(input) {
    const color = parseColor(input.color);
    // Check if color is in the target gamut
    const inGamut = conversionService.isInGamut(color, input.targetGamut);
    // Convert to target space and check components
    const converted = conversionService.convert(color, input.targetGamut);
    const components = converted.components;
    // Check which components are out of gamut
    const outOfGamutComponents = [];
    // For RGB-based gamuts, check 0-1 range
    if (['srgb', 'linear-srgb', 'display-p3'].includes(input.targetGamut)) {
        components.forEach((c, i) => {
            if (c < 0 || c > 1) {
                outOfGamutComponents.push({
                    index: i,
                    value: Math.round(c * 10000) / 10000,
                    range: '0-1',
                });
            }
        });
    }
    // Get the clamped version
    const clamped = conversionService.clampToGamut(converted);
    const clampedSrgb = conversionService.convert(clamped, 'srgb');
    // Original in sRGB for display
    const originalSrgb = conversionService.convert(color, 'srgb');
    return {
        input: input.color,
        targetGamut: input.targetGamut,
        inGamut,
        original: {
            hex: originalSrgb.toHex(),
            components: components.map(c => Math.round(c * 10000) / 10000),
        },
        analysis: inGamut
            ? {
                message: `Color is within the ${input.targetGamut} gamut`,
            }
            : {
                message: `Color is outside the ${input.targetGamut} gamut`,
                outOfGamutComponents,
                clampedVersion: {
                    hex: clampedSrgb.toHex(),
                    note: 'This is the closest color within the target gamut',
                },
            },
        gamutInfo: {
            srgb: 'Standard web RGB color space',
            'display-p3': '25% larger than sRGB, used by Apple devices',
            'linear-srgb': 'Linear light sRGB (no gamma)',
        },
    };
}
//# sourceMappingURL=validateGamut.js.map