import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import {
  ThemeService,
  type TonalPalette,
  type MaterialTheme,
} from '../../../services/ThemeService.js';

const themeService = new ThemeService();

export const generateThemeSchema = z.object({
  seedColor: z.string().describe('Seed color for theme generation'),
  mode: z
    .enum(['light', 'dark', 'both'])
    .optional()
    .default('both')
    .describe('Theme mode to generate'),
});

export type GenerateThemeInput = z.infer<typeof generateThemeSchema>;

/**
 * Generates a Material Design 3 theme from a seed color.
 * Produces light and/or dark color roles and all six tonal palettes
 * (primary, secondary, tertiary, neutral, neutral-variant, error).
 */
export async function generateTheme(input: GenerateThemeInput) {
  const seedColor = parseColor(input.seedColor);
  const mode = input.mode ?? 'both';
  const theme = themeService.generateTheme(seedColor);

  const result: Record<string, unknown> = {
    seed: theme.seed,
    mode,
  };

  if (mode === 'light' || mode === 'both') {
    result.light = theme.light;
  }

  if (mode === 'dark' || mode === 'both') {
    result.dark = theme.dark;
  }

  result.palettes = serializePalettes(theme.palettes);

  // Generate exports
  const exports: Record<string, string> = {};

  // CSS Variables
  let css = ':root {\n';
  if (mode === 'light' || mode === 'both') {
    for (const [key, value] of Object.entries(theme.light)) {
      css += `  --md-sys-color-${key}: ${value};\n`;
    }
  }
  if (mode === 'dark' || mode === 'both') {
    const selector = mode === 'both' ? '\n@media (prefers-color-scheme: dark) {\n  :root' : '';
    css += selector === '' ? '' : selector + ' {\n';
    for (const [key, value] of Object.entries(theme.dark)) {
      css += `  ${selector ? '  ' : ''}--md-sys-color-${key}: ${value};\n`;
    }
    css += selector === '' ? '' : '  }\n}\n';
  }
  if (mode === 'light') css += '}\n';
  else if (mode === 'dark') css += '}\n';

  exports.css = css;

  // Tailwind
  // Flattening to a consistent structure usually involves "light" and "dark" prefixes
  // or just mapping the roles if usage is consistent.
  // For a theme generator, simple mapping is best.
  exports.tailwind = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        md: {
${Object.entries(theme.light)
  .map(([k]) => `          '${k}': 'var(--md-sys-color-${k})',`)
  .join('\n')}
        }
      }
    }
  }
}`;

  result.exports = exports;

  return result;
}

/**
 * Converts the Map-based TonalPalette entries into plain objects (tone -> hex string)
 * for JSON serialization.
 */
function serializePalettes(
  palettes: MaterialTheme['palettes']
): Record<string, Record<number, string>> {
  const serialized: Record<string, Record<number, string>> = {};

  for (const [name, palette] of Object.entries(palettes)) {
    serialized[name] = serializeTonalPalette(palette as TonalPalette);
  }

  return serialized;
}

/**
 * Converts a single TonalPalette's Map<number, Color> into a plain { tone: hex } object.
 */
function serializeTonalPalette(palette: TonalPalette): Record<number, string> {
  const toneMap: Record<number, string> = {};

  for (const [tone, color] of palette.tones.entries()) {
    toneMap[tone] = color.toHex();
  }

  return toneMap;
}
