import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { PaletteService } from '../../../services/PaletteService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { ContrastService } from '../../../services/ContrastService.js';
import { Color } from '../../../domain/values/Color.js';
import type { HarmonyType } from '../../../domain/interfaces/IHarmonyAlgorithm.js';

const paletteService = new PaletteService();
const conversionService = new ConversionService();

export const generatePaletteSchema = z.object({
  baseColor: z.string().describe('Primary brand color'),
  style: z
    .enum([
      'minimal',
      'vibrant',
      'muted',
      'professional',
      'warm',
      'cool',
      'pastel',
      'earth',
      'jewel',
      'neon',
    ])
    .optional()
    .default('professional')
    .describe('Palette style'),
  harmony: z
    .enum([
      'analogous',
      'triadic',
      'tetradic',
      'complementary',
      'split-complementary',
      'monochromatic',
    ])
    .optional()
    .describe('Force a specific harmony algorithm (overrides style)'),
  includeNeutrals: z.boolean().optional().default(true).describe('Include neutral colors (grays)'),
});

export type GeneratePaletteInput = z.infer<typeof generatePaletteSchema>;

function generateSemanticColor(
  roleHue: number,
  baseColor: Color,
  style: string,
  adjustments: { desaturate?: number; saturate?: number; lighten?: number; darken?: number }
): {
  base: string;
  light: string;
  dark: string;
  onBase: string;
} {
  // Standard starting values for semantic colors (OKLCH)
  // These provide good visibility and recognition
  let l = 0.6;
  let c = 0.18;
  const h = roleHue;

  // Adjust starting values based on hue perception
  if (roleHue >= 80 && roleHue <= 100) {
    // Yellow/Amber needs more lightness
    l = 0.82;
    c = 0.15;
  } else if (roleHue >= 130 && roleHue <= 160) {
    // Green can be lighter
    l = 0.65;
  }

  // Apply style-based adjustments
  if (adjustments.desaturate) c = Math.max(0.05, c - c * adjustments.desaturate); // Don't lose all color
  if (adjustments.saturate) c = Math.min(0.37, c + c * adjustments.saturate);
  if (adjustments.lighten) l = Math.min(0.95, l + (1 - l) * adjustments.lighten);
  if (adjustments.darken) l = Math.max(0.2, l - l * adjustments.darken);

  // Harmonize with base color:
  // Shift hue very slightly towards base hue (max 5 degrees) to blend better
  const baseOklch = conversionService.convert(baseColor, 'oklch');
  const [, , baseH] = baseOklch.components as [number, number, number];

  // Calculate shortest path to base hue
  let hueDiff = baseH - h;
  if (hueDiff > 180) hueDiff -= 360;
  if (hueDiff < -180) hueDiff += 360;

  // Apply subtle hue shift (max 5 degrees)
  const shiftAmount = Math.max(-5, Math.min(5, hueDiff * 0.1));
  const harmonizedHue = h + shiftAmount;

  // Create the main semantic color
  const base = Color.create('oklch', [l, c, harmonizedHue], 1);
  const baseSrgb = conversionService.convert(base, 'srgb');

  // Generate variants relative to the NEW adjusted base
  const light = Color.create('oklch', [Math.min(0.96, l + 0.35), c * 0.4, harmonizedHue], 1);
  const lightSrgb = conversionService.convert(light, 'srgb');

  const dark = Color.create('oklch', [Math.max(0.25, l - 0.3), c, harmonizedHue], 1);
  const darkSrgb = conversionService.convert(dark, 'srgb');

  // Black or white text on the base
  const contrastSvc = new ContrastService();
  const onBase = contrastSvc.suggestForeground(baseSrgb);
  const onBaseSrgb = conversionService.convert(onBase, 'srgb');

  return {
    base: baseSrgb.toHex(),
    light: lightSrgb.toHex(),
    dark: darkSrgb.toHex(),
    onBase: onBaseSrgb.toHex(),
  };
}

export async function generatePalette(input: GeneratePaletteInput) {
  const baseColor = parseColor(input.baseColor);

  // Generate based on style
  let harmonyType: HarmonyType;
  let adjustments: { desaturate?: number; saturate?: number; lighten?: number; darken?: number } =
    {};

  switch (input.style) {
    case 'minimal':
      harmonyType = 'monochromatic';
      adjustments = { desaturate: 0.3 };
      break;
    case 'vibrant':
      harmonyType = 'triadic';
      break;
    case 'muted':
      harmonyType = 'analogous';
      adjustments = { desaturate: 0.2 };
      break;
    case 'warm':
      harmonyType = 'analogous';
      adjustments = {};
      break;
    case 'cool':
      harmonyType = 'analogous';
      adjustments = {};
      break;
    case 'pastel':
      harmonyType = 'triadic';
      adjustments = { desaturate: 0.4, lighten: 0.3 };
      break;
    case 'earth':
      harmonyType = 'analogous';
      adjustments = { desaturate: 0.5, darken: 0.15 };
      break;
    case 'jewel':
      harmonyType = 'tetradic';
      adjustments = { darken: 0.15, saturate: 0.2 };
      break;
    case 'neon':
      harmonyType = 'split-complementary';
      adjustments = { saturate: 0.4, lighten: 0.15 };
      break;
    case 'professional':
    default:
      harmonyType = 'split-complementary';
      adjustments = { desaturate: 0.1 };
      break;
  }

  // Generate harmony
  let harmony = paletteService.generateHarmony(baseColor, input.harmony || harmonyType);

  // For warm/cool styles, shift harmony colors into the target hue range
  if (input.style === 'warm' || input.style === 'cool') {
    const targetHueCenter = input.style === 'warm' ? 30 : 220;
    const hueRange = 60; // +/-30 degrees from center
    const baseOklchForShift = conversionService.convert(baseColor, 'oklch');
    const [, , baseHForShift] = baseOklchForShift.components as [number, number, number];

    harmony = harmony.map((color) => {
      const oklch = conversionService.convert(color, 'oklch');
      const [l, c] = oklch.components as [number, number, number];
      const colorH = oklch.components[2] as number;
      const hueDelta = ((colorH - baseHForShift + 540) % 360) - 180;
      const mappedHue = (targetHueCenter + hueDelta * (hueRange / 180) + 360) % 360;

      return conversionService.convert(
        Color.create('oklch', [l, c, mappedHue], color.alpha),
        'srgb'
      );
    });
  }

  // Apply style adjustments
  const colors = harmony.colors.map((color, index) => {
    let adjusted = color;
    if (Object.keys(adjustments).length > 0) {
      adjusted = paletteService.adjustColor(color, adjustments);
    }
    const srgb = conversionService.convert(adjusted, 'srgb');
    const cmyk = conversionService.convert(adjusted, 'cmyk');
    const [c, m, y, k] = cmyk.components as [number, number, number, number];

    return {
      role: getRoleForIndex(index, harmony.colors.length),
      hex: srgb.toHex(),
      cmyk: {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
      },
    };
  });

  // Generate neutrals if requested
  let neutrals: { role: string; hex: string }[] | undefined;
  if (input.includeNeutrals) {
    const baseOklch = conversionService.convert(baseColor, 'oklch');
    const [, , h] = baseOklch.components as [number, number, number];

    neutrals = [
      { role: 'background', hex: '#FFFFFF' },
      { role: 'surface', hex: '#F8F9FA' },
      { role: 'border', hex: '#DEE2E6' },
      { role: 'muted', hex: '#6C757D' },
      { role: 'foreground', hex: '#212529' },
    ];

    // Tint neutrals slightly with base hue for cohesion
    neutrals = neutrals.map((n) => {
      const color = parseColor(n.hex);
      const oklch = conversionService.convert(color, 'oklch');
      const [l, ,] = oklch.components as [number, number, number];

      // Add very subtle chroma with base hue
      const tinted = conversionService.convert(color.withComponents([l, 0.005, h]), 'srgb');
      return {
        role: n.role,
        hex: l > 0.9 || l < 0.2 ? n.hex : tinted.toHex(), // Keep pure white/black
      };
    });
  }

  // Generate scale for primary color
  const scale = paletteService.generateScale(baseColor);
  const scaleColors = [...scale.steps.entries()].map(([step, color]) => ({
    step,
    hex: conversionService.convert(color, 'srgb').toHex(),
  }));

  const baseSrgb = conversionService.convert(baseColor, 'srgb');

  // Generate semantic roles harmonized with the style
  const semanticRoles = {
    error: generateSemanticColor(29, baseColor, input.style, adjustments), // Red
    success: generateSemanticColor(142, baseColor, input.style, adjustments), // Green
    warning: generateSemanticColor(85, baseColor, input.style, adjustments), // Amber
    info: generateSemanticColor(240, baseColor, input.style, adjustments), // Blue
  };

  // Generate exports
  const primaryHex = colors[0]?.hex || baseSrgb.toHex();
  const secondaryHex = colors[1]?.hex || primaryHex;
  const accentHex = colors[2]?.hex || primaryHex;

  const exports = {
    css: `:root {
  --primary: ${primaryHex};
  --secondary: ${secondaryHex};
  --accent: ${accentHex};
  --background: ${neutrals?.[0]?.hex || '#FFFFFF'};
  --surface: ${neutrals?.[1]?.hex || '#F8F9FA'};
  --text: ${neutrals?.[4]?.hex || '#212529'};
  --error: ${semanticRoles.error.base};
  --success: ${semanticRoles.success.base};
  --warning: ${semanticRoles.warning.base};
  --info: ${semanticRoles.info.base};
}`,
    scss: `$primary: ${primaryHex};
$secondary: ${secondaryHex};
$accent: ${accentHex};
$background: ${neutrals?.[0]?.hex || '#FFFFFF'};
$surface: ${neutrals?.[1]?.hex || '#F8F9FA'};
$text: ${neutrals?.[4]?.hex || '#212529'};
$error: ${semanticRoles.error.base};
$success: ${semanticRoles.success.base};
$warning: ${semanticRoles.warning.base};
$info: ${semanticRoles.info.base};`,
    tailwind: `colors: {
  primary: '${primaryHex}',
  secondary: '${secondaryHex}',
  accent: '${accentHex}',
  background: '${neutrals?.[0]?.hex || '#FFFFFF'}',
  surface: '${neutrals?.[1]?.hex || '#F8F9FA'}',
  text: '${neutrals?.[4]?.hex || '#212529'}',
  error: '${semanticRoles.error.base}',
  success: '${semanticRoles.success.base}',
  warning: '${semanticRoles.warning.base}',
  info: '${semanticRoles.info.base}',
}`,
  };

  return {
    baseColor: {
      input: input.baseColor,
      hex: baseSrgb.toHex(),
    },
    style: input.style,
    harmony: input.harmony || harmonyType,
    palette: {
      primary: colors[0]?.hex,
      secondary: colors[1]?.hex,
      accent: colors[2]?.hex,
      allColors: colors,
    },
    scale: {
      description: 'Tailwind-style lightness scale for the primary color',
      colors: scaleColors,
    },
    neutrals: neutrals ?? undefined,
    semantic: semanticRoles,
    exports,
  };
}

function getRoleForIndex(index: number, _total: number): string {
  if (index === 0) return 'primary';
  if (index === 1) return 'secondary';
  if (index === 2) return 'accent';
  if (index === 3) return 'accent2';
  return `color${index + 1}`;
}
