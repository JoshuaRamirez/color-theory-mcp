import { Color as ColorClass } from '../../domain/values/Color.js';
import { ConversionService } from '../../services/ConversionService.js';
import { CVDSimulatorRegistry } from './CVDSimulatorRegistry.js';
import { removeGamma, applyGamma } from '../../color-spaces/gamma.js';
const conversionService = new ConversionService();
/**
 * Error redistribution matrices for daltonization.
 * These shift lost information into channels the deficient eye can perceive.
 *
 * For protanopia/deuteranopia (red-green deficiency):
 *   Lost red/green information is redistributed to blue channel.
 * For tritanopia (blue-yellow deficiency):
 *   Lost blue information is redistributed to red/green channels.
 */
const ERROR_MATRICES = {
    // Protanopia/protanomaly: shift error into blue and green
    protan: [
        [0, 0, 0],
        [0.7, 1, 0],
        [0.7, 0, 1],
    ],
    // Deuteranopia/deuteranomaly: shift error into blue and red
    deutan: [
        [1, 0.7, 0],
        [0, 0, 0],
        [0, 0.7, 1],
    ],
    // Tritanopia/tritanomaly: shift error into red and green
    tritan: [
        [1, 0, 0.7],
        [0, 1, 0.7],
        [0, 0, 0],
    ],
};
/**
 * Maps CVD types to their error redistribution category.
 */
function getErrorCategory(cvdType) {
    if (cvdType === 'protanopia' || cvdType === 'protanomaly')
        return 'protan';
    if (cvdType === 'deuteranopia' || cvdType === 'deuteranomaly')
        return 'deutan';
    if (cvdType === 'tritanopia' || cvdType === 'tritanomaly')
        return 'tritan';
    // Achromatopsia/achromatomaly - use deutan as best effort
    return 'deutan';
}
/**
 * Daltonizes a color to improve distinguishability for people with CVD.
 *
 * The classic daltonization algorithm:
 * 1. Simulate the CVD view of the original color
 * 2. Compute the error (difference between original and simulated in linear RGB)
 * 3. Redistribute the error to channels the person CAN see
 * 4. Add the redistributed error back to the original
 */
export function daltonize(color, cvdType, options) {
    const severity = options?.severity ?? 1.0;
    const strength = Math.max(0, Math.min(1, options?.strength ?? 1.0));
    // Convert to sRGB
    const srgb = conversionService.convert(color, 'srgb');
    const [r, g, b] = srgb.components;
    // Get CVD simulator
    const registry = CVDSimulatorRegistry.createDefault();
    const simulator = registry.get(cvdType);
    if (!simulator) {
        return { original: color, corrected: color, cvdType, severity };
    }
    // Simulate CVD view
    const simulated = simulator.simulate(srgb, { severity });
    const [sr, sg, sb] = conversionService.convert(simulated, 'srgb').components;
    // Compute error in linear RGB
    const origLinear = removeGamma([r, g, b]);
    const simLinear = removeGamma([sr, sg, sb]);
    const error = [
        origLinear[0] - simLinear[0],
        origLinear[1] - simLinear[1],
        origLinear[2] - simLinear[2],
    ];
    // Get error redistribution matrix
    const category = getErrorCategory(cvdType);
    const matrix = ERROR_MATRICES[category];
    // Redistribute error
    const correction = [
        matrix[0][0] * error[0] + matrix[0][1] * error[1] + matrix[0][2] * error[2],
        matrix[1][0] * error[0] + matrix[1][1] * error[1] + matrix[1][2] * error[2],
        matrix[2][0] * error[0] + matrix[2][1] * error[1] + matrix[2][2] * error[2],
    ];
    // Apply correction (with strength control)
    const correctedLinear = [
        origLinear[0] + correction[0] * strength,
        origLinear[1] + correction[1] * strength,
        origLinear[2] + correction[2] * strength,
    ];
    // Convert back to sRGB (clamp to gamut)
    const correctedGamma = applyGamma([
        Math.max(0, Math.min(1, correctedLinear[0])),
        Math.max(0, Math.min(1, correctedLinear[1])),
        Math.max(0, Math.min(1, correctedLinear[2])),
    ]);
    const corrected = ColorClass.create('srgb', correctedGamma, color.alpha);
    return { original: color, corrected, cvdType, severity };
}
/**
 * Daltonizes multiple colors to maximize mutual distinguishability.
 */
export function daltonizePalette(colors, cvdType, options) {
    return colors.map(c => daltonize(c, cvdType, options));
}
//# sourceMappingURL=Daltonizer.js.map