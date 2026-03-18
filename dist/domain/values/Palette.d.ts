import type { Color } from './Color.js';
/**
 * Represents a collection of colors forming a palette.
 * Immutable - all modifications return new Palette instances.
 */
export declare class Palette {
    readonly colors: readonly Color[];
    readonly name?: string;
    readonly metadata?: Readonly<Record<string, unknown>>;
    private constructor();
    static create(colors: readonly Color[], name?: string, metadata?: Record<string, unknown>): Palette;
    /**
     * Returns the number of colors in the palette.
     */
    get length(): number;
    /**
     * Returns a color at the specified index.
     */
    at(index: number): Color | undefined;
    /**
     * Returns a new palette with an additional color.
     */
    add(color: Color): Palette;
    /**
     * Returns a new palette without the color at the specified index.
     */
    remove(index: number): Palette;
    /**
     * Returns a new palette with the color at the specified index replaced.
     */
    replace(index: number, color: Color): Palette;
    /**
     * Returns a new palette with a different name.
     */
    withName(name: string): Palette;
    /**
     * Returns a new palette with additional metadata.
     */
    withMetadata(metadata: Record<string, unknown>): Palette;
    /**
     * Maps each color to a new color.
     */
    map(fn: (color: Color, index: number) => Color): Palette;
    /**
     * Returns a reversed copy of the palette.
     */
    reverse(): Palette;
    /**
     * Iterates over colors.
     */
    [Symbol.iterator](): Iterator<Color>;
    toJSON(): {
        colors: ReturnType<Color['toJSON']>[];
        name?: string;
        metadata?: Record<string, unknown>;
    };
}
//# sourceMappingURL=Palette.d.ts.map