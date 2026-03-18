import { Color } from '../../domain/values/Color.js';
import { ColorParseError, ColorSpaceMismatchError } from '../../domain/errors.js';
import { NamedColorsRepository } from '../../data/NamedColorsRepository.js';
const namedColors = new NamedColorsRepository();
/**
 * Parses a color string into a Color object.
 * Supports:
 * - Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 * - RGB: rgb(r, g, b), rgba(r, g, b, a)
 * - HSL: hsl(h, s%, l%), hsla(h, s%, l%, a)
 * - Named colors: red, blue, etc.
 */
export function parseColor(input) {
    const trimmed = input.trim().toLowerCase();
    // Try hex
    if (trimmed.startsWith('#')) {
        return Color.fromHex(trimmed);
    }
    // Try named color
    const namedColor = namedColors.getByName(trimmed);
    if (namedColor) {
        return namedColor.color;
    }
    // Try rgb/rgba
    const rgbMatch = trimmed.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
        return Color.fromRgb(r, g, b, a);
    }
    // Try hsl/hsla
    const hslMatch = trimmed.match(/^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
    if (hslMatch) {
        const h = parseFloat(hslMatch[1]);
        const s = parseFloat(hslMatch[2]) / 100;
        const l = parseFloat(hslMatch[3]) / 100;
        const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;
        return Color.create('hsl', [h, s, l], a);
    }
    throw new ColorParseError(input);
}
/**
 * Formats a color for output.
 */
export function formatColor(color) {
    // Ensure we're working with sRGB
    const srgb = color.space === 'srgb' ? color : null;
    if (!srgb) {
        throw new ColorSpaceMismatchError('srgb', color.space);
    }
    const [r, g, b] = srgb.toRgbArray();
    // Also get HSL
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;
    const d = max - min;
    let h = 0;
    let s = 0;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        switch (max) {
            case rNorm:
                h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) * 60;
                break;
            case gNorm:
                h = ((bNorm - rNorm) / d + 2) * 60;
                break;
            case bNorm:
                h = ((rNorm - gNorm) / d + 4) * 60;
                break;
        }
    }
    return {
        hex: srgb.toHex(),
        rgb: { r, g, b },
        hsl: {
            h: Math.round(h),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        },
        alpha: srgb.alpha,
    };
}
//# sourceMappingURL=parseColor.js.map