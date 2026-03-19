import { Color } from '../domain/values/Color.js';
import { ConversionService } from '../services/ConversionService.js';
import { CIEDE2000Strategy } from '../strategies/delta-e/CIEDE2000Strategy.js';
import cssColors from './css-colors.json' with { type: 'json' };
import xkcdColors from './xkcd-colors.json' with { type: 'json' };

/**
 * Named color source.
 */
export type ColorSource = 'css' | 'xkcd';

/**
 * Named color entry.
 */
export interface NamedColor {
  name: string;
  hex: string;
  color: Color;
  source?: ColorSource;
}

/**
 * Repository for named colors (CSS + XKCD).
 */
export class NamedColorsRepository {
  private readonly colors: Map<string, NamedColor> = new Map();
  private readonly colorsByHex: Map<string, NamedColor[]> = new Map();
  private readonly labCache: Map<string, readonly number[]> = new Map();
  private readonly conversionService = new ConversionService();
  private readonly deltaE = new CIEDE2000Strategy();
  private readonly includeXkcd: boolean;

  constructor(options?: { includeXkcd?: boolean }) {
    this.includeXkcd = options?.includeXkcd ?? false;
    this.loadColors();
  }

  private loadColors(): void {
    // Load CSS colors first (these take priority for name lookups)
    for (const [name, hex] of Object.entries(cssColors)) {
      this.addColor(name, hex, 'css');
    }

    // Load XKCD colors (only if enabled, skip duplicates)
    if (this.includeXkcd) {
      for (const [name, hex] of Object.entries(xkcdColors)) {
        if (!this.colors.has(name.toLowerCase())) {
          this.addColor(name, hex, 'xkcd');
        }
      }
    }
  }

  private addColor(name: string, hex: string, source: ColorSource): void {
    const color = Color.fromHex(hex);
    const entry: NamedColor = { name, hex: hex.toLowerCase(), color, source };

    this.colors.set(name.toLowerCase(), entry);

    // Pre-compute Lab for perceptual distance matching
    const lab = this.conversionService.convert(color, 'lab');
    this.labCache.set(name.toLowerCase(), lab.components);

    const hexKey = hex.toLowerCase();
    const existing = this.colorsByHex.get(hexKey) ?? [];
    existing.push(entry);
    this.colorsByHex.set(hexKey, existing);
  }

  /**
   * Gets a named color by name.
   */
  getByName(name: string): NamedColor | undefined {
    return this.colors.get(name.toLowerCase());
  }

  /**
   * Gets named colors by hex value.
   */
  getByHex(hex: string): NamedColor[] {
    const normalized = hex.toLowerCase().replace(/^#/, '');
    const fullHex = `#${normalized}`;
    return this.colorsByHex.get(fullHex) ?? [];
  }

  /**
   * Finds the closest named color to a given color.
   * Uses CIEDE2000 perceptual distance in Lab space.
   * Lab values are pre-computed at load time for performance.
   */
  findClosest(color: Color): { color: NamedColor; deltaE: number } {
    // Convert target to Lab for perceptual comparison
    const targetLab = this.conversionService.convert(color, 'lab');

    let closest: NamedColor | undefined;
    let minDeltaE = Infinity;

    // We can't iterate blindly. CIEDE2000 is expensive (sqrt, sin, cos).
    // Optimization: Euclidean distance in Lab is a lower bound approx.
    // Or just iterate all since N is small (< 2000).

    // For 1000 colors, iterating all is ~1-2ms.
    for (const [name, entry] of this.colors.entries()) {
      const entryLabComponents = this.labCache.get(name)!;
      // Re-create Lab object only if needed? Or modify DeltaE strategy to take raw components?
      // Optimization: The strategy takes Color objects.

      const entryLab = Color.create('lab', entryLabComponents, 1);
      const de = this.deltaE.calculate(targetLab, entryLab);

      if (de < minDeltaE) {
        minDeltaE = de;
        closest = entry;
      }
    }

    return { color: closest!, deltaE: minDeltaE };
  }

  /**
   * Lists all named colors.
   */
  listAll(): NamedColor[] {
    return [...this.colors.values()];
  }

  /**
   * Searches for colors by partial name match.
   */
  search(query: string): NamedColor[] {
    const lowerQuery = query.toLowerCase();
    return [...this.colors.values()].filter((entry) =>
      entry.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Gets the total count of named colors.
   */
  get count(): number {
    return this.colors.size;
  }
}
