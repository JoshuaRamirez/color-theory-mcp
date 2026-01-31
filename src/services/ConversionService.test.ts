import { describe, it, expect } from 'vitest';
import { Color } from '../domain/values/Color.js';
import { ConversionService } from './ConversionService.js';

describe('ConversionService', () => {
  const service = new ConversionService();

  describe('sRGB to Lab round-trip', () => {
    it('preserves white', () => {
      const white = Color.fromHex('#FFFFFF');
      const lab = service.convert(white, 'lab');
      const back = service.convert(lab, 'srgb');

      expect(back.components[0]).toBeCloseTo(1, 2);
      expect(back.components[1]).toBeCloseTo(1, 2);
      expect(back.components[2]).toBeCloseTo(1, 2);
    });

    it('preserves black', () => {
      const black = Color.fromHex('#000000');
      const lab = service.convert(black, 'lab');
      const back = service.convert(lab, 'srgb');

      expect(back.components[0]).toBeCloseTo(0, 2);
      expect(back.components[1]).toBeCloseTo(0, 2);
      expect(back.components[2]).toBeCloseTo(0, 2);
    });

    it('preserves red', () => {
      const red = Color.fromHex('#FF0000');
      const lab = service.convert(red, 'lab');
      const back = service.convert(lab, 'srgb');

      expect(back.components[0]).toBeCloseTo(1, 2);
      expect(back.components[1]).toBeCloseTo(0, 2);
      expect(back.components[2]).toBeCloseTo(0, 2);
    });

    it('preserves arbitrary color', () => {
      const color = Color.fromHex('#FF5733');
      const lab = service.convert(color, 'lab');
      const back = service.convert(lab, 'srgb');

      expect(back.components[0]).toBeCloseTo(color.components[0]!, 2);
      expect(back.components[1]).toBeCloseTo(color.components[1]!, 2);
      expect(back.components[2]).toBeCloseTo(color.components[2]!, 2);
    });
  });

  describe('sRGB to Oklch round-trip', () => {
    it('preserves colors', () => {
      const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFFF00', '#FF00FF'];

      for (const hex of colors) {
        const original = Color.fromHex(hex);
        const oklch = service.convert(original, 'oklch');
        const back = service.convert(oklch, 'srgb');

        expect(back.components[0]).toBeCloseTo(original.components[0]!, 2);
        expect(back.components[1]).toBeCloseTo(original.components[1]!, 2);
        expect(back.components[2]).toBeCloseTo(original.components[2]!, 2);
      }
    });
  });

  describe('Lab values', () => {
    it('white has L=100', () => {
      const white = Color.fromHex('#FFFFFF');
      const lab = service.convert(white, 'lab');
      expect(lab.components[0]).toBeCloseTo(100, 0);
    });

    it('black has L=0', () => {
      const black = Color.fromHex('#000000');
      const lab = service.convert(black, 'lab');
      expect(lab.components[0]).toBeCloseTo(0, 0);
    });
  });

  describe('HSL conversion', () => {
    it('red has hue=0', () => {
      const red = Color.fromHex('#FF0000');
      const hsl = service.convert(red, 'hsl');
      expect(hsl.components[0]).toBeCloseTo(0, 0);
      expect(hsl.components[1]).toBeCloseTo(1, 2);
      expect(hsl.components[2]).toBeCloseTo(0.5, 2);
    });

    it('green has hue=120', () => {
      const green = Color.fromHex('#00FF00');
      const hsl = service.convert(green, 'hsl');
      expect(hsl.components[0]).toBeCloseTo(120, 0);
    });

    it('blue has hue=240', () => {
      const blue = Color.fromHex('#0000FF');
      const hsl = service.convert(blue, 'hsl');
      expect(hsl.components[0]).toBeCloseTo(240, 0);
    });
  });

  describe('CMYK conversion', () => {
    it('pure cyan', () => {
      const cyan = Color.fromHex('#00FFFF');
      const cmyk = service.convert(cyan, 'cmyk');
      expect(cmyk.components[0]).toBeCloseTo(1, 2); // C
      expect(cmyk.components[1]).toBeCloseTo(0, 2); // M
      expect(cmyk.components[2]).toBeCloseTo(0, 2); // Y
      expect(cmyk.components[3]).toBeCloseTo(0, 2); // K
    });

    it('black has K=1', () => {
      const black = Color.fromHex('#000000');
      const cmyk = service.convert(black, 'cmyk');
      expect(cmyk.components[3]).toBeCloseTo(1, 2);
    });
  });

  describe('alpha preservation', () => {
    it('preserves alpha through conversions', () => {
      const color = Color.fromHex('#FF573380');
      const lab = service.convert(color, 'lab');
      const oklch = service.convert(lab, 'oklch');
      const back = service.convert(oklch, 'srgb');

      expect(back.alpha).toBeCloseTo(color.alpha, 2);
    });
  });
});
