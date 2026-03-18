import { Color } from '../domain/values/Color.js';
import { XYZ_D65_TO_D50, XYZ_D50_TO_D65 } from './constants.js';
/**
 * CIE XYZ color space with D50 illuminant.
 * D50 is the standard illuminant for print/prepress workflows.
 */
export class XyzD50ColorSpace {
    type = 'xyz-d50';
    componentCount = 3;
    componentNames = ['X', 'Y', 'Z'];
    toXyzD65(color) {
        if (color.space !== 'xyz-d50') {
            throw new Error(`Expected xyz-d50 color, got ${color.space}`);
        }
        const xyz50 = color.components;
        // Chromatic adaptation from D50 to D65 (Bradford)
        const xyz65 = XYZ_D50_TO_D65.multiplyVector(xyz50);
        return Color.create('xyz-d65', xyz65, color.alpha);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        const xyz65 = color.components;
        // Chromatic adaptation from D65 to D50 (Bradford)
        const xyz50 = XYZ_D65_TO_D50.multiplyVector(xyz65);
        return Color.create('xyz-d50', xyz50, color.alpha);
    }
    isInGamut(components) {
        const [x, y, z] = components;
        return x >= 0 && y >= 0 && z >= 0;
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, c));
    }
}
//# sourceMappingURL=XyzD50ColorSpace.js.map