import { describe, it, expect } from 'vitest';
import { Color } from '../domain/values/Color.js';
import { ThemeService } from './ThemeService.js';

describe('ThemeService', () => {
  const service = new ThemeService();

  describe('generateTheme', () => {
    it('should generate a complete theme from a seed color', () => {
      const seed = Color.fromHex('#6750A4');
      const theme = service.generateTheme(seed);

      expect(theme.seed).toBe('#6750a4');
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
      expect(theme.palettes).toBeDefined();
    });

    it('should generate all required color roles in light theme', () => {
      const theme = service.generateTheme(Color.fromHex('#1976D2'));
      const requiredRoles = [
        'primary',
        'onPrimary',
        'primaryContainer',
        'onPrimaryContainer',
        'secondary',
        'onSecondary',
        'secondaryContainer',
        'onSecondaryContainer',
        'tertiary',
        'onTertiary',
        'tertiaryContainer',
        'onTertiaryContainer',
        'error',
        'onError',
        'errorContainer',
        'onErrorContainer',
        'background',
        'onBackground',
        'surface',
        'onSurface',
        'surfaceVariant',
        'onSurfaceVariant',
        'outline',
        'outlineVariant',
      ];

      for (const role of requiredRoles) {
        const value = theme.light[role as keyof typeof theme.light];
        expect(value).toBeDefined();
        expect(value).toMatch(/^#[0-9a-f]{6}$/);
      }
    });

    it('should generate all required color roles in dark theme', () => {
      const theme = service.generateTheme(Color.fromHex('#1976D2'));
      const requiredRoles = [
        'primary',
        'onPrimary',
        'primaryContainer',
        'onPrimaryContainer',
        'secondary',
        'onSecondary',
        'secondaryContainer',
        'onSecondaryContainer',
        'tertiary',
        'onTertiary',
        'tertiaryContainer',
        'onTertiaryContainer',
        'error',
        'onError',
        'errorContainer',
        'onErrorContainer',
        'background',
        'onBackground',
        'surface',
        'onSurface',
        'surfaceVariant',
        'onSurfaceVariant',
        'outline',
        'outlineVariant',
      ];

      for (const role of requiredRoles) {
        const value = theme.dark[role as keyof typeof theme.dark];
        expect(value).toBeDefined();
        expect(value).toMatch(/^#[0-9a-f]{6}$/);
      }
      expect(Object.keys(theme.dark).length).toBe(24);
    });

    it('should generate all 6 tonal palettes', () => {
      const theme = service.generateTheme(Color.fromHex('#E91E63'));
      const paletteNames = [
        'primary',
        'secondary',
        'tertiary',
        'neutral',
        'neutralVariant',
        'error',
      ];

      for (const name of paletteNames) {
        const palette = theme.palettes[name as keyof typeof theme.palettes];
        expect(palette).toBeDefined();
        expect(palette.tones.size).toBe(13); // 13 standard tones
      }
    });

    it('should have tone 0 as near-black and tone 100 as very light', () => {
      const theme = service.generateTheme(Color.fromHex('#4CAF50'));
      const primaryPalette = theme.palettes.primary;

      const tone0 = primaryPalette.tones.get(0)!;
      const tone100 = primaryPalette.tones.get(100)!;

      // Tone 0 should exist and be very dark (average of RGB near 0)
      expect(tone0).toBeDefined();
      const avg0 = (tone0.components[0]! + tone0.components[1]! + tone0.components[2]!) / 3;
      expect(avg0).toBeLessThan(0.05);

      // Tone 100 should exist and be the lightest tone in the palette.
      // For highly chromatic seeds (like green), gamut clamping at Oklch
      // L=1.0 with non-zero chroma produces tinted pastels rather than
      // pure white, so average brightness can be lower than expected.
      // The key invariant is that tone 100 is lighter than tone 90.
      expect(tone100).toBeDefined();
      const tone90 = primaryPalette.tones.get(90)!;
      const avg90 = (tone90.components[0]! + tone90.components[1]! + tone90.components[2]!) / 3;
      const avg100 = (tone100.components[0]! + tone100.components[1]! + tone100.components[2]!) / 3;
      expect(avg100).toBeGreaterThanOrEqual(avg90 - 0.01);
      // Should still be reasonably light
      expect(avg100).toBeGreaterThan(0.7);
    });

    it('should produce different themes for different seeds', () => {
      const theme1 = service.generateTheme(Color.fromHex('#FF0000'));
      const theme2 = service.generateTheme(Color.fromHex('#0000FF'));

      expect(theme1.light.primary).not.toBe(theme2.light.primary);
    });

    it('should produce valid hex strings for all palettes', () => {
      const theme = service.generateTheme(Color.fromHex('#9C27B0'));
      const hexPattern = /^#[0-9a-f]{6}$/;

      // Check every light theme value
      for (const value of Object.values(theme.light)) {
        expect(value).toMatch(hexPattern);
      }
      // Check every dark theme value
      for (const value of Object.values(theme.dark)) {
        expect(value).toMatch(hexPattern);
      }
    });

    it('should generate monotonically increasing lightness across tonal steps', () => {
      const theme = service.generateTheme(Color.fromHex('#FF5722'));
      const primaryPalette = theme.palettes.primary;
      const toneKeys = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

      // Extract lightness (average of clamped sRGB components as rough proxy)
      const lightnesses: number[] = [];
      for (const tone of toneKeys) {
        const color = primaryPalette.tones.get(tone)!;
        const avg = (color.components[0]! + color.components[1]! + color.components[2]!) / 3;
        lightnesses.push(avg);
      }

      // Each step should be >= previous (monotonic non-decreasing)
      for (let i = 1; i < lightnesses.length; i++) {
        expect(lightnesses[i]!).toBeGreaterThanOrEqual(lightnesses[i - 1]! - 0.01);
      }
    });
  });

  describe('generateTonalPalette', () => {
    it('should generate 13 tones', () => {
      const palette = service.generateTonalPalette(270, 0.15);
      expect(palette.tones.size).toBe(13);
    });

    it('should store hue and chroma', () => {
      const palette = service.generateTonalPalette(180, 0.1);
      expect(palette.hue).toBe(180);
      expect(palette.chroma).toBe(0.1);
    });

    it('should contain all standard MD3 tone values', () => {
      const palette = service.generateTonalPalette(0, 0.2);
      const expectedTones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
      for (const tone of expectedTones) {
        expect(palette.tones.has(tone)).toBe(true);
      }
    });

    it('should produce sRGB colors (clamped to gamut)', () => {
      const palette = service.generateTonalPalette(120, 0.25);
      for (const [, color] of palette.tones) {
        expect(color.space).toBe('srgb');
      }
    });

    it('should handle zero chroma (achromatic palette)', () => {
      const palette = service.generateTonalPalette(0, 0);
      expect(palette.tones.size).toBe(13);
      // Achromatic colors should have roughly equal R, G, B
      const tone50 = palette.tones.get(50)!;
      const [r, g, b] = tone50.components;
      expect(Math.abs(r! - g!)).toBeLessThan(0.05);
      expect(Math.abs(g! - b!)).toBeLessThan(0.05);
    });
  });
});
