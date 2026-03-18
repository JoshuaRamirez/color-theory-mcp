import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { TemperatureService } from '../../../services/TemperatureService.js';
const temperatureService = new TemperatureService();
export const calculateTemperatureSchema = z
    .object({
    color: z
        .string()
        .optional()
        .describe('A color to estimate the correlated color temperature of'),
    kelvin: z
        .number()
        .optional()
        .describe('A Kelvin value to convert to its corresponding sRGB color'),
})
    .refine((data) => data.color !== undefined || data.kelvin !== undefined, {
    message: 'At least one of "color" or "kelvin" must be provided',
});
/**
 * Converts between colors and correlated color temperatures (Kelvin).
 * Accepts a color to estimate its temperature, a Kelvin value to convert to a color,
 * or both to perform both operations simultaneously.
 */
export async function calculateTemperature(input) {
    const result = {};
    if (input.kelvin !== undefined) {
        const kelvinResult = temperatureService.kelvinToColor(input.kelvin);
        result.kelvinToColor = {
            inputKelvin: input.kelvin,
            kelvin: kelvinResult.kelvin,
            color: kelvinResult.color,
            description: kelvinResult.description,
            category: kelvinResult.category,
        };
    }
    if (input.color !== undefined) {
        const parsedColor = parseColor(input.color);
        const tempResult = temperatureService.colorToTemperature(parsedColor);
        result.colorToTemperature = {
            inputColor: input.color,
            estimatedKelvin: tempResult.estimatedKelvin,
            chromaticity: tempResult.chromaticity,
            isOnPlanckianLocus: tempResult.isOnPlanckianLocus,
            description: tempResult.description,
            category: tempResult.category,
        };
    }
    return result;
}
//# sourceMappingURL=calculateTemperature.js.map