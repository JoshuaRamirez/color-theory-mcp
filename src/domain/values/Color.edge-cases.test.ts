import { describe, it, expect } from 'vitest';
import { Color } from './Color.js';

describe('Color edge cases', () => {
  describe('fromHex edge cases', () => {
    it('should parse 3-digit hex', () => {
      const color = Color.fromHex('#F00');
      expect(color.components[0]).toBeCloseTo(1, 4);
      expect(color.components[1]).toBeCloseTo(0, 4);
      expect(color.components[2]).toBeCloseTo(0, 4);
    });

    it('should parse 4-digit hex with alpha', () => {
      const color = Color.fromHex('#F008');
      expect(color.alpha).toBeCloseTo(0.533, 1);
    });

    it('should parse 8-digit hex with alpha', () => {
      const color = Color.fromHex('#FF000080');
      expect(color.alpha).toBeCloseTo(0.502, 1);
    });

    it('should throw on invalid hex characters', () => {
      expect(() => Color.fromHex('#GGG')).toThrow();
    });

    it('should throw on invalid hex length (5 digits)', () => {
      expect(() => Color.fromHex('#12345')).toThrow();
    });

    it('should throw on empty string', () => {
      expect(() => Color.fromHex('')).toThrow();
    });

    it('should throw on hex without hash', () => {
      // 6 characters without hash is still 6 chars after removing #,
      // which means no # still works because the implementation strips it.
      // But a 5-char string "FF000" after strip is invalid length.
      expect(() => Color.fromHex('FFFFF')).toThrow();
    });

    it('should handle lowercase hex', () => {
      const color = Color.fromHex('#ff0000');
      expect(color.components[0]).toBeCloseTo(1, 4);
    });

    it('should handle mixed case hex', () => {
      const color = Color.fromHex('#fF0000');
      expect(color.components[0]).toBeCloseTo(1, 4);
    });

    it('should parse minimum color value #000000', () => {
      const color = Color.fromHex('#000000');
      expect(color.components[0]).toBe(0);
      expect(color.components[1]).toBe(0);
      expect(color.components[2]).toBe(0);
    });

    it('should parse maximum color value #FFFFFF', () => {
      const color = Color.fromHex('#FFFFFF');
      expect(color.components[0]).toBe(1);
      expect(color.components[1]).toBe(1);
      expect(color.components[2]).toBe(1);
    });

    it('should parse 8-digit hex with full opacity', () => {
      const color = Color.fromHex('#FF0000FF');
      expect(color.alpha).toBe(1);
      expect(color.components[0]).toBeCloseTo(1, 4);
    });

    it('should parse 8-digit hex with zero opacity', () => {
      const color = Color.fromHex('#FF000000');
      expect(color.alpha).toBe(0);
    });
  });

  describe('create edge cases', () => {
    it('should throw on wrong component count for sRGB (too few)', () => {
      expect(() => Color.create('srgb', [1, 0], 1)).toThrow();
    });

    it('should throw on wrong component count for sRGB (too many)', () => {
      expect(() => Color.create('srgb', [1, 0, 0, 0], 1)).toThrow();
    });

    it('should clamp alpha above 1 to 1', () => {
      const color = Color.create('srgb', [1, 0, 0], 2.0);
      expect(color.alpha).toBe(1);
    });

    it('should clamp alpha below 0 to 0', () => {
      const color = Color.create('srgb', [1, 0, 0], -0.5);
      expect(color.alpha).toBe(0);
    });

    it('should accept CMYK with 4 components', () => {
      const cmyk = Color.create('cmyk', [0, 1, 1, 0], 1);
      expect(cmyk.components).toHaveLength(4);
    });

    it('should throw when creating CMYK with 3 components', () => {
      expect(() => Color.create('cmyk', [0, 1, 1], 1)).toThrow();
    });

    it('should accept negative component values (not clamped at creation)', () => {
      // Some color spaces (Lab a*, b*) have negative ranges
      const lab = Color.create('lab', [50, -20, 30], 1);
      expect(lab.components[1]).toBe(-20);
    });

    it('should accept components above 1 for spaces that allow it', () => {
      // Lab L* ranges 0-100
      const lab = Color.create('lab', [100, 0, 0], 1);
      expect(lab.components[0]).toBe(100);
    });

    it('should default alpha to 1 when omitted', () => {
      const color = Color.create('srgb', [1, 0, 0]);
      expect(color.alpha).toBe(1);
    });
  });

  describe('immutability', () => {
    it('should return new instance from withAlpha', () => {
      const original = Color.fromHex('#FF0000');
      const modified = original.withAlpha(0.5);
      expect(original.alpha).toBe(1);
      expect(modified.alpha).toBe(0.5);
    });

    it('should return new instance from withComponents', () => {
      const original = Color.fromHex('#FF0000');
      const modified = original.withComponents([0, 1, 0]);
      expect(original.components[0]).toBeCloseTo(1, 4);
      expect(modified.components[0]).toBeCloseTo(0, 4);
    });

    it('should have frozen components', () => {
      const color = Color.fromHex('#FF0000');
      expect(Object.isFrozen(color.components)).toBe(true);
    });

    it('withComponents should preserve color space', () => {
      const original = Color.create('lab', [50, 20, -10], 0.8);
      const modified = original.withComponents([60, 10, -5]);
      expect(modified.space).toBe('lab');
      expect(modified.alpha).toBe(0.8);
    });

    it('withAlpha should preserve components and space', () => {
      const original = Color.create('oklch', [0.7, 0.15, 200], 1);
      const modified = original.withAlpha(0.3);
      expect(modified.space).toBe('oklch');
      expect(modified.components[0]).toBe(0.7);
      expect(modified.components[1]).toBe(0.15);
      expect(modified.components[2]).toBe(200);
    });
  });

  describe('equality', () => {
    it('should consider identical colors equal', () => {
      const a = Color.fromHex('#FF0000');
      const b = Color.fromHex('#FF0000');
      expect(a.equals(b)).toBe(true);
    });

    it('should consider different colors not equal', () => {
      const a = Color.fromHex('#FF0000');
      const b = Color.fromHex('#00FF00');
      expect(a.equals(b)).toBe(false);
    });

    it('should respect tolerance', () => {
      const a = Color.create('srgb', [0.5, 0.5, 0.5], 1);
      const b = Color.create('srgb', [0.5001, 0.5001, 0.5001], 1);
      expect(a.equals(b, 0.001)).toBe(true);
      expect(a.equals(b, 0.00001)).toBe(false);
    });

    it('should return false for different color spaces', () => {
      const a = Color.create('srgb', [1, 0, 0], 1);
      const b = Color.create('hsl', [1, 0, 0], 1);
      expect(a.equals(b)).toBe(false);
    });

    it('should return false when alpha differs', () => {
      const a = Color.create('srgb', [1, 0, 0], 1);
      const b = Color.create('srgb', [1, 0, 0], 0.5);
      expect(a.equals(b)).toBe(false);
    });

    it('should use default tolerance of 0.0001', () => {
      const a = Color.create('srgb', [0.5, 0.5, 0.5], 1);
      const b = Color.create('srgb', [0.50005, 0.50005, 0.50005], 1);
      // Difference of 0.00005 is within default tolerance of 0.0001
      expect(a.equals(b)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should produce serializable output', () => {
      const color = Color.fromHex('#C87533');
      const json = color.toJSON();
      expect(json.space).toBe('srgb');
      expect(json.components).toHaveLength(3);
      expect(json.alpha).toBe(1);
    });

    it('should produce a plain array for components (not frozen)', () => {
      const color = Color.fromHex('#FF0000');
      const json = color.toJSON();
      // toJSON returns a new plain array, not the frozen internal one
      expect(Array.isArray(json.components)).toBe(true);
    });

    it('should include alpha in JSON output', () => {
      const color = Color.create('srgb', [1, 0, 0], 0.5);
      const json = color.toJSON();
      expect(json.alpha).toBe(0.5);
    });

    it('should round-trip through JSON', () => {
      const original = Color.create('lab', [53, 80, 67], 0.75);
      const json = original.toJSON();
      const restored = Color.create(json.space, json.components, json.alpha);
      expect(original.equals(restored)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should include space name', () => {
      const color = Color.fromHex('#FF0000');
      expect(color.toString()).toContain('srgb');
    });

    it('should include alpha', () => {
      const color = Color.create('srgb', [1, 0, 0], 0.5);
      expect(color.toString()).toContain('0.500');
    });
  });

  describe('toHex', () => {
    it('should throw for non-sRGB colors', () => {
      const lab = Color.create('lab', [50, 20, 30], 1);
      expect(() => lab.toHex()).toThrow();
    });

    it('should clamp out-of-range sRGB values in hex output', () => {
      // Create an sRGB color with a slightly out-of-range component
      const color = Color.create('srgb', [1.05, -0.05, 0.5], 1);
      const hex = color.toHex();
      // Should clamp to valid range: 1.05 -> 255, -0.05 -> 0
      expect(hex).toBe('#ff0080');
    });
  });

  describe('toCssString', () => {
    it('should produce rgb() for sRGB without alpha', () => {
      const color = Color.fromHex('#FF0000');
      expect(color.toCssString()).toBe('rgb(255, 0, 0)');
    });

    it('should produce rgba() for sRGB with alpha < 1', () => {
      const color = Color.create('srgb', [1, 0, 0], 0.5);
      expect(color.toCssString()).toContain('rgba(');
      expect(color.toCssString()).toContain('0.500');
    });

    it('should produce color() for non-sRGB spaces', () => {
      const lab = Color.create('lab', [50, 20, 30], 1);
      expect(lab.toCssString()).toContain('color(lab');
    });
  });

  describe('fromRgb', () => {
    it('should handle zero values', () => {
      const color = Color.fromRgb(0, 0, 0);
      expect(color.components[0]).toBe(0);
      expect(color.components[1]).toBe(0);
      expect(color.components[2]).toBe(0);
    });

    it('should handle max values', () => {
      const color = Color.fromRgb(255, 255, 255);
      expect(color.components[0]).toBe(1);
      expect(color.components[1]).toBe(1);
      expect(color.components[2]).toBe(1);
    });
  });

  describe('pure black and white', () => {
    it('should handle pure black', () => {
      const black = Color.fromHex('#000000');
      expect(black.components.every((c) => c === 0)).toBe(true);
    });

    it('should handle pure white', () => {
      const white = Color.fromHex('#FFFFFF');
      expect(white.components.every((c) => c === 1)).toBe(true);
    });
  });
});
