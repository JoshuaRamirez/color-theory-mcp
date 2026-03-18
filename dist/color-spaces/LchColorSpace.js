import { Color } from '../domain/values/Color.js';
import { LabColorSpace } from './LabColorSpace.js';
const labSpace = new LabColorSpace();
/**
 * CIE LCH color space implementation.
 * Cylindrical representation of Lab (Lightness, Chroma, Hue).
 * More intuitive for color selection than Lab.
 */
export class LchColorSpace {
    type = 'lch';
    componentCount = 3;
    componentNames = ['Lightness', 'Chroma', 'Hue'];
    toXyzD65(color) {
        if (color.space !== 'lch') {
            throw new Error(`Expected lch color, got ${color.space}`);
        }
        const [L, C, H] = color.components;
        // LCH to Lab
        const hRad = (H * Math.PI) / 180;
        const a = C * Math.cos(hRad);
        const b = C * Math.sin(hRad);
        const labColor = Color.create('lab', [L, a, b], color.alpha);
        return labSpace.toXyzD65(labColor);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        // First convert to Lab
        const labColor = labSpace.fromXyzD65(color);
        const [L, a, b] = labColor.components;
        // Lab to LCH
        const C = Math.sqrt(a * a + b * b);
        let H = (Math.atan2(b, a) * 180) / Math.PI;
        if (H < 0) {
            H += 360;
        }
        // Handle achromatic colors
        if (C < 0.0001) {
            // Very low chroma - hue is essentially undefined
            return Color.create('lch', [L, 0, 0], color.alpha);
        }
        return Color.create('lch', [L, C, H], color.alpha);
    }
    isInGamut(components) {
        const [L, C, H] = components;
        return L >= 0 && L <= 100 && C >= 0 && C <= 150 && H >= 0 && H <= 360;
    }
    clampToGamut(components) {
        const [L, C, H] = components;
        return [
            Math.max(0, Math.min(100, L)),
            Math.max(0, Math.min(150, C)),
            ((H % 360) + 360) % 360, // Normalize hue to 0-360
        ];
    }
}
//# sourceMappingURL=LchColorSpace.js.map