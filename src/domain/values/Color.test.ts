import { describe, it, expect } from 'vitest';
import { Color } from './Color.js';

describe('Color', () => {
  describe('fromHex', () => {
    it('parses 6-digit hex correctly', () => {
      const color = Color.fromHex('#FF5733');
      expect(color.space).toBe('srgb');
      expect(color.components[0]).toBeCloseTo(1, 2);
      expect(color.components[1]).toBeCloseTo(0.341, 2);
      expect(color.components[2]).toBeCloseTo(0.2, 2);
      expect(color.alpha).toBe(1);
    });

    it('parses 3-digit hex correctly', () => {
      const color = Color.fromHex('#F00');
      expect(color.components[0]).toBeCloseTo(1, 2);
      expect(color.components[1]).toBeCloseTo(0, 2);
      expect(color.components[2]).toBeCloseTo(0, 2);
    });

    it('parses 8-digit hex with alpha', () => {
      const color = Color.fromHex('#FF573380');
      expect(color.alpha).toBeCloseTo(0.5, 1);
    });

    it('handles lowercase hex', () => {
      const color = Color.fromHex('#ff5733');
      expect(color.toHex()).toBe('#ff5733');
    });

    it('throws on invalid hex', () => {
      expect(() => Color.fromHex('#GGG')).toThrow();
      expect(() => Color.fromHex('#12345')).toThrow();
    });
  });

  describe('fromRgb', () => {
    it('creates color from RGB values', () => {
      const color = Color.fromRgb(255, 87, 51);
      expect(color.components[0]).toBeCloseTo(1, 2);
      expect(color.components[1]).toBeCloseTo(0.341, 2);
      expect(color.components[2]).toBeCloseTo(0.2, 2);
    });

    it('handles alpha parameter', () => {
      const color = Color.fromRgb(255, 255, 255, 0.5);
      expect(color.alpha).toBe(0.5);
    });
  });

  describe('toHex', () => {
    it('returns correct hex string', () => {
      const color = Color.fromHex('#FF5733');
      expect(color.toHex()).toBe('#ff5733');
    });

    it('includes alpha when requested', () => {
      const color = Color.fromHex('#FF573380');
      expect(color.toHex(true)).toBe('#ff573380');
    });
  });

  describe('toRgbArray', () => {
    it('returns RGB values as integers', () => {
      const color = Color.fromHex('#FF5733');
      const [r, g, b] = color.toRgbArray();
      expect(r).toBe(255);
      expect(g).toBe(87);
      expect(b).toBe(51);
    });
  });

  describe('withAlpha', () => {
    it('creates new color with modified alpha', () => {
      const color = Color.fromHex('#FF5733');
      const withAlpha = color.withAlpha(0.5);
      expect(withAlpha.alpha).toBe(0.5);
      expect(color.alpha).toBe(1); // Original unchanged
    });

    it('clamps alpha to valid range', () => {
      const color = Color.fromHex('#FF5733');
      expect(color.withAlpha(-0.5).alpha).toBe(0);
      expect(color.withAlpha(1.5).alpha).toBe(1);
    });
  });

  describe('equals', () => {
    it('returns true for equal colors', () => {
      const color1 = Color.fromHex('#FF5733');
      const color2 = Color.fromHex('#FF5733');
      expect(color1.equals(color2)).toBe(true);
    });

    it('returns false for different colors', () => {
      const color1 = Color.fromHex('#FF5733');
      const color2 = Color.fromHex('#FF5734');
      expect(color1.equals(color2)).toBe(false);
    });

    it('respects tolerance', () => {
      const color1 = Color.fromHex('#FF5733');
      const color2 = Color.fromHex('#FF5734');
      expect(color1.equals(color2, 0.01)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('components array is frozen', () => {
      const color = Color.fromHex('#FF5733');
      expect(Object.isFrozen(color.components)).toBe(true);
    });
  });
});
