import { Color } from '../../domain/values/Color.js';
import { ConversionService } from '../../services/ConversionService.js';
import { removeGamma, applyGamma } from '../../color-spaces/gamma.js';
import { PROTANOPIA_MATRICES, DEUTERANOPIA_MATRICES, TRITANOPIA_MATRICES, getMatrixForSeverity, } from './MachadoMatrices.js';
const conversionService = new ConversionService();
/**
 * Base CVD simulator using Machado matrices.
 */
class MachadoCVDSimulator {
    simulate(color, options) {
        const severity = options?.severity ?? 1.0;
        // Convert to sRGB
        const srgbColor = conversionService.convert(color, 'srgb');
        const [r, g, b] = srgbColor.components;
        // Linearize
        const linearRgb = removeGamma([r, g, b]);
        // Get simulation matrix
        const matrix = getMatrixForSeverity(this.matrices, severity);
        // Apply CVD transformation
        const simulated = matrix.multiplyVector(linearRgb);
        // Clamp and apply gamma
        const clamped = [
            Math.max(0, Math.min(1, simulated[0])),
            Math.max(0, Math.min(1, simulated[1])),
            Math.max(0, Math.min(1, simulated[2])),
        ];
        const gammaApplied = applyGamma(clamped);
        // Return in original color space
        const resultSrgb = Color.create('srgb', gammaApplied, color.alpha);
        return conversionService.convert(resultSrgb, color.space);
    }
    simulateBatch(colors, options) {
        return colors.map(color => this.simulate(color, options));
    }
}
/**
 * Protanopia simulator (L-cone/red deficiency).
 */
export class ProtanopiaSimulator extends MachadoCVDSimulator {
    type = 'protanopia';
    info = {
        type: 'protanopia',
        name: 'Protanopia',
        description: 'Red-blind: inability to perceive red light (L-cone missing)',
        affectedCone: 'L',
        prevalence: { male: 0.01, female: 0.0001 },
    };
    matrices = PROTANOPIA_MATRICES;
}
/**
 * Protanomaly simulator (L-cone/red deficiency - partial).
 */
export class ProtanomalySimulator extends MachadoCVDSimulator {
    type = 'protanomaly';
    info = {
        type: 'protanomaly',
        name: 'Protanomaly',
        description: 'Red-weak: reduced sensitivity to red light (L-cone deficient)',
        affectedCone: 'L',
        prevalence: { male: 0.01, female: 0.0004 },
    };
    matrices = PROTANOPIA_MATRICES;
    simulate(color, options) {
        // Protanomaly is typically ~50% severity
        const severity = options?.severity ?? 0.5;
        return super.simulate(color, { ...options, severity });
    }
}
/**
 * Deuteranopia simulator (M-cone/green deficiency).
 */
export class DeuteranopiaSimulator extends MachadoCVDSimulator {
    type = 'deuteranopia';
    info = {
        type: 'deuteranopia',
        name: 'Deuteranopia',
        description: 'Green-blind: inability to perceive green light (M-cone missing)',
        affectedCone: 'M',
        prevalence: { male: 0.01, female: 0.0001 },
    };
    matrices = DEUTERANOPIA_MATRICES;
}
/**
 * Deuteranomaly simulator (M-cone/green deficiency - partial).
 */
export class DeuteranomalySimulator extends MachadoCVDSimulator {
    type = 'deuteranomaly';
    info = {
        type: 'deuteranomaly',
        name: 'Deuteranomaly',
        description: 'Green-weak: reduced sensitivity to green light (M-cone deficient)',
        affectedCone: 'M',
        prevalence: { male: 0.05, female: 0.004 },
    };
    matrices = DEUTERANOPIA_MATRICES;
    simulate(color, options) {
        const severity = options?.severity ?? 0.5;
        return super.simulate(color, { ...options, severity });
    }
}
/**
 * Tritanopia simulator (S-cone/blue deficiency).
 */
export class TritanopiaSimulator extends MachadoCVDSimulator {
    type = 'tritanopia';
    info = {
        type: 'tritanopia',
        name: 'Tritanopia',
        description: 'Blue-blind: inability to perceive blue light (S-cone missing)',
        affectedCone: 'S',
        prevalence: { male: 0.0001, female: 0.0001 },
    };
    matrices = TRITANOPIA_MATRICES;
}
/**
 * Tritanomaly simulator (S-cone/blue deficiency - partial).
 */
export class TritanomalySimulator extends MachadoCVDSimulator {
    type = 'tritanomaly';
    info = {
        type: 'tritanomaly',
        name: 'Tritanomaly',
        description: 'Blue-weak: reduced sensitivity to blue light (S-cone deficient)',
        affectedCone: 'S',
        prevalence: { male: 0.0001, female: 0.0001 },
    };
    matrices = TRITANOPIA_MATRICES;
    simulate(color, options) {
        const severity = options?.severity ?? 0.5;
        return super.simulate(color, { ...options, severity });
    }
}
/**
 * Achromatopsia simulator (total color blindness).
 */
export class AchromatopsiaSimulator {
    type = 'achromatopsia';
    info = {
        type: 'achromatopsia',
        name: 'Achromatopsia',
        description: 'Total color blindness: only shades of gray are perceived',
        affectedCone: 'all',
        prevalence: { male: 0.00003, female: 0.00003 },
    };
    simulate(color, _options) {
        // Convert to sRGB and calculate luminance
        const srgbColor = conversionService.convert(color, 'srgb');
        const [r, g, b] = srgbColor.components;
        // Use standard luminance coefficients
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const resultSrgb = Color.create('srgb', [gray, gray, gray], color.alpha);
        return conversionService.convert(resultSrgb, color.space);
    }
    simulateBatch(colors, options) {
        return colors.map(color => this.simulate(color, options));
    }
}
/**
 * Achromatomaly simulator (partial total color blindness).
 */
export class AchromatomalySimulator {
    type = 'achromatomaly';
    info = {
        type: 'achromatomaly',
        name: 'Achromatomaly',
        description: 'Partial color blindness: reduced color perception',
        affectedCone: 'all',
        prevalence: { male: 0.0001, female: 0.0001 },
    };
    simulate(color, options) {
        const severity = options?.severity ?? 0.5;
        // Convert to sRGB
        const srgbColor = conversionService.convert(color, 'srgb');
        const [r, g, b] = srgbColor.components;
        // Calculate grayscale
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        // Interpolate between color and gray based on severity
        const resultR = r * (1 - severity) + gray * severity;
        const resultG = g * (1 - severity) + gray * severity;
        const resultB = b * (1 - severity) + gray * severity;
        const resultSrgb = Color.create('srgb', [resultR, resultG, resultB], color.alpha);
        return conversionService.convert(resultSrgb, color.space);
    }
    simulateBatch(colors, options) {
        return colors.map(color => this.simulate(color, options));
    }
}
//# sourceMappingURL=CVDSimulators.js.map