import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ColorSpaceSchema } from '../schemas.js';
import { ConversionService } from '../../../services/ConversionService.js';
import type { ColorSpaceType } from '../../../domain/values/ColorSpaceType.js';

const conversionService = new ConversionService();

export const convertColorSchema = z.object({
  color: z.string().describe('Color value (hex, RGB, or named color)'),
  targetSpace: ColorSpaceSchema.describe('Target color space for conversion'),
});

export type ConvertColorInput = z.infer<typeof convertColorSchema>;

export async function convertColor(input: ConvertColorInput) {
  const color = parseColor(input.color);
  const converted = conversionService.convert(color, input.targetSpace as ColorSpaceType);

  // Format output based on target space
  const components = converted.components;
  let formatted: Record<string, number> = {};

  switch (input.targetSpace) {
    case 'srgb':
    case 'linear-srgb':
    case 'display-p3':
      formatted = {
        r: Math.round((components[0] ?? 0) * 255),
        g: Math.round((components[1] ?? 0) * 255),
        b: Math.round((components[2] ?? 0) * 255),
      };
      break;
    case 'xyz-d65':
    case 'xyz-d50':
      formatted = {
        X: Math.round((components[0] ?? 0) * 10000) / 10000,
        Y: Math.round((components[1] ?? 0) * 10000) / 10000,
        Z: Math.round((components[2] ?? 0) * 10000) / 10000,
      };
      break;
    case 'lab':
      formatted = {
        L: Math.round((components[0] ?? 0) * 100) / 100,
        a: Math.round((components[1] ?? 0) * 100) / 100,
        b: Math.round((components[2] ?? 0) * 100) / 100,
      };
      break;
    case 'lch':
      formatted = {
        L: Math.round((components[0] ?? 0) * 100) / 100,
        C: Math.round((components[1] ?? 0) * 100) / 100,
        H: Math.round((components[2] ?? 0) * 100) / 100,
      };
      break;
    case 'oklab':
      formatted = {
        L: Math.round((components[0] ?? 0) * 1000) / 1000,
        a: Math.round((components[1] ?? 0) * 1000) / 1000,
        b: Math.round((components[2] ?? 0) * 1000) / 1000,
      };
      break;
    case 'oklch':
      formatted = {
        L: Math.round((components[0] ?? 0) * 1000) / 1000,
        C: Math.round((components[1] ?? 0) * 1000) / 1000,
        H: Math.round((components[2] ?? 0) * 100) / 100,
      };
      break;
    case 'hsl':
      formatted = {
        h: Math.round(components[0] ?? 0),
        s: Math.round((components[1] ?? 0) * 100),
        l: Math.round((components[2] ?? 0) * 100),
      };
      break;
    case 'hsv':
      formatted = {
        h: Math.round(components[0] ?? 0),
        s: Math.round((components[1] ?? 0) * 100),
        v: Math.round((components[2] ?? 0) * 100),
      };
      break;
    case 'hwb':
      formatted = {
        h: Math.round(components[0] ?? 0),
        w: Math.round((components[1] ?? 0) * 100),
        b: Math.round((components[2] ?? 0) * 100),
      };
      break;
    case 'cmyk':
      formatted = {
        c: Math.round((components[0] ?? 0) * 100),
        m: Math.round((components[1] ?? 0) * 100),
        y: Math.round((components[2] ?? 0) * 100),
        k: Math.round((components[3] ?? 0) * 100),
      };
      break;
  }

  // Also include hex if convertible to sRGB
  let hex: string | undefined;
  try {
    const srgb = conversionService.convert(converted, 'srgb');
    hex = srgb.toHex();
  } catch {
    // Color might be out of sRGB gamut
  }

  return {
    input: input.color,
    targetSpace: input.targetSpace,
    components: formatted,
    rawComponents: components.map(c => Math.round(c * 10000) / 10000),
    alpha: converted.alpha,
    hex,
    cssString: converted.toCssString(),
  };
}
