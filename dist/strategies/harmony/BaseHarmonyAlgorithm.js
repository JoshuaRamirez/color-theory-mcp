import { Color } from '../../domain/values/Color.js';
import { Palette } from '../../domain/values/Palette.js';
import { ConversionService } from '../../services/ConversionService.js';
const conversionService = new ConversionService();
/**
 * Base class for harmony algorithms using hue rotation.
 * Uses Oklch for perceptually uniform color manipulation.
 */
export class BaseHarmonyAlgorithm {
    generate(baseColor, options) {
        const includeBase = options?.includeBase ?? true;
        // Convert to Oklch for hue manipulation
        const oklchColor = conversionService.convert(baseColor, 'oklch');
        const [L, C, H] = oklchColor.components;
        // Generate colors at each angle
        const colors = [];
        if (includeBase) {
            colors.push(baseColor);
        }
        for (const angle of this.angles) {
            if (angle === 0 && includeBase)
                continue; // Skip base color if already included
            const newHue = ((H + angle) % 360 + 360) % 360;
            const newOklch = Color.create('oklch', [L, C, newHue], baseColor.alpha);
            const converted = conversionService.convert(newOklch, baseColor.space);
            colors.push(converted);
        }
        return Palette.create(colors, this.type, {
            algorithm: this.type,
            baseColor: baseColor.toJSON(),
        });
    }
}
//# sourceMappingURL=BaseHarmonyAlgorithm.js.map