import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';

const conversionService = new ConversionService();

export const generateDesignTokensSchema = z.object({
  colors: z
    .array(
      z.object({
        name: z.string().describe('Token name, e.g., "primary-500"'),
        value: z.string().describe('Color value as hex or CSS name'),
      })
    )
    .describe('Colors to include as design tokens'),
  prefix: z.string().optional().default('color').describe('Token name prefix'),
  format: z
    .enum(['w3c', 'css-variables', 'tailwind', 'ios-swift', 'android-xml', 'scss', 'figma-json'])
    .optional()
    .default('w3c')
    .describe('Output format'),
});

export type GenerateDesignTokensInput = z.infer<typeof generateDesignTokensSchema>;

/**
 * Generates design tokens from a list of named colors.
 * All colors are normalized to sRGB hex for output.
 */
export async function generateDesignTokens(input: GenerateDesignTokensInput) {
  const prefix = input.prefix ?? 'color';
  const format = input.format ?? 'w3c';

  // Parse and convert all colors to sRGB hex
  const resolvedColors = input.colors.map((entry) => {
    const parsed = parseColor(entry.value);
    const srgb = conversionService.convert(parsed, 'srgb');
    const clamped = conversionService.clampToGamut(srgb);
    const [r, g, b] = clamped.components;
    return {
      name: entry.name,
      hex: clamped.toHex(),
      rgb: { r: r!, g: g!, b: b! },
      alpha: clamped.alpha,
    };
  });

  switch (format) {
    case 'w3c':
      return buildW3CTokens(resolvedColors, prefix);
    case 'css-variables':
      return buildCSSVariables(resolvedColors, prefix);
    case 'tailwind':
      return buildTailwindConfig(resolvedColors);
    case 'ios-swift':
      return buildSwiftTokens(resolvedColors);
    case 'android-xml':
      return buildAndroidTokens(resolvedColors);
    case 'scss':
      return buildSCSSVariables(resolvedColors, prefix);
    case 'figma-json':
      return buildFigmaTokens(resolvedColors);
    default:
      return buildW3CTokens(resolvedColors, prefix);
  }
}

/**
 * Builds W3C Design Token Community Group format output.
 */
function buildW3CTokens(
  colors: { name: string; hex: string }[],
  prefix: string
): Record<string, unknown> {
  const tokenGroup: Record<string, { $type: string; $value: string }> = {};
  for (const color of colors) {
    tokenGroup[color.name] = {
      $type: 'color',
      $value: color.hex,
    };
  }

  return {
    format: 'w3c',
    tokens: {
      $schema: 'https://design-tokens.github.io/community-group/format/',
      [prefix]: tokenGroup,
    },
  };
}

/**
 * Builds CSS custom properties (variables) output.
 */
function buildCSSVariables(
  colors: { name: string; hex: string }[],
  prefix: string
): { format: string; css: string } {
  const lines = colors.map((color) => `  --${prefix}-${color.name}: ${color.hex};`);
  const css = `:root {\n${lines.join('\n')}\n}`;

  return {
    format: 'css-variables',
    css,
  };
}

/**
 * Builds Tailwind CSS color configuration output.
 */
function buildTailwindConfig(colors: { name: string; hex: string }[]): {
  format: string;
  tailwind: { colors: Record<string, string> };
} {
  const colorMap: Record<string, string> = {};
  for (const color of colors) {
    colorMap[color.name] = color.hex;
  }

  return {
    format: 'tailwind',
    tailwind: {
      colors: colorMap,
    },
  };
}

/**
 * Builds iOS Swift Color tokens.
 */
function buildSwiftTokens(
  colors: { name: string; rgb: { r: number; g: number; b: number }; alpha: number }[]
): {
  format: string;
  swift: string;
} {
  const lines = colors.map((c) => {
    const name = c.name.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    // Swift Color uses 0-1 doubles
    return `    static let ${name} = Color(red: ${c.rgb.r.toFixed(3)}, green: ${c.rgb.g.toFixed(3)}, blue: ${c.rgb.b.toFixed(3)}, opacity: ${c.alpha})`;
  });

  const swift = `import SwiftUI

struct AppColors {
${lines.join('\n')}
}`;

  return { format: 'ios-swift', swift };
}

/**
 * Builds Android XML Color resources.
 */
function buildAndroidTokens(colors: { name: string; hex: string }[]): {
  format: string;
  xml: string;
} {
  const lines = colors.map((c) => {
    const name = c.name.toLowerCase().replace(/[-.\s]/g, '_');
    return `    <color name="${name}">${c.hex}</color>`;
  });

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
${lines.join('\n')}
</resources>`;

  return { format: 'android-xml', xml };
}

/**
 * Builds SCSS variables.
 */
function buildSCSSVariables(
  colors: { name: string; hex: string }[],
  prefix: string
): {
  format: string;
  scss: string;
} {
  const lines = colors.map((c) => `$${prefix}-${c.name}: ${c.hex};`);
  return { format: 'scss', scss: lines.join('\n') };
}

/**
 * Builds simple Figma-compatible JSON (Nested object).
 */
function buildFigmaTokens(colors: { name: string; hex: string }[]): {
  format: string;
  json: Record<string, any>;
} {
  // Simple flat mapping for now, widely compatible
  const json: Record<string, { value: string; type: string }> = {};
  for (const c of colors) {
    json[c.name] = { value: c.hex, type: 'color' };
  }
  return { format: 'figma-json', json };
}
