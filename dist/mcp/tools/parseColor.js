import { Color } from '../../domain/values/Color.js';
import { ColorParseError, ColorSpaceMismatchError } from '../../domain/errors.js';
import { NamedColorsRepository } from '../../data/NamedColorsRepository.js';
const namedColors = new NamedColorsRepository();
/**
 * Parses a numeric string that may be a percentage.
 * When the value ends with '%', it is divided by 100 and scaled by maxForPercent.
 * @param val - The string value, possibly ending with '%'
 * @param maxForPercent - The scale factor applied after converting percentage to 0-1
 */
function parseNumOrPercent(val, maxForPercent) {
    if (val.endsWith('%')) {
        return (parseFloat(val) / 100) * maxForPercent;
    }
    return parseFloat(val);
}
/**
 * Strips a 'deg' suffix from a hue value and returns the numeric degrees.
 */
function parseDegrees(val) {
    const cleaned = val.endsWith('deg') ? val.slice(0, -3) : val;
    return parseFloat(cleaned);
}
/**
 * Parses an optional alpha string (may be percentage) into a 0-1 value.
 * Returns 1 when the alpha string is undefined.
 */
function parseAlpha(val) {
    if (!val)
        return 1;
    if (val.endsWith('%')) {
        return parseFloat(val) / 100;
    }
    return parseFloat(val);
}
/**
 * Map of CSS color() function gamut identifiers to internal ColorSpaceType values.
 * Only gamuts with a registered ColorSpaceType are supported.
 */
const COLOR_FUNCTION_SPACE_MAP = {
    'srgb': 'srgb',
    'display-p3': 'display-p3',
    'rec2020': 'rec2020',
    'prophoto-rgb': 'prophoto-rgb',
    'xyz-d65': 'xyz-d65',
};
/**
 * Parses a color string into a Color object.
 * Supports:
 * - Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 * - RGB: rgb(r, g, b), rgba(r, g, b, a)
 * - HSL: hsl(h, s%, l%), hsla(h, s%, l%, a)
 * - Named colors: red, blue, etc.
 * - CSS Color Level 4:
 *   - color(display-p3 R G B), color(srgb R G B), etc.
 *   - oklch(L C H), oklab(L a b)
 *   - lab(L a b), lch(L C H)
 *   - hwb(H W B)
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
    // --- CSS Color Level 4 formats ---
    // Try color() function: color(space R G B) or color(space R G B / A)
    const colorFnMatch = trimmed.match(/^color\(\s*([\w-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)\s+([\d.e+-]+)\s*(?:\/\s*([\d.]+%?))?\)$/);
    if (colorFnMatch) {
        const spaceName = colorFnMatch[1];
        const mappedSpace = COLOR_FUNCTION_SPACE_MAP[spaceName];
        if (!mappedSpace) {
            throw new ColorParseError(input, `Unsupported color space in color() function: "${spaceName}"`);
        }
        const c1 = parseFloat(colorFnMatch[2]);
        const c2 = parseFloat(colorFnMatch[3]);
        const c3 = parseFloat(colorFnMatch[4]);
        const a = parseAlpha(colorFnMatch[5]);
        return Color.create(mappedSpace, [c1, c2, c3], a);
    }
    // Try oklch(): oklch(L C H) or oklch(L C H / A)
    // L: 0-1 or percentage; C: 0-0.4 or percentage (100% = 0.4); H: degrees
    const oklchMatch = trimmed.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg)?)\s*(?:\/\s*([\d.]+%?))?\)$/);
    if (oklchMatch) {
        const l = parseNumOrPercent(oklchMatch[1], 1);
        const c = parseNumOrPercent(oklchMatch[2], 0.4);
        const h = parseDegrees(oklchMatch[3]);
        const a = parseAlpha(oklchMatch[4]);
        return Color.create('oklch', [l, c, h], a);
    }
    // Try oklab(): oklab(L a b) or oklab(L a b / A)
    // L: 0-1 or percentage; a: -0.4 to 0.4; b: -0.4 to 0.4
    const oklabMatch = trimmed.match(/^oklab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)\s*(?:\/\s*([\d.]+%?))?\)$/);
    if (oklabMatch) {
        const l = parseNumOrPercent(oklabMatch[1], 1);
        const aComp = parseNumOrPercent(oklabMatch[2], 0.4);
        const b = parseNumOrPercent(oklabMatch[3], 0.4);
        const alpha = parseAlpha(oklabMatch[4]);
        return Color.create('oklab', [l, aComp, b], alpha);
    }
    // Try lab(): lab(L a b) or lab(L a b / A)
    // L: 0-100; a: unbounded (typically -128 to 127); b: unbounded
    const labMatch = trimmed.match(/^lab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)\s*(?:\/\s*([\d.]+%?))?\)$/);
    if (labMatch) {
        const l = parseNumOrPercent(labMatch[1], 100);
        const aComp = parseFloat(labMatch[2]);
        const b = parseFloat(labMatch[3]);
        const alpha = parseAlpha(labMatch[4]);
        return Color.create('lab', [l, aComp, b], alpha);
    }
    // Try lch(): lch(L C H) or lch(L C H / A)
    // L: 0-100; C: 0-150 (unbounded in theory); H: degrees
    const lchMatch = trimmed.match(/^lch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg)?)\s*(?:\/\s*([\d.]+%?))?\)$/);
    if (lchMatch) {
        const l = parseNumOrPercent(lchMatch[1], 100);
        const c = parseNumOrPercent(lchMatch[2], 150);
        const h = parseDegrees(lchMatch[3]);
        const a = parseAlpha(lchMatch[4]);
        return Color.create('lch', [l, c, h], a);
    }
    // Try hwb(): hwb(H W B) or hwb(H W B / A)
    // H: degrees; W: 0-1 (percentage in CSS); B: 0-1 (percentage in CSS)
    const hwbMatch = trimmed.match(/^hwb\(\s*([\d.]+(?:deg)?)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?))?\)$/);
    if (hwbMatch) {
        const h = parseDegrees(hwbMatch[1]);
        const w = parseFloat(hwbMatch[2]) / 100;
        const b = parseFloat(hwbMatch[3]) / 100;
        const a = parseAlpha(hwbMatch[4]);
        return Color.create('hwb', [h, w, b], a);
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