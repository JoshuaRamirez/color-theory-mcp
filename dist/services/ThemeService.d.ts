import { Color } from '../domain/values/Color.js';
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
 * All perceptual manipulation is performed in the Oklch color space
 * to ensure uniform lightness distribution across tonal steps.
 */
export declare class ThemeService {
    /**
     * Generates a complete Material Design 3 theme from a seed color.
     *
     * @param seedColor - Any Color instance; will be converted to Oklch internally
     * @returns A MaterialTheme with light/dark color roles and all six tonal palettes
     */
    generateTheme(seedColor: Color): MaterialTheme;
    /**
     * Generates a tonal palette: 13 tones (0-100) for a given hue and chroma.
     *
     * Each tone T maps to Oklch lightness L = T/100 while preserving
     * the supplied hue and chroma. The resulting Color objects are stored
     * in sRGB with gamut clamping applied.
     *
     * @param hue - Oklch hue in degrees (0-360)
     * @param chroma - Oklch chroma (0-0.4 typical range)
     * @returns TonalPalette with a Map from tone value to sRGB Color
     */
    generateTonalPalette(hue: number, chroma: number): TonalPalette;
    /**
     * Converts an Oklch specification (hue, chroma, tone) to an sRGB hex string.
     * Out-of-gamut colors are clamped to the sRGB boundary.
     */
    private toneToHex;
    /**
     * Helper to retrieve a hex color at a given tone from a pre-built TonalPalette.
     */
    private paletteHex;
    /**
     * Extracts the light theme color roles from the six tonal palettes.
     */
    private extractLightTheme;
    /**
     * Extracts the dark theme color roles from the six tonal palettes.
     * Dark theme inverts the tone mappings relative to the light theme.
     */
    private extractDarkTheme;
}
//# sourceMappingURL=ThemeService.d.ts.map