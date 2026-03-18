import { Color } from '../../domain/values/Color.js';
import { Palette } from '../../domain/values/Palette.js';
import { ConversionService } from '../../services/ConversionService.js';
import { BaseHarmonyAlgorithm } from './BaseHarmonyAlgorithm.js';
const conversionService = new ConversionService();
/**
 * Complementary harmony - colors opposite on the color wheel.
 * Creates maximum contrast.
 */
export class ComplementaryHarmony extends BaseHarmonyAlgorithm {
    type = 'complementary';
    description = 'Two colors opposite on the color wheel (180° apart)';
    angles = [0, 180];
}
/**
 * Analogous harmony - colors adjacent on the color wheel.
 * Creates visual comfort and unity.
 */
export class AnalogousHarmony extends BaseHarmonyAlgorithm {
    type = 'analogous';
    description = 'Three colors adjacent on the color wheel (±30°)';
    angles = [-30, 0, 30];
    generate(baseColor, options) {
        const angleSpread = options?.angleSpread ?? 30;
        const includeBase = options?.includeBase ?? true;
        const oklchColor = conversionService.convert(baseColor, 'oklch');
        const [L, C, H] = oklchColor.components;
        const colors = [];
        // Left color
        const leftHue = ((H - angleSpread) % 360 + 360) % 360;
        const leftOklch = Color.create('oklch', [L, C, leftHue], baseColor.alpha);
        colors.push(conversionService.convert(leftOklch, baseColor.space));
        // Center color (base)
        if (includeBase) {
            colors.push(baseColor);
        }
        // Right color
        const rightHue = ((H + angleSpread) % 360 + 360) % 360;
        const rightOklch = Color.create('oklch', [L, C, rightHue], baseColor.alpha);
        colors.push(conversionService.convert(rightOklch, baseColor.space));
        return Palette.create(colors, this.type, {
            algorithm: this.type,
            baseColor: baseColor.toJSON(),
            angleSpread,
        });
    }
}
/**
 * Triadic harmony - three colors equally spaced on the color wheel.
 * Creates vibrant contrast while maintaining balance.
 */
export class TriadicHarmony extends BaseHarmonyAlgorithm {
    type = 'triadic';
    description = 'Three colors equally spaced on the color wheel (120° apart)';
    angles = [0, 120, 240];
}
/**
 * Split-complementary harmony - base color plus two colors adjacent to its complement.
 * High contrast but less tension than complementary.
 */
export class SplitComplementaryHarmony extends BaseHarmonyAlgorithm {
    type = 'split-complementary';
    description = 'Base color plus two colors adjacent to its complement (150° and 210°)';
    angles = [0, 150, 210];
}
/**
 * Tetradic (rectangular) harmony - four colors forming a rectangle on the color wheel.
 * Rich color scheme with multiple complementary pairs.
 */
export class TetradicHarmony extends BaseHarmonyAlgorithm {
    type = 'tetradic';
    description = 'Four colors forming a rectangle on the color wheel';
    angles = [0, 60, 180, 240];
}
/**
 * Square harmony - four colors equally spaced on the color wheel.
 * Balanced scheme with strong contrast.
 */
export class SquareHarmony extends BaseHarmonyAlgorithm {
    type = 'square';
    description = 'Four colors equally spaced on the color wheel (90° apart)';
    angles = [0, 90, 180, 270];
}
/**
 * Monochromatic harmony - variations of a single hue.
 * Creates unity through lightness and saturation variations.
 */
export class MonochromaticHarmony extends BaseHarmonyAlgorithm {
    type = 'monochromatic';
    description = 'Variations of a single hue with different lightness and saturation';
    angles = [0];
    generate(baseColor, options) {
        const count = options?.count ?? 5;
        const lightnessSteps = options?.lightnessSteps ?? this.generateLightnessSteps(count);
        const saturationSteps = options?.saturationSteps;
        const oklchColor = conversionService.convert(baseColor, 'oklch');
        const [, C, H] = oklchColor.components;
        const colors = lightnessSteps.map((lStep, i) => {
            const newL = Math.max(0, Math.min(1, lStep));
            const newC = saturationSteps?.[i] !== undefined
                ? Math.max(0, Math.min(0.4, saturationSteps[i]))
                : C;
            const newOklch = Color.create('oklch', [newL, newC, H], baseColor.alpha);
            return conversionService.convert(newOklch, baseColor.space);
        });
        return Palette.create(colors, this.type, {
            algorithm: this.type,
            baseColor: baseColor.toJSON(),
            lightnessSteps,
            saturationSteps,
        });
    }
    generateLightnessSteps(count) {
        // Generate evenly distributed lightness values
        const steps = [];
        for (let i = 0; i < count; i++) {
            steps.push(0.15 + (0.7 * i) / (count - 1));
        }
        return steps;
    }
}
//# sourceMappingURL=HarmonyAlgorithms.js.map