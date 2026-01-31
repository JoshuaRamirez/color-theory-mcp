import { describe, it, expect } from 'vitest';
import { Color } from '../domain/values/Color.js';
import { ContrastService } from './ContrastService.js';

describe('ContrastService', () => {
  const service = new ContrastService();

  describe('calculateLuminance', () => {
    it('white has luminance 1', () => {
      const white = Color.fromHex('#FFFFFF');
      expect(service.calculateLuminance(white)).toBeCloseTo(1, 2);
    });

    it('black has luminance 0', () => {
      const black = Color.fromHex('#000000');
      expect(service.calculateLuminance(black)).toBeCloseTo(0, 2);
    });

    it('mid-gray has expected luminance', () => {
      // #808080 should have luminance around 0.21
      const gray = Color.fromHex('#808080');
      const lum = service.calculateLuminance(gray);
      expect(lum).toBeGreaterThan(0.15);
      expect(lum).toBeLessThan(0.25);
    });
  });

  describe('calculateContrastRatio', () => {
    it('white on black is 21:1', () => {
      const white = Color.fromHex('#FFFFFF');
      const black = Color.fromHex('#000000');
      expect(service.calculateContrastRatio(white, black)).toBeCloseTo(21, 0);
    });

    it('same color is 1:1', () => {
      const color = Color.fromHex('#FF5733');
      expect(service.calculateContrastRatio(color, color)).toBeCloseTo(1, 2);
    });

    it('order of colors does not matter', () => {
      const color1 = Color.fromHex('#FF5733');
      const color2 = Color.fromHex('#FFFFFF');
      const ratio1 = service.calculateContrastRatio(color1, color2);
      const ratio2 = service.calculateContrastRatio(color2, color1);
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });
  });

  describe('checkContrast', () => {
    it('white on black passes all levels', () => {
      const white = Color.fromHex('#FFFFFF');
      const black = Color.fromHex('#000000');
      const result = service.checkContrast(white, black);

      expect(result.passes.AA.normal).toBe(true);
      expect(result.passes.AA.large).toBe(true);
      expect(result.passes.AAA.normal).toBe(true);
      expect(result.passes.AAA.large).toBe(true);
    });

    it('light gray on white fails AA', () => {
      const lightGray = Color.fromHex('#CCCCCC');
      const white = Color.fromHex('#FFFFFF');
      const result = service.checkContrast(lightGray, white);

      expect(result.passes.AA.normal).toBe(false);
    });
  });

  describe('meetsWCAG', () => {
    it('validates AA normal text correctly', () => {
      // 4.5:1 contrast needed
      const white = Color.fromHex('#FFFFFF');
      const gray = Color.fromHex('#767676'); // Just passes AA
      expect(service.meetsWCAG(gray, white, 'AA', 'normal')).toBe(true);
    });

    it('validates AA large text correctly', () => {
      // 3:1 contrast needed
      const white = Color.fromHex('#FFFFFF');
      const gray = Color.fromHex('#949494'); // Passes AA large but not normal
      expect(service.meetsWCAG(gray, white, 'AA', 'large')).toBe(true);
      expect(service.meetsWCAG(gray, white, 'AA', 'normal')).toBe(false);
    });
  });

  describe('suggestForeground', () => {
    it('suggests white for dark backgrounds', () => {
      const dark = Color.fromHex('#333333');
      const suggested = service.suggestForeground(dark);
      expect(suggested.toHex()).toBe('#ffffff');
    });

    it('suggests black for light backgrounds', () => {
      const light = Color.fromHex('#FFFFFF');
      const suggested = service.suggestForeground(light);
      expect(suggested.toHex()).toBe('#000000');
    });
  });

  describe('adjustForContrast', () => {
    it('does not change color that already passes', () => {
      const white = Color.fromHex('#FFFFFF');
      const black = Color.fromHex('#000000');
      const adjusted = service.adjustForContrast(black, white);
      expect(adjusted.toHex()).toBe('#000000');
    });

    it('lightens color on dark background to meet contrast', () => {
      const dark = Color.fromHex('#222222');
      const badFg = Color.fromHex('#444444');
      const adjusted = service.adjustForContrast(badFg, dark);

      // Should now pass or at least improve significantly
      const originalRatio = service.calculateContrastRatio(badFg, dark);
      const adjustedRatio = service.calculateContrastRatio(adjusted, dark);
      expect(adjustedRatio).toBeGreaterThan(originalRatio);
    });
  });
});
