/**
 * Represents a gradient - a smooth transition between colors.
 * Immutable - all modifications return new Gradient instances.
 */
export class Gradient {
    stops;
    interpolation;
    constructor(stops, interpolation) {
        this.stops = Object.freeze([...stops].sort((a, b) => a.position - b.position));
        this.interpolation = interpolation;
    }
    /**
     * Creates a gradient from color stops.
     * @throws Error if fewer than 2 stops are provided
     */
    static create(stops, interpolation = 'linear') {
        if (stops.length < 2) {
            throw new Error('Gradient must have at least 2 color stops');
        }
        return new Gradient(stops, interpolation);
    }
    /**
     * Creates a simple two-color gradient.
     */
    static fromColors(startColor, endColor, interpolation = 'linear') {
        return new Gradient([
            { color: startColor, position: 0 },
            { color: endColor, position: 1 },
        ], interpolation);
    }
    /**
     * Creates a gradient from an array of colors, evenly distributed.
     */
    static fromColorArray(colors, interpolation = 'linear') {
        if (colors.length < 2) {
            throw new Error('Gradient must have at least 2 colors');
        }
        const stops = colors.map((color, i) => ({
            color,
            position: i / (colors.length - 1),
        }));
        return new Gradient(stops, interpolation);
    }
    /**
     * Returns the number of color stops.
     */
    get length() {
        return this.stops.length;
    }
    /**
     * Returns a new gradient with an additional stop.
     */
    addStop(stop) {
        return new Gradient([...this.stops, stop], this.interpolation);
    }
    /**
     * Returns a new gradient without the stop at the specified index.
     */
    removeStop(index) {
        if (this.stops.length <= 2) {
            throw new Error('Gradient must have at least 2 color stops');
        }
        const newStops = this.stops.filter((_, i) => i !== index);
        return new Gradient(newStops, this.interpolation);
    }
    /**
     * Returns a new gradient with a different interpolation method.
     */
    withInterpolation(interpolation) {
        return new Gradient(this.stops, interpolation);
    }
    /**
     * Returns a reversed copy of the gradient.
     */
    reverse() {
        const reversedStops = this.stops.map(stop => ({
            color: stop.color,
            position: 1 - stop.position,
        }));
        return new Gradient(reversedStops, this.interpolation);
    }
    /**
     * Gets the bounding stops for a given position.
     * Returns [lowerStop, upperStop, t] where t is the interpolation factor.
     */
    getStopsAt(position) {
        const clampedPos = Math.max(0, Math.min(1, position));
        // Find the surrounding stops
        let lowerStop = this.stops[0];
        let upperStop = this.stops[this.stops.length - 1];
        for (let i = 0; i < this.stops.length - 1; i++) {
            const current = this.stops[i];
            const next = this.stops[i + 1];
            if (clampedPos >= current.position && clampedPos <= next.position) {
                lowerStop = current;
                upperStop = next;
                break;
            }
        }
        // Calculate interpolation factor
        const range = upperStop.position - lowerStop.position;
        const t = range === 0 ? 0 : (clampedPos - lowerStop.position) / range;
        return [lowerStop, upperStop, this.applyEasing(t)];
    }
    /**
     * Applies easing function to interpolation factor.
     */
    applyEasing(t) {
        switch (this.interpolation) {
            case 'linear':
                return t;
            case 'ease':
                // Approximation of CSS ease
                return t * t * (3 - 2 * t);
            case 'ease-in':
                return t * t;
            case 'ease-out':
                return t * (2 - t);
            case 'ease-in-out':
                return t < 0.5
                    ? 2 * t * t
                    : 1 - Math.pow(-2 * t + 2, 2) / 2;
            default:
                return t;
        }
    }
    /**
     * Iterates over stops.
     */
    *[Symbol.iterator]() {
        yield* this.stops;
    }
    toJSON() {
        return {
            stops: this.stops.map(s => ({
                color: s.color.toJSON(),
                position: s.position,
            })),
            interpolation: this.interpolation,
        };
    }
}
//# sourceMappingURL=Gradient.js.map