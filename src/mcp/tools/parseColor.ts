import { Color } from '../../domain/values/Color.js';
import { ColorParseError, ColorSpaceMismatchError } from '../../domain/errors.js';
import { type ColorSpaceType } from '../../domain/values/ColorSpaceType.js';
import { NamedColorsRepository } from '../../data/NamedColorsRepository.js';

const namedColors = new NamedColorsRepository();

/**
 * Parses a numeric string that may be a percentage.
 * When the value ends with '%', it is divided by 100 and scaled by maxForPercent.
 * @param val - The string value, possibly ending with '%'
 * @param maxForPercent - The scale factor applied after converting percentage to 0-1
 */
function parseNumOrPercent(val: string, maxForPercent: number): number {
  if (val.endsWith('%')) {
    return (parseFloat(val) / 100) * maxForPercent;
  }
  return parseFloat(val);
}

/**
 * Strips a 'deg' suffix from a hue value and returns the numeric degrees.
 * Handles deg, rad, grad, turn units.
 */
function parseDegrees(val: string): number {
  if (val.endsWith('deg')) return parseFloat(val.slice(0, -3));
  if (val.endsWith('rad')) return parseFloat(val.slice(0, -3)) * (180 / Math.PI);
  if (val.endsWith('grad')) return parseFloat(val.slice(0, -4)) * 0.9;
  if (val.endsWith('turn')) return parseFloat(val.slice(0, -4)) * 360;
  return parseFloat(val);
}

/**
 * Parses an optional alpha string (may be percentage) into a 0-1 value.
 * Returns 1 when the alpha string is undefined.
 */
function parseAlpha(val: string | undefined): number {
  if (!val) return 1;
  if (val.endsWith('%')) {
    return parseFloat(val) / 100;
  }
  return parseFloat(val);
}

/**
 * Map of CSS color() function gamut identifiers to internal ColorSpaceType values.
 * Only gamuts with a registered ColorSpaceType are supported.
 */
const COLOR_FUNCTION_SPACE_MAP: Record<string, ColorSpaceType> = {
  srgb: 'srgb',
  'display-p3': 'display-p3',
  rec2020: 'rec2020',
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
export function parseColor(input: string): Color {
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
  // Supports both comma-separated (legacy) and space-separated (modern)
  const rgbCommaMatch = trimmed.match(
    /^rgba?\s*\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*(?:,\s*([\d.]+%?))?\)$/
  );
  const rgbSpaceMatch = trimmed.match(
    /^rgba?\s*\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );

  const rgbMatch = rgbCommaMatch || rgbSpaceMatch;
  if (rgbMatch) {
    const r = parseNumOrPercent(rgbMatch[1]!, 255);
    const g = parseNumOrPercent(rgbMatch[2]!, 255);
    const b = parseNumOrPercent(rgbMatch[3]!, 255);
    const a = parseAlpha(rgbMatch[4]);
    return Color.fromRgb(r, g, b, a);
  }

  // Try hsl/hsla
  // Supports both comma-separated (legacy) and space-separated (modern)
  const hslCommaMatch = trimmed.match(
    /^hsla?\s*\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s*,\s*([\d.]+%)\s*,\s*([\d.]+%)\s*(?:,\s*([\d.]+%?))?\)$/
  );
  const hslSpaceMatch = trimmed.match(
    /^hsla?\s*\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s+([\d.]+%)\s+([\d.]+%)\s*(?:\/\s*([\d.]+%?))?\)$/
  );

  const hslMatch = hslCommaMatch || hslSpaceMatch;
  if (hslMatch) {
    const h = parseDegrees(hslMatch[1]!);
    const s = parseFloat(hslMatch[2]!) / 100;
    const l = parseFloat(hslMatch[3]!) / 100;
    const a = parseAlpha(hslMatch[4]);
    return Color.create('hsl', [h, s, l], a);
  }

  // --- CSS Color Level 4 formats ---

  // Try color() function: color(space R G B) or color(space R G B / A)
  const colorFnMatch = trimmed.match(
    /^color\(\s*([\w-]+)\s+([\d.e+-]+%?)\s+([\d.e+-]+%?)\s+([\d.e+-]+%?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (colorFnMatch) {
    const spaceName = colorFnMatch[1]!;
    const mappedSpace = COLOR_FUNCTION_SPACE_MAP[spaceName];
    if (!mappedSpace) {
      throw new ColorParseError(
        input,
        `Unsupported color space in color() function: "${spaceName}"`
      );
    }
    const c1 = parseNumOrPercent(colorFnMatch[2]!, 1);
    const c2 = parseNumOrPercent(colorFnMatch[3]!, 1);
    const c3 = parseNumOrPercent(colorFnMatch[4]!, 1);
    const a = parseAlpha(colorFnMatch[5]);
    return Color.create(mappedSpace, [c1, c2, c3], a);
  }

  // Try oklch(): oklch(L C H) or oklch(L C H / A)
  // L: 0-1 or percentage; C: 0-0.4 or percentage (100% = 0.4); H: angle
  const oklchMatch = trimmed.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|grad|turn)?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (oklchMatch) {
    const l = parseNumOrPercent(oklchMatch[1]!, 1);
    const c = parseNumOrPercent(oklchMatch[2]!, 0.4);
    const h = parseDegrees(oklchMatch[3]!);
    const a = parseAlpha(oklchMatch[4]);
    return Color.create('oklch', [l, c, h], a);
  }

  // Try oklab(): oklab(L a b) or oklab(L a b / A)
  // L: 0-1 or percentage; a: -0.4 to 0.4; b: -0.4 to 0.4
  const oklabMatch = trimmed.match(
    /^oklab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (oklabMatch) {
    const l = parseNumOrPercent(oklabMatch[1]!, 1);
    const aComp = parseNumOrPercent(oklabMatch[2]!, 0.4);
    const b = parseNumOrPercent(oklabMatch[3]!, 0.4);
    const alpha = parseAlpha(oklabMatch[4]);
    return Color.create('oklab', [l, aComp, b], alpha);
  }

  // Try lab(): lab(L a b) or lab(L a b / A)
  // L: 0-100; a: unbounded (typically -128 to 127, 100% = 125); b: unbounded (100% = 125)
  const labMatch = trimmed.match(
    /^lab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (labMatch) {
    const l = parseNumOrPercent(labMatch[1]!, 100);
    const aComp = parseNumOrPercent(labMatch[2]!, 125);
    const b = parseNumOrPercent(labMatch[3]!, 125);
    const alpha = parseAlpha(labMatch[4]);
    return Color.create('lab', [l, aComp, b], alpha);
  }

  // Try lch(): lch(L C H) or lch(L C H / A)
  // L: 0-100; C: 0-150 (unbounded in theory); H: angle
  const lchMatch = trimmed.match(
    /^lch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|grad|turn)?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (lchMatch) {
    const l = parseNumOrPercent(lchMatch[1]!, 100);
    const c = parseNumOrPercent(lchMatch[2]!, 150);
    const h = parseDegrees(lchMatch[3]!);
    const a = parseAlpha(lchMatch[4]);
    return Color.create('lch', [l, c, h], a);
  }

  // Try hwb(): hwb(H W B) or hwb(H W B / A)
  // H: angle; W: 0-1 or percentage; B: 0-1 or percentage
  const hwbMatch = trimmed.match(
    /^hwb\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s+([\d.]+%?)\s+([\d.]+%?)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (hwbMatch) {
    const h = parseDegrees(hwbMatch[1]!);
    const w = parseNumOrPercent(hwbMatch[2]!, 1);
    const b = parseNumOrPercent(hwbMatch[3]!, 1);
    const a = parseAlpha(hwbMatch[4]);
    return Color.create('hwb', [h, w, b], a);
  }

  throw new ColorParseError(input);
}

/**
 * Formats a color for output.
 */
export function formatColor(color: Color): {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  alpha: number;
} {
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
