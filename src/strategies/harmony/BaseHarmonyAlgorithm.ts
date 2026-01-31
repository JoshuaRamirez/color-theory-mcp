import type { IHarmonyAlgorithm, HarmonyType, HarmonyOptions } from '../../domain/interfaces/IHarmonyAlgorithm.js';
import { Color } from '../../domain/values/Color.js';
import { Palette } from '../../domain/values/Palette.js';
import { ConversionService } from '../../services/ConversionService.js';

const conversionService = new ConversionService();

/**
 * Base class for harmony algorithms using hue rotation.
 * Uses Oklch for perceptually uniform color manipulation.
 */
export abstract class BaseHarmonyAlgorithm implements IHarmonyAlgorithm {
  abstract readonly type: HarmonyType;
  abstract readonly description: string;
  abstract readonly angles: readonly number[];

  generate(baseColor: Color, options?: HarmonyOptions): Palette {
    const includeBase = options?.includeBase ?? true;

    // Convert to Oklch for hue manipulation
    const oklchColor = conversionService.convert(baseColor, 'oklch');
    const [L, C, H] = oklchColor.components as [number, number, number];

    // Generate colors at each angle
    const colors: Color[] = [];

    if (includeBase) {
      colors.push(baseColor);
    }

    for (const angle of this.angles) {
      if (angle === 0 && includeBase) continue; // Skip base color if already included

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
