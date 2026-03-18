import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { ContrastService } from '../../../services/ContrastService.js';
import { APCAService } from '../../../services/APCAService.js';
import { TemperatureService } from '../../../services/TemperatureService.js';
import { NamedColorsRepository } from '../../../data/NamedColorsRepository.js';
import { Color } from '../../../domain/values/Color.js';

const conversionService = new ConversionService();
const contrastService = new ContrastService();
const apcaService = new APCAService();
const temperatureService = new TemperatureService();
const namedColors = new NamedColorsRepository();
const xkcdColors = new NamedColorsRepository({ includeXkcd: true });

export const getColorInfoSchema = z.object({
  color: z.string().describe('Color value (hex, RGB, or named color)'),
});

export type GetColorInfoInput = z.infer<typeof getColorInfoSchema>;

export async function getColorInfo(input: GetColorInfoInput) {
  const color = parseColor(input.color);

  // Get various representations
  const srgb = conversionService.convert(color, 'srgb');
  const hsl = conversionService.convert(color, 'hsl');
  const hsv = conversionService.convert(color, 'hsv');
  const lab = conversionService.convert(color, 'lab');
  const lch = conversionService.convert(color, 'lch');
  const oklab = conversionService.convert(color, 'oklab');
  const oklch = conversionService.convert(color, 'oklch');

  // Get closest named color
  const closestNamed = namedColors.findClosest(srgb);

  // Calculate luminance
  const luminance = contrastService.calculateLuminance(srgb);

  // Determine if color is light or dark
  const isLight = luminance > 0.179;

  // Calculate contrast with white and black
  const white = Color.fromHex('#FFFFFF');
  const black = Color.fromHex('#000000');
  const contrastWithWhite = contrastService.calculateContrastRatio(srgb, white);
  const contrastWithBlack = contrastService.calculateContrastRatio(srgb, black);

  // APCA contrast with white and black
  const apcaWithWhite = apcaService.calculateAPCA(srgb, white);
  const apcaWithBlack = apcaService.calculateAPCA(srgb, black);
  const apcaSuggested = apcaService.suggestTextColor(srgb);
  const apcaSuggestedSrgb = conversionService.convert(apcaSuggested, 'srgb');

  // Closest XKCD color name
  const closestXkcd = xkcdColors.findClosest(srgb);

  // Estimated color temperature
  const tempResult = temperatureService.colorToTemperature(srgb);

  const [r, g, b] = srgb.toRgbArray();
  const [h, s, l] = hsl.components as [number, number, number];
  const [hv, sv, v] = hsv.components as [number, number, number];
  const [L, a, labB] = lab.components as [number, number, number];
  const [lchL, lchC, lchH] = lch.components as [number, number, number];
  const [okL, okA, okB] = oklab.components as [number, number, number];
  const [oklchL, oklchC, oklchH] = oklch.components as [number, number, number];

  return {
    input: input.color,
    formats: {
      hex: srgb.toHex(),
      hexWithAlpha: srgb.toHex(true),
      rgb: { r, g, b },
      rgbString: `rgb(${r}, ${g}, ${b})`,
      hsl: {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      },
      hslString: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      hsv: {
        h: Math.round(hv),
        s: Math.round(sv * 100),
        v: Math.round(v * 100),
      },
    },
    perceptual: {
      lab: {
        L: Math.round(L * 100) / 100,
        a: Math.round(a * 100) / 100,
        b: Math.round(labB * 100) / 100,
      },
      lch: {
        L: Math.round(lchL * 100) / 100,
        C: Math.round(lchC * 100) / 100,
        H: Math.round(lchH * 100) / 100,
      },
      oklab: {
        L: Math.round(okL * 1000) / 1000,
        a: Math.round(okA * 1000) / 1000,
        b: Math.round(okB * 1000) / 1000,
      },
      oklch: {
        L: Math.round(oklchL * 1000) / 1000,
        C: Math.round(oklchC * 1000) / 1000,
        H: Math.round(oklchH * 100) / 100,
      },
    },
    analysis: {
      luminance: Math.round(luminance * 10000) / 10000,
      isLight,
      suggestedTextColor: isLight ? '#000000' : '#FFFFFF',
      contrastWithWhite: Math.round(contrastWithWhite * 100) / 100,
      contrastWithBlack: Math.round(contrastWithBlack * 100) / 100,
      apca: {
        suggestedTextColor: apcaSuggestedSrgb.toHex(),
        contrastWithWhite: Math.round(apcaWithWhite.Lc * 100) / 100,
        contrastWithBlack: Math.round(apcaWithBlack.Lc * 100) / 100,
      },
      estimatedTemperature: {
        kelvin: tempResult.estimatedKelvin,
        description: tempResult.description,
        isNearBlackbody: tempResult.isOnPlanckianLocus,
      },
    },
    closestNamedColor: {
      css: {
        name: closestNamed.name,
        hex: closestNamed.hex,
      },
      xkcd: {
        name: closestXkcd.name,
        hex: closestXkcd.hex,
      },
    },
    alpha: srgb.alpha,
  };
}
