import { describe, it, expect } from 'vitest';
import { Color } from '../domain/values/Color.js';
import { APCAService } from './APCAService.js';

describe('APCAService', () => {
  const service = new APCAService();

  describe('calculateAPCA', () => {
    it('black text on white background produces high positive Lc (normal polarity)', () => {
      const black = Color.fromHex('#000000');
      const white = Color.fromHex('#FFFFFF');
      const result = service.calculateAPCA(black, white);

      expect(result.Lc).toBeGreaterThan(100);
      expect(result.polarity).toBe('normal');
      expect(result.meetsMinimum.bodyText).toBe(true);
      expect(result.meetsMinimum.largeText).toBe(true);
      expect(result.meetsMinimum.nonText).toBe(true);
      expect(result.meetsMinimum.spotText).toBe(true);
    });

    it('white text on black background produces negative Lc (reverse polarity)', () => {
      const white = Color.fromHex('#FFFFFF');
      const black = Color.fromHex('#000000');
      const result = service.calculateAPCA(white, black);

      expect(result.Lc).toBeLessThan(0);
      expect(result.absLc).toBeGreaterThan(90);
      expect(result.polarity).toBe('reverse');
      expect(result.meetsMinimum.bodyText).toBe(true);
    });

    it('APCA is polarity-asymmetric: black-on-white differs from white-on-black', () => {
      const black = Color.fromHex('#000000');
      const white = Color.fromHex('#FFFFFF');
      const normal = service.calculateAPCA(black, white);
      const reverse = service.calculateAPCA(white, black);

      // APCA is intentionally asymmetric; the absolute values differ
      expect(normal.absLc).not.toBeCloseTo(reverse.absLc, 0);
    });

    it('same color produces Lc of 0', () => {
      const gray = Color.fromHex('#888888');
      const result = service.calculateAPCA(gray, gray);

      expect(result.Lc).toBe(0);
      expect(result.absLc).toBe(0);
      expect(result.interpretation).toBe('Not suitable for any visible content');
    });

    it('low contrast pair produces low Lc', () => {
      const lightGray = Color.fromHex('#CCCCCC');
      const white = Color.fromHex('#FFFFFF');
      const result = service.calculateAPCA(lightGray, white);

      expect(result.absLc).toBeLessThan(30);
      expect(result.meetsMinimum.bodyText).toBe(false);
      expect(result.meetsMinimum.largeText).toBe(false);
    });

    it('returns correct luminance values', () => {
      const black = Color.fromHex('#000000');
      const white = Color.fromHex('#FFFFFF');
      const result = service.calculateAPCA(black, white);

      // White should have luminance near 1.0, black near the soft-clamp floor
      expect(result.backgroundLuminance).toBeCloseTo(1.0, 2);
      expect(result.textLuminance).toBeLessThan(0.03);
    });

    it('mid-range contrast gives appropriate interpretation', () => {
      // #767676 on white is a classic mid-contrast pair
      const gray = Color.fromHex('#767676');
      const white = Color.fromHex('#FFFFFF');
      const result = service.calculateAPCA(gray, white);

      // Should have moderate Lc, passing at least some thresholds
      expect(result.absLc).toBeGreaterThan(45);
      expect(result.meetsMinimum.nonText).toBe(true);
    });

    it('handles non-sRGB input colors by converting first', () => {
      // Oklch color that represents roughly a mid-blue
      const oklchBlue = Color.create('oklch', [0.5, 0.15, 250]);
      const white = Color.fromHex('#FFFFFF');
      const result = service.calculateAPCA(oklchBlue, white);

      // Should produce a valid result without throwing
      expect(typeof result.Lc).toBe('number');
      expect(result.polarity).toBe('normal');
      expect(result.absLc).toBeGreaterThan(0);
    });
  });

  describe('interpretation thresholds', () => {
    it('black on white is "Preferred for body text" (Lc >= 90)', () => {
      const result = service.calculateAPCA(Color.fromHex('#000000'), Color.fromHex('#FFFFFF'));
      expect(result.interpretation).toBe('Preferred for body text');
    });

    it('very low contrast is "Not suitable for any visible content"', () => {
      const result = service.calculateAPCA(Color.fromHex('#F0F0F0'), Color.fromHex('#FFFFFF'));
      expect(result.interpretation).toBe('Not suitable for any visible content');
    });
  });

  describe('suggestTextColor', () => {
    it('suggests black text for white background', () => {
      const suggested = service.suggestTextColor(Color.fromHex('#FFFFFF'));
      expect(suggested.toHex()).toBe('#000000');
    });

    it('suggests white text for black background', () => {
      const suggested = service.suggestTextColor(Color.fromHex('#000000'));
      expect(suggested.toHex()).toBe('#ffffff');
    });

    it('suggests white text for dark blue background', () => {
      const darkBlue = Color.fromHex('#1A237E');
      const suggested = service.suggestTextColor(darkBlue);
      expect(suggested.toHex()).toBe('#ffffff');
    });

    it('suggests black text for light yellow background', () => {
      const lightYellow = Color.fromHex('#FFF9C4');
      const suggested = service.suggestTextColor(lightYellow);
      expect(suggested.toHex()).toBe('#000000');
    });

    it('accepts optional targetLc parameter without error', () => {
      const bg = Color.fromHex('#808080');
      const suggested = service.suggestTextColor(bg, 90);
      // Should return black or white without throwing
      const hex = suggested.toHex();
      expect(hex === '#000000' || hex === '#ffffff').toBe(true);
    });
  });

  describe('adjustForAPCA', () => {
    it('does not change color that already meets the target', () => {
      const black = Color.fromHex('#000000');
      const white = Color.fromHex('#FFFFFF');
      const adjusted = service.adjustForAPCA(black, white, 75);

      // Black on white already exceeds Lc 75; should return unchanged
      expect(adjusted.toHex()).toBe('#000000');
    });

    it('adjusts low-contrast text to meet body text threshold', () => {
      const lightGray = Color.fromHex('#AAAAAA');
      const white = Color.fromHex('#FFFFFF');

      const before = service.calculateAPCA(lightGray, white);
      expect(before.meetsMinimum.bodyText).toBe(false);

      const adjusted = service.adjustForAPCA(lightGray, white, 75);
      const after = service.calculateAPCA(adjusted, white);
      expect(after.absLc).toBeGreaterThanOrEqual(74); // allow small float tolerance
    });

    it('lightens text on dark background', () => {
      const darkGray = Color.fromHex('#555555');
      const black = Color.fromHex('#111111');

      const before = service.calculateAPCA(darkGray, black);
      const adjusted = service.adjustForAPCA(darkGray, black, 60);
      const after = service.calculateAPCA(adjusted, black);

      expect(after.absLc).toBeGreaterThan(before.absLc);
      expect(after.absLc).toBeGreaterThanOrEqual(59); // allow small float tolerance
    });

    it('darkens text on light background', () => {
      const lightGray = Color.fromHex('#CCCCCC');
      const white = Color.fromHex('#EEEEEE');

      const adjusted = service.adjustForAPCA(lightGray, white, 60);
      const after = service.calculateAPCA(adjusted, white);

      expect(after.absLc).toBeGreaterThanOrEqual(59);
    });

    it('preserves the original color space', () => {
      const oklchColor = Color.create('oklch', [0.7, 0.1, 200]);
      const white = Color.fromHex('#FFFFFF');

      const adjusted = service.adjustForAPCA(oklchColor, white, 75);
      expect(adjusted.space).toBe('oklch');
    });

    it('uses default targetLc of 75 when not specified', () => {
      const lightGray = Color.fromHex('#BBBBBB');
      const white = Color.fromHex('#FFFFFF');

      const adjusted = service.adjustForAPCA(lightGray, white);
      const after = service.calculateAPCA(adjusted, white);

      expect(after.absLc).toBeGreaterThanOrEqual(74);
    });
  });
});
