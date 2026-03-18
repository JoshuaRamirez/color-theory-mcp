import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ColorSpaceSchema } from '../schemas.js';
import { ConversionService } from '../../../services/ConversionService.js';
const conversionService = new ConversionService();
export const convertBatchSchema = z.object({
    colors: z.array(z.string()).describe('Array of color values to convert'),
    targetSpace: ColorSpaceSchema.describe('Target color space for all conversions'),
});
export async function convertBatch(input) {
    const results = input.colors.map((colorStr, index) => {
        try {
            const color = parseColor(colorStr);
            const converted = conversionService.convert(color, input.targetSpace);
            // Get hex if possible
            let hex;
            try {
                const srgb = conversionService.convert(converted, 'srgb');
                hex = srgb.toHex();
            }
            catch {
                // Out of gamut
            }
            return {
                index,
                input: colorStr,
                components: converted.components.map(c => Math.round(c * 10000) / 10000),
                alpha: converted.alpha,
                hex,
                success: true,
            };
        }
        catch (error) {
            return {
                index,
                input: colorStr,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    });
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    return {
        targetSpace: input.targetSpace,
        total: input.colors.length,
        successful,
        failed,
        results,
    };
}
//# sourceMappingURL=convertBatch.js.map