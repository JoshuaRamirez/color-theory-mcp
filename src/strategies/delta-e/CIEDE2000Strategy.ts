import type { IDeltaEStrategy, DeltaEInterpretation, DeltaEOptions } from '../../domain/interfaces/IDeltaEStrategy.js';
import type { Color } from '../../domain/values/Color.js';
import { ConversionService } from '../../services/ConversionService.js';

const conversionService = new ConversionService();

/**
 * CIEDE2000 Delta-E calculation - the current standard.
 *
 * Based on: Sharma, Wu, Dalal (2005) "The CIEDE2000 Color-Difference Formula:
 * Implementation Notes, Supplementary Test Data, and Mathematical Observations"
 *
 * Improvements over CIE94:
 * - Rotation term for blues
 * - Better hue weighting
 * - Improved chroma weighting
 */
export class CIEDE2000Strategy implements IDeltaEStrategy {
  readonly method = 'CIEDE2000' as const;
  readonly description = 'CIEDE2000 color difference (current CIE standard)';

  calculate(color1: Color, color2: Color, _options?: DeltaEOptions): number {
    // Convert both colors to Lab
    const lab1 = conversionService.convert(color1, 'lab');
    const lab2 = conversionService.convert(color2, 'lab');

    const [L1, a1, b1] = lab1.components as [number, number, number];
    const [L2, a2, b2] = lab2.components as [number, number, number];

    // Parametric weighting factors (all 1 for standard use)
    const kL = 1;
    const kC = 1;
    const kH = 1;

    // Step 1: Calculate C'i and h'i
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const Cbar = (C1 + C2) / 2;

    // G factor
    const Cbar7 = Math.pow(Cbar, 7);
    const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + Math.pow(25, 7))));

    // a' values
    const a1Prime = a1 * (1 + G);
    const a2Prime = a2 * (1 + G);

    // C' values
    const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
    const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

    // h' values (in degrees)
    const h1Prime = this.hPrime(a1Prime, b1);
    const h2Prime = this.hPrime(a2Prime, b2);

    // Step 2: Calculate ΔL', ΔC', ΔH'
    const dLPrime = L2 - L1;
    const dCPrime = C2Prime - C1Prime;

    // Δh' calculation (complex due to hue wraparound)
    let dhPrime: number;
    if (C1Prime * C2Prime === 0) {
      dhPrime = 0;
    } else if (Math.abs(h2Prime - h1Prime) <= 180) {
      dhPrime = h2Prime - h1Prime;
    } else if (h2Prime - h1Prime > 180) {
      dhPrime = h2Prime - h1Prime - 360;
    } else {
      dhPrime = h2Prime - h1Prime + 360;
    }

    // ΔH'
    const dHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((dhPrime * Math.PI) / 360);

    // Step 3: Calculate CIEDE2000 ΔE'00
    const Lbar = (L1 + L2) / 2;
    const CbarPrime = (C1Prime + C2Prime) / 2;

    // h'bar calculation
    let hbarPrime: number;
    if (C1Prime * C2Prime === 0) {
      hbarPrime = h1Prime + h2Prime;
    } else if (Math.abs(h1Prime - h2Prime) <= 180) {
      hbarPrime = (h1Prime + h2Prime) / 2;
    } else if (h1Prime + h2Prime < 360) {
      hbarPrime = (h1Prime + h2Prime + 360) / 2;
    } else {
      hbarPrime = (h1Prime + h2Prime - 360) / 2;
    }

    // T function
    const T =
      1 -
      0.17 * Math.cos(((hbarPrime - 30) * Math.PI) / 180) +
      0.24 * Math.cos((2 * hbarPrime * Math.PI) / 180) +
      0.32 * Math.cos(((3 * hbarPrime + 6) * Math.PI) / 180) -
      0.20 * Math.cos(((4 * hbarPrime - 63) * Math.PI) / 180);

    // dTheta (rotation for blue region)
    const dTheta = 30 * Math.exp(-Math.pow((hbarPrime - 275) / 25, 2));

    // RC (chroma rotation)
    const CbarPrime7 = Math.pow(CbarPrime, 7);
    const RC = 2 * Math.sqrt(CbarPrime7 / (CbarPrime7 + Math.pow(25, 7)));

    // SL, SC, SH weighting functions
    const Lbar50 = Math.pow(Lbar - 50, 2);
    const SL = 1 + (0.015 * Lbar50) / Math.sqrt(20 + Lbar50);
    const SC = 1 + 0.045 * CbarPrime;
    const SH = 1 + 0.015 * CbarPrime * T;

    // RT (rotation term)
    const RT = -Math.sin((2 * dTheta * Math.PI) / 180) * RC;

    // Final calculation
    const term1 = dLPrime / (kL * SL);
    const term2 = dCPrime / (kC * SC);
    const term3 = dHPrime / (kH * SH);

    const deltaE = Math.sqrt(
      term1 * term1 +
        term2 * term2 +
        term3 * term3 +
        RT * term2 * term3
    );

    return deltaE;
  }

  /**
   * Calculate h' (hue angle in degrees).
   */
  private hPrime(aPrime: number, b: number): number {
    if (aPrime === 0 && b === 0) {
      return 0;
    }
    let h = (Math.atan2(b, aPrime) * 180) / Math.PI;
    if (h < 0) {
      h += 360;
    }
    return h;
  }

  interpret(deltaE: number): DeltaEInterpretation {
    // CIEDE2000 thresholds (slightly different from older formulas)
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
