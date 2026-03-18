import type { Color } from './Color.js';
/**
 * Represents a color stop in a gradient.
 */
export interface GradientStop {
    readonly color: Color;
    readonly position: number;
}
/**
 * Represents an interpolation method for gradients.
 */
export type InterpolationMethod = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
/**
 * Represents a gradient - a smooth transition between colors.
 * Immutable - all modifications return new Gradient instances.
 */
export declare class Gradient {
    readonly stops: readonly GradientStop[];
    readonly interpolation: InterpolationMethod;
    private constructor();
    /**
     * Creates a gradient from color stops.
     * @throws Error if fewer than 2 stops are provided
     */
    static create(stops: readonly GradientStop[], interpolation?: InterpolationMethod): Gradient;
    /**
     * Creates a simple two-color gradient.
     */
    static fromColors(startColor: Color, endColor: Color, interpolation?: InterpolationMethod): Gradient;
    /**
     * Creates a gradient from an array of colors, evenly distributed.
     */
    static fromColorArray(colors: readonly Color[], interpolation?: InterpolationMethod): Gradient;
    /**
     * Returns the number of color stops.
     */
    get length(): number;
    /**
     * Returns a new gradient with an additional stop.
     */
    addStop(stop: GradientStop): Gradient;
    /**
     * Returns a new gradient without the stop at the specified index.
     */
    removeStop(index: number): Gradient;
    /**
     * Returns a new gradient with a different interpolation method.
     */
    withInterpolation(interpolation: InterpolationMethod): Gradient;
    /**
     * Returns a reversed copy of the gradient.
     */
    reverse(): Gradient;
    /**
     * Gets the bounding stops for a given position.
     * Returns [lowerStop, upperStop, t] where t is the interpolation factor.
     */
    getStopsAt(position: number): [GradientStop, GradientStop, number];
    /**
     * Applies easing function to interpolation factor.
     */
    private applyEasing;
    /**
     * Iterates over stops.
     */
    [Symbol.iterator](): Iterator<GradientStop>;
    toJSON(): {
        stops: {
            color: ReturnType<Color['toJSON']>;
            position: number;
        }[];
        interpolation: InterpolationMethod;
    };
}
//# sourceMappingURL=Gradient.d.ts.map