import { ConversionService } from '../../services/ConversionService.js';
const conversionService = new ConversionService();
/**
 * CIE94 Delta-E calculation with weighted chroma and hue.
 *
 * Improves upon CIE76 by adding weighting factors that account for
 * human perception being more sensitive to lightness changes than
 * chroma or hue changes.
 */
export class CIE94Strategy {
    method = 'CIE94';
    description = 'CIE 1994 color difference with chroma/hue weighting';
    calculate(color1, color2, options) {
        // Convert both colors to Lab
        const lab1 = conversionService.convert(color1, 'lab');
        const lab2 = conversionService.convert(color2, 'lab');
        const [L1, a1, b1] = lab1.components;
        const [L2, a2, b2] = lab2.components;
        // Weighting factors based on application
        const isTextiles = options?.application === 'textiles';
        const kL = isTextiles ? 2 : 1;
        const K1 = isTextiles ? 0.048 : 0.045;
        const K2 = isTextiles ? 0.014 : 0.015;
        // Parametric factors (usually 1)
        const kC = 1;
        const kH = 1;
        // Calculate chroma
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);
        // Differences
        const dL = L1 - L2;
        const dC = C1 - C2;
        const da = a1 - a2;
        const db = b1 - b2;
        // Calculate dH (hue difference)
        // dH² = da² + db² - dC²
        const dH2 = da * da + db * db - dC * dC;
        const dH = dH2 > 0 ? Math.sqrt(dH2) : 0;
        // Weighting functions
        const SL = 1;
        const SC = 1 + K1 * C1;
        const SH = 1 + K2 * C1;
        // Calculate Delta-E 94
        const term1 = dL / (kL * SL);
        const term2 = dC / (kC * SC);
        const term3 = dH / (kH * SH);
        return Math.sqrt(term1 * term1 + term2 * term2 + term3 * term3);
    }
    interpret(deltaE) {
        if (deltaE < 1) {
            return {
                value: deltaE,
                description: 'Not perceptible by human eyes',
                perceptible: false,
                acceptable: true,
            };
        }
        else if (deltaE < 2) {
            return {
                value: deltaE,
                description: 'Perceptible through close observation',
                perceptible: true,
                acceptable: true,
            };
        }
        else if (deltaE < 3) {
            return {
                value: deltaE,
                description: 'Perceptible at a glance',
                perceptible: true,
                acceptable: true,
            };
        }
        else if (deltaE < 5) {
            return {
                value: deltaE,
                description: 'Colors are more similar than different',
                perceptible: true,
                acceptable: true,
            };
        }
        else {
            return {
                value: deltaE,
                description: 'Colors are noticeably different',
                perceptible: true,
                acceptable: false,
            };
        }
    }
}
//# sourceMappingURL=CIE94Strategy.js.map