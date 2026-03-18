import { Color } from '../domain/values/Color.js';
import { SrgbColorSpace } from './SrgbColorSpace.js';
const srgbSpace = new SrgbColorSpace();
/**
 * HWB color space implementation.
 * Hue, Whiteness, Blackness - an intuitive color model for color selection.
 * Defined in CSS Color Level 4.
 */
export class HwbColorSpace {
    type = 'hwb';
    componentCount = 3;
    componentNames = ['Hue', 'Whiteness', 'Blackness'];
    toXyzD65(color) {
        if (color.space !== 'hwb') {
            throw new Error(`Expected hwb color, got ${color.space}`);
        }
        let [h, w, b] = color.components;
        // Normalize whiteness and blackness if they exceed 1
        if (w + b > 1) {
            const sum = w + b;
            w = w / sum;
            b = b / sum;
        }
        // HWB to RGB
        // First get the pure hue color
        const hNorm = ((h % 360) + 360) % 360;
        const hi = Math.floor(hNorm / 60) % 6;
        const f = hNorm / 60 - Math.floor(hNorm / 60);
        let r, g, bl;
        switch (hi) {
            case 0:
                [r, g, bl] = [1, f, 0];
                break;
            case 1:
                [r, g, bl] = [1 - f, 1, 0];
                break;
            case 2:
                [r, g, bl] = [0, 1, f];
                break;
            case 3:
                [r, g, bl] = [0, 1 - f, 1];
                break;
            case 4:
                [r, g, bl] = [f, 0, 1];
                break;
            default:
                [r, g, bl] = [1, 0, 1 - f];
                break;
        }
        // Apply whiteness and blackness
        r = r * (1 - w - b) + w;
        g = g * (1 - w - b) + w;
        bl = bl * (1 - w - b) + w;
        const srgbColor = Color.create('srgb', [r, g, bl], color.alpha);
        return srgbSpace.toXyzD65(srgbColor);
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        // First convert to sRGB
        const srgbColor = srgbSpace.fromXyzD65(color);
        const [r, g, b] = srgbColor.components;
        // RGB to HWB
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        // Calculate hue (same as HSL/HSV)
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
        // Whiteness is the minimum RGB component
        const w = min;
        // Blackness is 1 minus the maximum RGB component
        const bl = 1 - max;
        return Color.create('hwb', [h, w, bl], color.alpha);
    }
    isInGamut(components) {
        const [h, w, b] = components;
        return h >= 0 && h <= 360 && w >= 0 && w <= 1 && b >= 0 && b <= 1;
    }
    clampToGamut(components) {
        let [h, w, b] = components;
        h = ((h % 360) + 360) % 360;
        w = Math.max(0, Math.min(1, w));
        b = Math.max(0, Math.min(1, b));
        // Normalize if sum exceeds 1
        if (w + b > 1) {
            const sum = w + b;
            w = w / sum;
            b = b / sum;
        }
        return [h, w, b];
    }
}
//# sourceMappingURL=HwbColorSpace.js.map