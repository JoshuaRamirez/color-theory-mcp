import { Color } from '../domain/values/Color.js';
import { SrgbColorSpace } from './SrgbColorSpace.js';
const srgbSpace = new SrgbColorSpace();
/**
 * HSV color space implementation.
 * Hue, Saturation, Value - used in many graphics applications.
 * Also known as HSB (Hue, Saturation, Brightness).
 */
export class HsvColorSpace {
    type = 'hsv';
    componentCount = 3;
    componentNames = ['Hue', 'Saturation', 'Value'];
    toXyzD65(color) {
        if (color.space !== 'hsv') {
            throw new Error(`Expected hsv color, got ${color.space}`);
        }
        const [h, s, v] = color.components;
        // HSV to RGB algorithm
        const c = v * s; // Chroma
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;
        let r, g, b;
        if (h < 60) {
            [r, g, b] = [c, x, 0];
        }
        else if (h < 120) {
            [r, g, b] = [x, c, 0];
        }
        else if (h < 180) {
            [r, g, b] = [0, c, x];
        }
        else if (h < 240) {
            [r, g, b] = [0, x, c];
        }
        else if (h < 300) {
            [r, g, b] = [x, 0, c];
        }
        else {
            [r, g, b] = [c, 0, x];
        }
        const srgbColor = Color.create('srgb', [r + m, g + m, b + m], color.alpha);
        return srgbSpace.toXyzD65(srgbColor);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        // First convert to sRGB
        const srgbColor = srgbSpace.fromXyzD65(color);
        const [r, g, b] = srgbColor.components;
        // RGB to HSV algorithm
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        const v = max;
        const s = max === 0 ? 0 : d / max;
        let h = 0;
        if (d !== 0) {
            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
                    break;
                case g:
                    h = ((b - r) / d + 2) * 60;
                    break;
                case b:
                    h = ((r - g) / d + 4) * 60;
                    break;
            }
        }
        return Color.create('hsv', [h, s, v], color.alpha);
    }
    isInGamut(components) {
        const [h, s, v] = components;
        return h >= 0 && h <= 360 && s >= 0 && s <= 1 && v >= 0 && v <= 1;
    }
    clampToGamut(components) {
        const [h, s, v] = components;
        return [
            ((h % 360) + 360) % 360,
            Math.max(0, Math.min(1, s)),
            Math.max(0, Math.min(1, v)),
        ];
    }
}
//# sourceMappingURL=HsvColorSpace.js.map