import { describe, it, expect } from 'vitest';
import { Color } from '../domain/values/Color.js';
import { TemperatureService } from './TemperatureService.js';

describe('TemperatureService', () => {
  const service = new TemperatureService();

  describe('kelvinToColor', () => {
    it('should return warm colors for low temperatures', () => {
      const result = service.kelvinToColor(2700);
      expect(result.category).toBe('warm');
      expect(result.color.rgb.r).toBe(255); // Red channel maxed at low temp
      expect(result.color.rgb.b).toBeLessThan(result.color.rgb.r);
    });

    it('should return near-white for 6500K (D65)', () => {
      const result = service.kelvinToColor(6500);
      const { r, g, b } = result.color.rgb;
      // All channels should be high and similar
      expect(r).toBeGreaterThan(200);
      expect(g).toBeGreaterThan(200);
      expect(b).toBeGreaterThan(200);
    });

    it('should return bluish for high temperatures', () => {
      const result = service.kelvinToColor(15000);
      expect(result.category).toBe('cool');
      expect(result.color.rgb.b).toBe(255); // Blue maxed at high temp
    });

    it('should clamp to valid range', () => {
      const low = service.kelvinToColor(500);
      expect(low.kelvin).toBe(1000);

      const high = service.kelvinToColor(50000);
      expect(high.kelvin).toBe(40000);
    });

    it('should return correct descriptions for candlelight range', () => {
      const result = service.kelvinToColor(1500);
      expect(result.description).toContain('Candle');
    });

    it('should return correct descriptions for tungsten range', () => {
      const result = service.kelvinToColor(2700);
      expect(result.description).toContain('tungsten');
    });

    it('should return correct descriptions for daylight range', () => {
      const result = service.kelvinToColor(5500);
      expect(result.description).toContain('Daylight');
    });

    it('should return a valid hex string', () => {
      const result = service.kelvinToColor(4000);
      expect(result.color.hex).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('should produce progressively cooler (bluer) colors at higher temperatures', () => {
      const warm = service.kelvinToColor(2000);
      const neutral = service.kelvinToColor(5000);
      const cool = service.kelvinToColor(10000);

      // Blue channel should increase as temperature rises
      expect(neutral.color.rgb.b).toBeGreaterThan(warm.color.rgb.b);
      expect(cool.color.rgb.b).toBeGreaterThanOrEqual(neutral.color.rgb.b);
    });

    it('should have RGB values in valid 0-255 range', () => {
      const testTemps = [1000, 2700, 5500, 6500, 10000, 20000, 40000];
      for (const kelvin of testTemps) {
        const result = service.kelvinToColor(kelvin);
        expect(result.color.rgb.r).toBeGreaterThanOrEqual(0);
        expect(result.color.rgb.r).toBeLessThanOrEqual(255);
        expect(result.color.rgb.g).toBeGreaterThanOrEqual(0);
        expect(result.color.rgb.g).toBeLessThanOrEqual(255);
        expect(result.color.rgb.b).toBeGreaterThanOrEqual(0);
        expect(result.color.rgb.b).toBeLessThanOrEqual(255);
      }
    });
  });

  describe('colorToTemperature', () => {
    it('should estimate white as approximately D65 (6500K)', () => {
      const white = Color.fromHex('#FFFFFF');
      const result = service.colorToTemperature(white);
      // McCamy's formula should estimate white near 6500K
      expect(result.estimatedKelvin).toBeGreaterThan(5500);
      expect(result.estimatedKelvin).toBeLessThan(7500);
    });

    it('should detect white as near the Planckian locus', () => {
      const white = Color.fromHex('#FFFFFF');
      const result = service.colorToTemperature(white);
      expect(result.isOnPlanckianLocus).toBe(true);
    });

    it('should detect saturated colors as off the Planckian locus', () => {
      const red = Color.fromHex('#FF0000');
      const result = service.colorToTemperature(red);
      expect(result.isOnPlanckianLocus).toBe(false);
    });

    it('should round-trip approximately for blackbody colors', () => {
      // Generate a 5500K color, then estimate its temperature
      const generated = service.kelvinToColor(5500);
      const color = Color.fromHex(generated.color.hex);
      const estimated = service.colorToTemperature(color);

      // Should be within ~20% of original
      expect(estimated.estimatedKelvin).toBeGreaterThan(4500);
      expect(estimated.estimatedKelvin).toBeLessThan(6500);
    });

    it('should return chromaticity coordinates', () => {
      const white = Color.fromHex('#FFFFFF');
      const result = service.colorToTemperature(white);
      expect(result.chromaticity.x).toBeGreaterThan(0);
      expect(result.chromaticity.x).toBeLessThan(1);
      expect(result.chromaticity.y).toBeGreaterThan(0);
      expect(result.chromaticity.y).toBeLessThan(1);
    });

    it('should handle pure black as a special case', () => {
      const black = Color.fromHex('#000000');
      const result = service.colorToTemperature(black);
      expect(result.estimatedKelvin).toBe(0);
      expect(result.isOnPlanckianLocus).toBe(false);
    });

    it('should return a description and category', () => {
      const white = Color.fromHex('#FFFFFF');
      const result = service.colorToTemperature(white);
      expect(result.description).toBeTruthy();
      expect(result.category).toBeTruthy();
    });
  });

  describe('generateTemperatureGradient', () => {
    it('should generate the requested number of steps', () => {
      const gradient = service.generateTemperatureGradient(2000, 8000, 5);
      expect(gradient).toHaveLength(5);
    });

    it('should start and end at the requested temperatures', () => {
      const gradient = service.generateTemperatureGradient(3000, 7000, 3);
      expect(gradient[0]!.kelvin).toBe(3000);
      expect(gradient[2]!.kelvin).toBe(7000);
    });

    it('should have evenly spaced temperatures', () => {
      const gradient = service.generateTemperatureGradient(2000, 6000, 3);
      expect(gradient[0]!.kelvin).toBe(2000);
      expect(gradient[1]!.kelvin).toBe(4000);
      expect(gradient[2]!.kelvin).toBe(6000);
    });

    it('should throw for fewer than 2 steps', () => {
      expect(() => service.generateTemperatureGradient(2000, 6000, 1)).toThrow();
    });

    it('should produce valid TemperatureInfo for each step', () => {
      const gradient = service.generateTemperatureGradient(2000, 10000, 5);
      for (const info of gradient) {
        expect(info.kelvin).toBeGreaterThanOrEqual(1000);
        expect(info.kelvin).toBeLessThanOrEqual(40000);
        expect(info.color.hex).toMatch(/^#[0-9a-f]{6}$/);
        expect(info.description).toBeTruthy();
        expect(info.category).toBeTruthy();
      }
    });

    it('should handle same start and end temperature', () => {
      const gradient = service.generateTemperatureGradient(5000, 5000, 3);
      expect(gradient).toHaveLength(3);
      expect(gradient[0]!.kelvin).toBe(5000);
      expect(gradient[1]!.kelvin).toBe(5000);
      expect(gradient[2]!.kelvin).toBe(5000);
    });
  });
});
