import type { Color } from './Color.js';

/**
 * Represents a collection of colors forming a palette.
 * Immutable - all modifications return new Palette instances.
 */
export class Palette {
  readonly colors: readonly Color[];
  readonly name?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;

  private constructor(
    colors: readonly Color[],
    name?: string,
    metadata?: Record<string, unknown>
  ) {
    this.colors = Object.freeze([...colors]);
    this.name = name;
    this.metadata = metadata ? Object.freeze({ ...metadata }) : undefined;
  }

  static create(
    colors: readonly Color[],
    name?: string,
    metadata?: Record<string, unknown>
  ): Palette {
    if (colors.length === 0) {
      throw new Error('Palette must contain at least one color');
    }
    return new Palette(colors, name, metadata);
  }

  /**
   * Returns the number of colors in the palette.
   */
  get length(): number {
    return this.colors.length;
  }

  /**
   * Returns a color at the specified index.
   */
  at(index: number): Color | undefined {
    return this.colors[index];
  }

  /**
   * Returns a new palette with an additional color.
   */
  add(color: Color): Palette {
    return new Palette([...this.colors, color], this.name, this.metadata);
  }

  /**
   * Returns a new palette without the color at the specified index.
   */
  remove(index: number): Palette {
    if (this.colors.length <= 1) {
      throw new Error('Cannot remove the last color from a palette');
    }
    const newColors = this.colors.filter((_, i) => i !== index);
    return new Palette(newColors, this.name, this.metadata);
  }

  /**
   * Returns a new palette with the color at the specified index replaced.
   */
  replace(index: number, color: Color): Palette {
    const newColors = [...this.colors];
    newColors[index] = color;
    return new Palette(newColors, this.name, this.metadata);
  }

  /**
   * Returns a new palette with a different name.
   */
  withName(name: string): Palette {
    return new Palette(this.colors, name, this.metadata);
  }

  /**
   * Returns a new palette with additional metadata.
   */
  withMetadata(metadata: Record<string, unknown>): Palette {
    return new Palette(this.colors, this.name, {
      ...this.metadata,
      ...metadata,
    });
  }

  /**
   * Maps each color to a new color.
   */
  map(fn: (color: Color, index: number) => Color): Palette {
    return new Palette(this.colors.map(fn), this.name, this.metadata);
  }

  /**
   * Returns a reversed copy of the palette.
   */
  reverse(): Palette {
    return new Palette([...this.colors].reverse(), this.name, this.metadata);
  }

  /**
   * Iterates over colors.
   */
  *[Symbol.iterator](): Iterator<Color> {
    yield* this.colors;
  }

  toJSON(): {
    colors: ReturnType<Color['toJSON']>[];
    name?: string;
    metadata?: Record<string, unknown>;
  } {
    return {
      colors: this.colors.map(c => c.toJSON()),
      name: this.name,
      metadata: this.metadata ? { ...this.metadata } : undefined,
    };
  }
}
