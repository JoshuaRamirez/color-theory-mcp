/**
 * Enumeration of supported color spaces.
 *
 * Organization:
 * - RGB-family: sRGB, Linear RGB, Display P3
 * - XYZ-based: XYZ-D65, XYZ-D50
 * - Perceptual uniform: Lab, LCH, Oklab, Oklch
 * - Artist-intuitive: HSL, HSV, HWB
 * - Print: CMYK
 */
export type ColorSpaceType =
  | 'srgb'
  | 'linear-srgb'
  | 'display-p3'
  | 'xyz-d65'
  | 'xyz-d50'
  | 'lab'
  | 'lch'
  | 'oklab'
  | 'oklch'
  | 'hsl'
  | 'hsv'
  | 'hwb'
  | 'cmyk';

export const COLOR_SPACE_COMPONENTS: Record<ColorSpaceType, readonly string[]> = {
  'srgb': ['r', 'g', 'b'],
  'linear-srgb': ['r', 'g', 'b'],
  'display-p3': ['r', 'g', 'b'],
  'xyz-d65': ['x', 'y', 'z'],
  'xyz-d50': ['x', 'y', 'z'],
  'lab': ['l', 'a', 'b'],
  'lch': ['l', 'c', 'h'],
  'oklab': ['l', 'a', 'b'],
  'oklch': ['l', 'c', 'h'],
  'hsl': ['h', 's', 'l'],
  'hsv': ['h', 's', 'v'],
  'hwb': ['h', 'w', 'b'],
  'cmyk': ['c', 'm', 'y', 'k'],
} as const;

export const COLOR_SPACE_RANGES: Record<ColorSpaceType, readonly { min: number; max: number }[]> = {
  'srgb': [{ min: 0, max: 1 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
  'linear-srgb': [{ min: 0, max: 1 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
  'display-p3': [{ min: 0, max: 1 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
  'xyz-d65': [{ min: 0, max: 0.95047 }, { min: 0, max: 1 }, { min: 0, max: 1.08883 }],
  'xyz-d50': [{ min: 0, max: 0.96422 }, { min: 0, max: 1 }, { min: 0, max: 0.82521 }],
  'lab': [{ min: 0, max: 100 }, { min: -128, max: 127 }, { min: -128, max: 127 }],
  'lch': [{ min: 0, max: 100 }, { min: 0, max: 150 }, { min: 0, max: 360 }],
  'oklab': [{ min: 0, max: 1 }, { min: -0.4, max: 0.4 }, { min: -0.4, max: 0.4 }],
  'oklch': [{ min: 0, max: 1 }, { min: 0, max: 0.4 }, { min: 0, max: 360 }],
  'hsl': [{ min: 0, max: 360 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
  'hsv': [{ min: 0, max: 360 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
  'hwb': [{ min: 0, max: 360 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
  'cmyk': [{ min: 0, max: 1 }, { min: 0, max: 1 }, { min: 0, max: 1 }, { min: 0, max: 1 }],
} as const;

export function isValidColorSpace(space: string): space is ColorSpaceType {
  return space in COLOR_SPACE_COMPONENTS;
}
