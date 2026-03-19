import { Color } from '../../domain/values/Color.js';
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
export declare function parseColor(input: string): Color;
/**
 * Formats a color for output.
 */
export declare function formatColor(color: Color): {
    hex: string;
    rgb: {
        r: number;
        g: number;
        b: number;
    };
    hsl: {
        h: number;
        s: number;
        l: number;
    };
    alpha: number;
};
//# sourceMappingURL=parseColor.d.ts.map