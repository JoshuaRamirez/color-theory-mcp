import { Color } from '../domain/values/Color.js';
import cssColors from './css-colors.json' with { type: 'json' };

/**
 * Named color entry.
 */
export interface NamedColor {
  name: string;
  hex: string;
  color: Color;
}

/**
 * Repository for CSS named colors.
 */
export class NamedColorsRepository {
  private readonly colors: Map<string, NamedColor> = new Map();
  private readonly colorsByHex: Map<string, NamedColor[]> = new Map();

  constructor() {
    this.loadColors();
  }

  private loadColors(): void {
    for (const [name, hex] of Object.entries(cssColors)) {
      const color = Color.fromHex(hex);
      const entry: NamedColor = { name, hex: hex.toLowerCase(), color };

      this.colors.set(name.toLowerCase(), entry);

      // Index by hex for reverse lookup
      const hexKey = hex.toLowerCase();
      const existing = this.colorsByHex.get(hexKey) ?? [];
      existing.push(entry);
      this.colorsByHex.set(hexKey, existing);
    }
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
   * Uses simple Euclidean distance in sRGB space.
   */
  findClosest(color: Color): NamedColor {
    // Convert to sRGB for comparison
    const targetRgb = color.space === 'srgb'
      ? color.components
      : Color.fromHex('#000000').components; // Fallback

    let closest: NamedColor | undefined;
    let minDistance = Infinity;

    for (const entry of this.colors.values()) {
      const [r1, g1, b1] = entry.color.components as [number, number, number];
      const [r2, g2, b2] = targetRgb as [number, number, number];

      const distance = Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closest = entry;
      }
    }

    return closest!;
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
    return [...this.colors.values()].filter(
      entry => entry.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Gets the total count of named colors.
   */
  get count(): number {
    return this.colors.size;
  }
}
