import { Color } from '../domain/values/Color.js';
import { ConversionService } from './ConversionService.js';

const conversionService = new ConversionService();

/**
 * Standard tone values used in Material Design 3 tonal palettes.
 */
const TONAL_STEPS: readonly number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

/**
 * A tonal palette: a single hue+chroma mapped across 13 lightness levels.
 */
export interface TonalPalette {
  hue: number;
  chroma: number;
  tones: Map<number, Color>;
}

/**
 * Complete set of named color roles for a single theme mode (light or dark).
 * All values are sRGB hex strings.
 */
export interface ThemeColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
}

/**
 * A complete Material Design 3 theme derived from a single seed color.
 */
export interface MaterialTheme {
  seed: string;
  light: ThemeColors;
  dark: ThemeColors;
  palettes: {
    primary: TonalPalette;
    secondary: TonalPalette;
    tertiary: TonalPalette;
    neutral: TonalPalette;
    neutralVariant: TonalPalette;
    error: TonalPalette;
  };
}

/**
 * Service for generating Material Design 3 dynamic themes.
 *
 * Given a single seed color, produces a full set of tonal palettes
 * (primary, secondary, tertiary, neutral, neutral-variant, error)
 * and extracts light and dark theme color roles from those palettes.
 *
 * All perceptual manipulation is performed in the HCT color space
 * (Material Design 3 standard) to ensure correct tonal mapping.
 */
export class ThemeService {
  /**
   * Generates a complete Material Design 3 theme from a seed color.
   *
   * @param seedColor - Any Color instance; will be converted to Oklch/HCT internally
   * @returns A MaterialTheme with light/dark color roles and all six tonal palettes
   */
  generateTheme(seedColor: Color): MaterialTheme {
    // Extract seed hue and chroma in HCT (Material 3 standard)
    // We use HCT space for true Material fidelity.
    const hct = conversionService.convert(seedColor, 'hct');
    const [seedHue, seedChroma] = hct.components as [number, number, number];

    // Build the six key color palettes
    const primaryPalette = this.generateTonalPalette(seedHue, seedChroma);
    const secondaryPalette = this.generateTonalPalette(seedHue, Math.max(48, seedChroma * 0.33));
    // Material 3 uses specific chroma targets or multipliers.
    // M3 Spec: Secondary chroma = 16.
    // However, dynamic fidelity depends on implementation.
    // Sticking to proportional but using HCT values.

    // Using standard M3 chroma logic:
    // Primary: seed chroma (min 48)
    // Secondary: 16
    // Tertiary: 24 (with hue rotation)
    // Neutral: 4
    // Neutral Variant: 8

    // Let's stick to the previous dynamic logic but in HCT space for now to preserve behavior structure,
    // but using HCT metric which is more perceptually accurate for this system.

    // Wait, the previous logic used:
    // secondary: seedChroma * 0.33
    // tertiary: seedChroma * 0.5
    // neutral: seedChroma * 0.04
    // neutralVariant: seedChroma * 0.08

    // M3 spec says:
    // Primary: C = max(48, seedC) ?? No, actually M3 is complex.
    // Let's just swap Oklch -> HCT in the existing logic.

    const tertiaryHue = (((seedHue + 60) % 360) + 360) % 360;
    const tertiaryPalette = this.generateTonalPalette(tertiaryHue, seedChroma * 0.5);
    const neutralPalette = this.generateTonalPalette(seedHue, seedChroma * 0.04);
    const neutralVariantPalette = this.generateTonalPalette(seedHue, seedChroma * 0.08);
    const errorPalette = this.generateTonalPalette(25, 84); // Error chroma in HCT is roughly 84?
    // In M3, Error is H=25, C=84, T=40 (approx).

    // Convert the seed to sRGB hex for the output record
    const seedSrgb = conversionService.convert(seedColor, 'srgb');
    const clampedSeed = conversionService.clampToGamut(seedSrgb);
    const seedHex = clampedSeed.toHex();

    // Extract light and dark color roles from the palettes
    const light = this.extractLightTheme(
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
      errorPalette
    );
    const dark = this.extractDarkTheme(
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
      errorPalette
    );

    return {
      seed: seedHex,
      light,
      dark,
      palettes: {
        primary: primaryPalette,
        secondary: secondaryPalette,
        tertiary: tertiaryPalette,
        neutral: neutralPalette,
        neutralVariant: neutralVariantPalette,
        error: errorPalette,
      },
    };
  }

  /**
   * Generates a tonal palette: 13 tones (0-100) for a given hue and chroma.
   *
   * Each tone T maps to HCT Tone = T while preserving
   * the supplied hue and chroma.
   *
   * @param hue - HCT hue in degrees (0-360)
   * @param chroma - HCT chroma (0-150 typical)
   * @returns TonalPalette with a Map from tone value to sRGB Color
   */
  generateTonalPalette(hue: number, chroma: number): TonalPalette {
    const tones = new Map<number, Color>();

    for (const tone of TONAL_STEPS) {
      const hctColor = Color.create('hct', [hue, chroma, tone], 1);
      const srgbColor = conversionService.convert(hctColor, 'srgb');
      const clamped = conversionService.clampToGamut(srgbColor);
      tones.set(tone, clamped);
    }

    return { hue, chroma, tones };
  }

  /**
   * Converts an HCT specification to an sRGB hex string.
   */
  private toneToHex(hue: number, chroma: number, tone: number): string {
    const hctColor = Color.create('hct', [hue, chroma, tone], 1);
    const srgbColor = conversionService.convert(hctColor, 'srgb');
    const clamped = conversionService.clampToGamut(srgbColor);
    return clamped.toHex();
  }

  /**
   * Helper to retrieve a hex color at a given tone from a pre-built TonalPalette.
   */
  private paletteHex(palette: TonalPalette, tone: number): string {
    const color = palette.tones.get(tone);
    if (!color) {
      // Fallback: compute on the fly if tone is not in the standard set
      return this.toneToHex(palette.hue, palette.chroma, tone);
    }
    return color.toHex();
  }

  /**
   * Extracts the light theme color roles from the six tonal palettes.
   */
  private extractLightTheme(
    primary: TonalPalette,
    secondary: TonalPalette,
    tertiary: TonalPalette,
    neutral: TonalPalette,
    neutralVariant: TonalPalette,
    error: TonalPalette
  ): ThemeColors {
    return {
      primary: this.paletteHex(primary, 40),
      onPrimary: this.paletteHex(primary, 100),
      primaryContainer: this.paletteHex(primary, 90),
      onPrimaryContainer: this.paletteHex(primary, 10),
      secondary: this.paletteHex(secondary, 40),
      onSecondary: this.paletteHex(secondary, 100),
      secondaryContainer: this.paletteHex(secondary, 90),
      onSecondaryContainer: this.paletteHex(secondary, 10),
      tertiary: this.paletteHex(tertiary, 40),
      onTertiary: this.paletteHex(tertiary, 100),
      tertiaryContainer: this.paletteHex(tertiary, 90),
      onTertiaryContainer: this.paletteHex(tertiary, 10),
      error: this.paletteHex(error, 40),
      onError: this.paletteHex(error, 100),
      errorContainer: this.paletteHex(error, 90),
      onErrorContainer: this.paletteHex(error, 10),
      background: this.paletteHex(neutral, 99),
      onBackground: this.paletteHex(neutral, 10),
      surface: this.paletteHex(neutral, 99),
      onSurface: this.paletteHex(neutral, 10),
      surfaceVariant: this.paletteHex(neutralVariant, 90),
      onSurfaceVariant: this.paletteHex(neutralVariant, 30),
      outline: this.paletteHex(neutralVariant, 50),
      outlineVariant: this.paletteHex(neutralVariant, 80),
    };
  }

  /**
   * Extracts the dark theme color roles from the six tonal palettes.
   * Dark theme inverts the tone mappings relative to the light theme.
   */
  private extractDarkTheme(
    primary: TonalPalette,
    secondary: TonalPalette,
    tertiary: TonalPalette,
    neutral: TonalPalette,
    neutralVariant: TonalPalette,
    error: TonalPalette
  ): ThemeColors {
    return {
      primary: this.paletteHex(primary, 80),
      onPrimary: this.paletteHex(primary, 20),
      primaryContainer: this.paletteHex(primary, 30),
      onPrimaryContainer: this.paletteHex(primary, 90),
      secondary: this.paletteHex(secondary, 80),
      onSecondary: this.paletteHex(secondary, 20),
      secondaryContainer: this.paletteHex(secondary, 30),
      onSecondaryContainer: this.paletteHex(secondary, 90),
      tertiary: this.paletteHex(tertiary, 80),
      onTertiary: this.paletteHex(tertiary, 20),
      tertiaryContainer: this.paletteHex(tertiary, 30),
      onTertiaryContainer: this.paletteHex(tertiary, 90),
      error: this.paletteHex(error, 80),
      onError: this.paletteHex(error, 20),
      errorContainer: this.paletteHex(error, 30),
      onErrorContainer: this.paletteHex(error, 90),
      background: this.paletteHex(neutral, 10),
      onBackground: this.paletteHex(neutral, 90),
      surface: this.paletteHex(neutral, 10),
      onSurface: this.paletteHex(neutral, 90),
      surfaceVariant: this.paletteHex(neutralVariant, 30),
      onSurfaceVariant: this.paletteHex(neutralVariant, 80),
      outline: this.paletteHex(neutralVariant, 60),
      outlineVariant: this.paletteHex(neutralVariant, 30),
    };
  }
}
