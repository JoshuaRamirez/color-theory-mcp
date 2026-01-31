import { describe, it, expect } from 'vitest';
import { Color } from '../../domain/values/Color.js';
import { CIE76Strategy } from './CIE76Strategy.js';
import { CIEDE2000Strategy } from './CIEDE2000Strategy.js';

describe('Delta-E Strategies', () => {
  describe('CIE76Strategy', () => {
    const strategy = new CIE76Strategy();

    it('identical colors have deltaE=0', () => {
      const color = Color.fromHex('#FF5733');
      expect(strategy.calculate(color, color)).toBeCloseTo(0, 2);
    });

    it('white and black have high deltaE', () => {
      const white = Color.fromHex('#FFFFFF');
      const black = Color.fromHex('#000000');
      const deltaE = strategy.calculate(white, black);
      expect(deltaE).toBeGreaterThan(90); // Should be ~100
    });

    it('similar colors have low deltaE', () => {
      const color1 = Color.fromHex('#FF5733');
      const color2 = Color.fromHex('#FF5734');
      const deltaE = strategy.calculate(color1, color2);
      expect(deltaE).toBeLessThan(1);
    });
  });

  describe('CIEDE2000Strategy', () => {
    const strategy = new CIEDE2000Strategy();

    it('identical colors have deltaE=0', () => {
      const color = Color.fromHex('#FF5733');
      expect(strategy.calculate(color, color)).toBeCloseTo(0, 2);
    });

    it('white and black have high deltaE', () => {
      const white = Color.fromHex('#FFFFFF');
      const black = Color.fromHex('#000000');
      const deltaE = strategy.calculate(white, black);
      expect(deltaE).toBeGreaterThan(90);
    });

    it('similar colors have low deltaE', () => {
      const color1 = Color.fromHex('#FF5733');
      const color2 = Color.fromHex('#FF5734');
      const deltaE = strategy.calculate(color1, color2);
      expect(deltaE).toBeLessThan(1);
    });

    // CIEDE2000 test vectors from Sharma 2005 paper
    it('passes Sharma test vector 1', () => {
      // Lab1: 50.0000, 2.6772, -79.7751
      // Lab2: 50.0000, 0.0000, -82.7485
      // Expected: 2.0425
      const color1 = Color.create('lab', [50, 2.6772, -79.7751]);
      const color2 = Color.create('lab', [50, 0, -82.7485]);
      const deltaE = strategy.calculate(color1, color2);
      expect(deltaE).toBeCloseTo(2.0425, 1);
    });
  });

  describe('interpret', () => {
    const strategy = new CIEDE2000Strategy();

    it('imperceptible for deltaE < 1', () => {
      const interp = strategy.interpret(0.5);
      expect(interp.perceptible).toBe(false);
    });

    it('perceptible for deltaE >= 1', () => {
      const interp = strategy.interpret(1.5);
      expect(interp.perceptible).toBe(true);
    });

    it('not acceptable for deltaE >= 5', () => {
      const interp = strategy.interpret(6);
      expect(interp.acceptable).toBe(false);
    });
  });
});
