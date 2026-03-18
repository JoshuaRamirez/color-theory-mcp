/**
 * Represents a collection of colors forming a palette.
 * Immutable - all modifications return new Palette instances.
 */
export class Palette {
    colors;
    name;
    metadata;
    constructor(colors, name, metadata) {
        this.colors = Object.freeze([...colors]);
        this.name = name;
        this.metadata = metadata ? Object.freeze({ ...metadata }) : undefined;
    }
    static create(colors, name, metadata) {
        if (colors.length === 0) {
            throw new Error('Palette must contain at least one color');
        }
        return new Palette(colors, name, metadata);
    }
    /**
     * Returns the number of colors in the palette.
     */
    get length() {
        return this.colors.length;
    }
    /**
     * Returns a color at the specified index.
     */
    at(index) {
        return this.colors[index];
    }
    /**
     * Returns a new palette with an additional color.
     */
    add(color) {
        return new Palette([...this.colors, color], this.name, this.metadata);
    }
    /**
     * Returns a new palette without the color at the specified index.
     */
    remove(index) {
        if (this.colors.length <= 1) {
            throw new Error('Cannot remove the last color from a palette');
        }
        const newColors = this.colors.filter((_, i) => i !== index);
        return new Palette(newColors, this.name, this.metadata);
    }
    /**
     * Returns a new palette with the color at the specified index replaced.
     */
    replace(index, color) {
        const newColors = [...this.colors];
        newColors[index] = color;
        return new Palette(newColors, this.name, this.metadata);
    }
    /**
     * Returns a new palette with a different name.
     */
    withName(name) {
        return new Palette(this.colors, name, this.metadata);
    }
    /**
     * Returns a new palette with additional metadata.
     */
    withMetadata(metadata) {
        return new Palette(this.colors, this.name, {
            ...this.metadata,
            ...metadata,
        });
    }
    /**
     * Maps each color to a new color.
     */
    map(fn) {
        return new Palette(this.colors.map(fn), this.name, this.metadata);
    }
    /**
     * Returns a reversed copy of the palette.
     */
    reverse() {
        return new Palette([...this.colors].reverse(), this.name, this.metadata);
    }
    /**
     * Iterates over colors.
     */
    *[Symbol.iterator]() {
        yield* this.colors;
    }
    toJSON() {
        return {
            colors: this.colors.map(c => c.toJSON()),
            name: this.name,
            metadata: this.metadata ? { ...this.metadata } : undefined,
        };
    }
}
//# sourceMappingURL=Palette.js.map