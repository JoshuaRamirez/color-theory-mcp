import type { IDeltaEStrategy, DeltaEInterpretation, DeltaEOptions } from '../../domain/interfaces/IDeltaEStrategy.js';
import { Color } from '../../domain/values/Color.js';
import { ConversionService } from '../../services/ConversionService.js';

const conversionService = new ConversionService();

/**
 * CIE76 Delta-E calculation (simple Euclidean distance in Lab).
 *
 * Formula: ΔE*ab = √((ΔL*)² + (Δa*)² + (Δb*)²)
 *
 * The simplest Delta-E formula. Fast but less accurate than modern methods.
 */
export class CIE76Strategy implements IDeltaEStrategy {
  readonly method = 'CIE76' as const;
  readonly description = 'CIE 1976 Lab color difference (Euclidean distance)';

  calculate(color1: Color, color2: Color, _options?: DeltaEOptions): number {
    // Convert both colors to Lab
    const lab1 = conversionService.convert(color1, 'lab');
    const lab2 = conversionService.convert(color2, 'lab');

    const [L1, a1, b1] = lab1.components as [number, number, number];
    const [L2, a2, b2] = lab2.components as [number, number, number];

    const dL = L1 - L2;
    const da = a1 - a2;
    const db = b1 - b2;

    return Math.sqrt(dL * dL + da * da + db * db);
  }

  interpret(deltaE: number): DeltaEInterpretation {
    // Standard interpretation thresholds
    if (deltaE < 1) {
      return {
        value: deltaE,
        description: 'Not perceptible by human eyes',
        perceptible: false,
        acceptable: true,
      };
    } else if (deltaE < 2) {
      return {
        value: deltaE,
        description: 'Perceptible through close observation',
        perceptible: true,
        acceptable: true,
      };
    } else if (deltaE < 3.5) {
      return {
        value: deltaE,
        description: 'Perceptible at a glance',
        perceptible: true,
        acceptable: true,
      };
    } else if (deltaE < 5) {
      return {
        value: deltaE,
        description: 'Colors are more similar than different',
        perceptible: true,
        acceptable: true,
      };
    } else {
      return {
        value: deltaE,
        description: 'Colors are noticeably different',
        perceptible: true,
        acceptable: false,
      };
    }
  }
}
