import { describe, it, expect } from 'vitest';
import { Color } from '../../domain/values/Color.js';
import { ConversionService } from '../../services/ConversionService.js';
import { PaletteService } from '../../services/PaletteService.js';
import { HarmonyRegistry } from './HarmonyRegistry.js';

describe('Harmony Algorithms', () => {
  const registry = HarmonyRegistry.createDefault();
  const conversionService = new ConversionService();
  const paletteService = new PaletteService();

  describe('ComplementaryHarmony', () => {
    it('generates two colors 180° apart', () => {
      const base = Color.fromHex('#FF0000'); // Red
      const algorithm = registry.get('complementary');
      const palette = algorithm!.generate(base);

      expect(palette.length).toBe(2);

      const hues = palette.colors.map(c => {
        const oklch = conversionService.convert(c, 'oklch');
        return oklch.components[2]!;
      });

      // Difference should be ~180°
      let diff = Math.abs(hues[0]! - hues[1]!);
      if (diff > 180) diff = 360 - diff;
      expect(diff).toBeCloseTo(180, 0);
    });
  });

  describe('TriadicHarmony', () => {
    it('generates three colors 120° apart', () => {
      const base = Color.fromHex('#FF0000');
      const algorithm = registry.get('triadic');
      const palette = algorithm!.generate(base);

      expect(palette.length).toBe(3);

      const hues = palette.colors.map(c => {
        const oklch = conversionService.convert(c, 'oklch');
        return oklch.components[2]!;
      }).sort((a, b) => a - b);

      // Consecutive hues should be ~120° apart
      const diff1 = hues[1]! - hues[0]!;
      const diff2 = hues[2]! - hues[1]!;

      expect(diff1).toBeCloseTo(120, 0);
      expect(diff2).toBeCloseTo(120, 0);
    });
  });

  describe('MonochromaticHarmony', () => {
    it('generates colors with same hue', () => {
      const base = Color.fromHex('#FF5733');
      const algorithm = registry.get('monochromatic');
      const palette = algorithm!.generate(base, { count: 5 });

      expect(palette.length).toBe(5);

      const hues = palette.colors.map(c => {
        const oklch = conversionService.convert(c, 'oklch');
        return oklch.components[2]!;
      });

      // All hues should be the same
      const baseHue = hues[0]!;
      for (const hue of hues) {
        // Allow small tolerance for achromatic colors
        if (Math.abs(hue - baseHue) > 1) {
          expect(hue).toBeCloseTo(baseHue, 0);
        }
      }
    });

    it('varies lightness', () => {
      const base = Color.fromHex('#FF5733');
      const algorithm = registry.get('monochromatic');
      const palette = algorithm!.generate(base, { count: 5 });

      const lightnesses = palette.colors.map(c => {
        const oklch = conversionService.convert(c, 'oklch');
        return oklch.components[0]!;
      });

      // Should have varying lightness
      const min = Math.min(...lightnesses);
      const max = Math.max(...lightnesses);
      expect(max - min).toBeGreaterThan(0.3);
    });
  });

  describe('PaletteService.generateScale', () => {
    it('generates 11 steps by default', () => {
      const base = Color.fromHex('#FF5733');
      const scale = paletteService.generateScale(base);
      expect(scale.steps.size).toBe(11);
    });

    it('50 is lightest, 950 is darkest', () => {
      const base = Color.fromHex('#FF5733');
      const scale = paletteService.generateScale(base);

      const color50 = scale.steps.get(50);
      const color950 = scale.steps.get(950);

      const l50 = conversionService.convert(color50!, 'oklch').components[0];
      const l950 = conversionService.convert(color950!, 'oklch').components[0];

      expect(l50).toBeGreaterThan(l950!);
    });
  });
});
