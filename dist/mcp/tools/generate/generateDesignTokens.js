import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';
const conversionService = new ConversionService();
export const generateDesignTokensSchema = z.object({
    colors: z
        .array(z.object({
        name: z.string().describe('Token name, e.g., "primary-500"'),
        value: z.string().describe('Color value as hex or CSS name'),
    }))
        .describe('Colors to include as design tokens'),
    prefix: z.string().optional().default('color').describe('Token name prefix'),
    format: z
        .enum(['w3c', 'css-variables', 'tailwind'])
        .optional()
        .default('w3c')
        .describe('Output format'),
});
/**
 * Generates design tokens from a list of named colors in one of three output formats:
 * W3C Design Token Format, CSS custom properties, or Tailwind CSS configuration.
 * All colors are normalized to sRGB hex for output.
 */
export async function generateDesignTokens(input) {
    const prefix = input.prefix ?? 'color';
    const format = input.format ?? 'w3c';
    // Parse and convert all colors to sRGB hex
    const resolvedColors = input.colors.map((entry) => {
        const parsed = parseColor(entry.value);
        const srgb = conversionService.convert(parsed, 'srgb');
        const clamped = conversionService.clampToGamut(srgb);
        return {
            name: entry.name,
            hex: clamped.toHex(),
        };
    });
    if (format === 'w3c') {
        return buildW3CTokens(resolvedColors, prefix);
    }
    if (format === 'css-variables') {
        return buildCSSVariables(resolvedColors, prefix);
    }
    // format === 'tailwind'
    return buildTailwindConfig(resolvedColors);
}
/**
 * Builds W3C Design Token Community Group format output.
 */
function buildW3CTokens(colors, prefix) {
    const tokenGroup = {};
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
function buildCSSVariables(colors, prefix) {
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
function buildTailwindConfig(colors) {
    const colorMap = {};
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
//# sourceMappingURL=generateDesignTokens.js.map