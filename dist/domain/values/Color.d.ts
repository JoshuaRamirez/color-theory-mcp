import { type ColorSpaceType } from './ColorSpaceType.js';
/**
 * Immutable color value object.
 *
 * All color operations return new Color instances, preserving immutability.
 * The components array is frozen to prevent mutation.
 */
export declare class Color {
    readonly space: ColorSpaceType;
    readonly components: readonly number[];
    readonly alpha: number;
    private constructor();
    /**
     * Creates a new Color instance.
     * @throws Error if component count doesn't match color space requirements
     */
    static create(space: ColorSpaceType, components: readonly number[], alpha?: number): Color;
    /**
     * Creates a Color from sRGB hex string.
     * Supports formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
     */
    static fromHex(hex: string): Color;
    /**
     * Creates a Color from RGB values (0-255).
     */
    static fromRgb(r: number, g: number, b: number, a?: number): Color;
    /**
     * Returns the hex representation of the color.
     * Color is first converted to sRGB if necessary.
     */
    toHex(includeAlpha?: boolean): string;
    /**
     * Returns RGB values as integers (0-255).
     */
    toRgbArray(): [number, number, number];
    /**
     * Returns CSS color string representation.
     */
    toCssString(): string;
    /**
     * Creates a new Color with modified alpha.
     */
    withAlpha(alpha: number): Color;
    /**
     * Creates a new Color with modified components.
     */
    withComponents(components: readonly number[]): Color;
    /**
     * Checks equality with another color within tolerance.
     */
    equals(other: Color, tolerance?: number): boolean;
    /**
     * Returns a plain object representation.
     */
    toJSON(): {
        space: ColorSpaceType;
        components: number[];
        alpha: number;
    };
    /**
     * Returns a string representation for debugging.
     */
    toString(): string;
}
//# sourceMappingURL=Color.d.ts.map