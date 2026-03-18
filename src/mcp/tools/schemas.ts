import { z } from 'zod';

/**
 * Common schema for color input (accepts hex, rgb, or named colors).
 */
export const ColorInputSchema = z
  .string()
  .describe('Color value as hex (#RGB, #RRGGBB), CSS color name, or rgb(r,g,b)');

/**
 * Schema for color space type.
 */
export const ColorSpaceSchema = z
  .enum([
    'srgb',
    'linear-srgb',
    'display-p3',
    'rec2020',
    'prophoto-rgb',
    'acescg',
    'xyz-d65',
    'xyz-d50',
    'lab',
    'lch',
    'oklab',
    'oklch',
    'hsl',
    'hsv',
    'hwb',
    'cmyk',
  ])
  .describe('Target color space');

/**
 * Schema for harmony types.
 */
export const HarmonyTypeSchema = z
  .enum([
    'complementary',
    'analogous',
    'triadic',
    'split-complementary',
    'tetradic',
    'square',
    'monochromatic',
  ])
  .describe('Type of color harmony');

/**
 * Schema for Delta-E methods.
 */
export const DeltaEMethodSchema = z
  .enum(['CIE76', 'CIE94', 'CIEDE2000'])
  .describe('Delta-E calculation method');

/**
 * Schema for CVD types.
 */
export const CVDTypeSchema = z
  .enum([
    'protanopia',
    'protanomaly',
    'deuteranopia',
    'deuteranomaly',
    'tritanopia',
    'tritanomaly',
    'achromatopsia',
    'achromatomaly',
  ])
  .describe('Type of color vision deficiency');

/**
 * Schema for WCAG levels.
 */
export const WCAGLevelSchema = z.enum(['AA', 'AAA']).describe('WCAG conformance level');

/**
 * Schema for text size.
 */
export const TextSizeSchema = z.enum(['normal', 'large']).describe('Text size category');

/**
 * Schema for culture regions.
 */
export const CultureRegionSchema = z
  .enum([
    'western',
    'eastAsian',
    'southAsian',
    'middleEastern',
    'african',
    'latinAmerican',
    'indigenous',
  ])
  .describe('Cultural region');

/**
 * Schema for meaning contexts.
 */
export const MeaningContextSchema = z
  .enum(['general', 'business', 'wedding', 'mourning'])
  .describe('Context for color meaning');
