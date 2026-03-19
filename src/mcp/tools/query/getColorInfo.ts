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
  let color: Color;
  let searchResults: { name: string; hex: string }[] | undefined;
  let note: string | undefined;

  try {
    color = parseColor(input.color);
  } catch (error) {
    // If parsing fails, try searching named colors
    const results = namedColors.search(input.color);
    if (results.length > 0) {
      // Use the first match
      const bestMatch = results[0]!;
      color = bestMatch.color;
      searchResults = results.slice(0, 5).map((c) => ({ name: c.name, hex: c.hex }));
      note = `Input "${input.color}" was not a valid color format. Used closest named color "${bestMatch.name}".`;
    } else {
      throw error;
    }
  }

  // Get various representations
  const srgb = conversionService.convert(color, 'srgb');
  const hsl = conversionService.convert(color, 'hsl');
  const hsv = conversionService.convert(color, 'hsv');
  const lab = conversionService.convert(color, 'lab');
  const lch = conversionService.convert(color, 'lch');
  const oklab = conversionService.convert(color, 'oklab');
  const oklch = conversionService.convert(color, 'oklch');
  const cmyk = conversionService.convert(color, 'cmyk');

  // Get closest named color
  const closestNamed = namedColors.findClosest(srgb);
  const closestXkcd = xkcdColors.findClosest(srgb);

  // Calculate luminance
  const luminance = contrastService.calculateLuminance(srgb);

  // Determine if color is light or dark
  const isLight = luminance > 0.179;

  // Calculate contrast with white and black
  const white = Color.fromHex('#FFFFFF');
  const black = Color.fromHex('#000000');
  const checkWhite = contrastService.checkContrast(srgb, white);
  const checkBlack = contrastService.checkContrast(srgb, black);

  // APCA contrast with white and black
  const apcaWithWhite = apcaService.calculateAPCA(srgb, white);
  const apcaWithBlack = apcaService.calculateAPCA(srgb, black);
  const apcaSuggested = apcaService.suggestTextColor(srgb);
  const apcaSuggestedSrgb = conversionService.convert(apcaSuggested, 'srgb');

  // Estimated color temperature
  const tempResult = temperatureService.colorToTemperature(srgb);

  const [r, g, b] = srgb.toRgbArray();
  const [h, s, l] = hsl.components as [number, number, number];
  const [hv, sv, v] = hsv.components as [number, number, number];
  const [L, a, labB] = lab.components as [number, number, number];
  const [lchL, lchC, lchH] = lch.components as [number, number, number];
  const [okL, okA, okB] = oklab.components as [number, number, number];
  const [oklchL, oklchC, oklchH] = oklch.components as [number, number, number];
  const [c, m, y, k] = cmyk.components as [number, number, number, number];

  return {
    input: input.color,
    formats: {
      hex: srgb.toHex(),
      hexWithAlpha: srgb.toHex(true),
      rgb: { r, g, b },
      rgbString: `rgb(${r}, ${g}, ${b})`,
      cmyk: {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
        string: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`,
      },
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
      contrastWithWhite: {
        ratio: Math.round(checkWhite.ratio * 100) / 100,
        AA: checkWhite.passes.AA.normal ? 'pass' : 'fail',
        AAA: checkWhite.passes.AAA.normal ? 'pass' : 'fail',
        NonText: checkWhite.passes.AA.ui ? 'pass' : 'fail', // 3:1 check
      },
      contrastWithBlack: {
        ratio: Math.round(checkBlack.ratio * 100) / 100,
        AA: checkBlack.passes.AA.normal ? 'pass' : 'fail',
        AAA: checkBlack.passes.AAA.normal ? 'pass' : 'fail',
        NonText: checkBlack.passes.AA.ui ? 'pass' : 'fail', // 3:1 check
      },
      apca: {
        suggestedTextColor: apcaSuggestedSrgb.toHex(),
        contrastWithWhite: {
          Lc: Math.round(apcaWithWhite.Lc * 100) / 100,
          rating: apcaWithWhite.interpretation,
        },
        contrastWithBlack: {
          Lc: Math.round(apcaWithBlack.Lc * 100) / 100,
          rating: apcaWithBlack.interpretation,
        },
      },
      estimatedTemperature: {
        kelvin: tempResult.estimatedKelvin,
        description: tempResult.description,
        isNearBlackbody: tempResult.isOnPlanckianLocus,
      },
    },
    closestNamedColor: {
      css: {
        name: closestNamed.color.name,
        hex: closestNamed.color.hex,
        deltaE: Math.round(closestNamed.deltaE * 100) / 100,
        match:
          closestNamed.deltaE < 1 ? 'exact' : closestNamed.deltaE < 2 ? 'close' : 'approximate',
      },
      xkcd: {
        name: closestXkcd.color.name,
        hex: closestXkcd.color.hex,
        deltaE: Math.round(closestXkcd.deltaE * 100) / 100,
      },
    },
    search: searchResults
      ? {
          query: input.color,
          matches: searchResults,
          note,
        }
      : undefined,
    alpha: srgb.alpha,
  };
}
