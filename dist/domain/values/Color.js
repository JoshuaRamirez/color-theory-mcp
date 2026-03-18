import { COLOR_SPACE_COMPONENTS } from './ColorSpaceType.js';
/**
 * Immutable color value object.
 *
 * All color operations return new Color instances, preserving immutability.
 * The components array is frozen to prevent mutation.
 */
export class Color {
    space;
    components;
    alpha;
    constructor(space, components, alpha) {
        this.space = space;
        this.components = Object.freeze([...components]);
        this.alpha = Math.max(0, Math.min(1, alpha));
    }
    /**
     * Creates a new Color instance.
     * @throws Error if component count doesn't match color space requirements
     */
    static create(space, components, alpha = 1) {
        const expectedCount = COLOR_SPACE_COMPONENTS[space].length;
        if (components.length !== expectedCount) {
            throw new Error(`Color space '${space}' requires ${expectedCount} components, got ${components.length}`);
        }
        return new Color(space, components, alpha);
    }
    /**
     * Creates a Color from sRGB hex string.
     * Supports formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
     */
    static fromHex(hex) {
        const cleaned = hex.replace(/^#/, '');
        let r, g, b, a = 1;
        if (cleaned.length === 3 || cleaned.length === 4) {
            r = parseInt(cleaned[0] + cleaned[0], 16) / 255;
            g = parseInt(cleaned[1] + cleaned[1], 16) / 255;
            b = parseInt(cleaned[2] + cleaned[2], 16) / 255;
            if (cleaned.length === 4) {
                a = parseInt(cleaned[3] + cleaned[3], 16) / 255;
            }
        }
        else if (cleaned.length === 6 || cleaned.length === 8) {
            r = parseInt(cleaned.slice(0, 2), 16) / 255;
            g = parseInt(cleaned.slice(2, 4), 16) / 255;
            b = parseInt(cleaned.slice(4, 6), 16) / 255;
            if (cleaned.length === 8) {
                a = parseInt(cleaned.slice(6, 8), 16) / 255;
            }
        }
        else {
            throw new Error(`Invalid hex color: ${hex}`);
        }
        if ([r, g, b, a].some(isNaN)) {
            throw new Error(`Invalid hex color: ${hex}`);
        }
        return new Color('srgb', [r, g, b], a);
    }
    /**
     * Creates a Color from RGB values (0-255).
     */
    static fromRgb(r, g, b, a = 1) {
        return new Color('srgb', [r / 255, g / 255, b / 255], a);
    }
    /**
     * Returns the hex representation of the color.
     * Color is first converted to sRGB if necessary.
     */
    toHex(includeAlpha = false) {
        // Note: Actual conversion will be handled by ConversionService
        // For now, only works correctly for sRGB colors
        if (this.space !== 'srgb') {
            throw new Error('Call toSpace("srgb") before toHex() for non-sRGB colors');
        }
        const [r, g, b] = this.components;
        const toHexByte = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255)
            .toString(16)
            .padStart(2, '0');
        const hex = `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
        if (includeAlpha && this.alpha < 1) {
            return hex + toHexByte(this.alpha);
        }
        return hex;
    }
    /**
     * Returns RGB values as integers (0-255).
     */
    toRgbArray() {
        if (this.space !== 'srgb') {
            throw new Error('Call toSpace("srgb") before toRgbArray() for non-sRGB colors');
        }
        const [r, g, b] = this.components;
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
        ];
    }
    /**
     * Returns CSS color string representation.
     */
    toCssString() {
        if (this.space === 'srgb') {
            const [r, g, b] = this.toRgbArray();
            if (this.alpha < 1) {
                return `rgba(${r}, ${g}, ${b}, ${this.alpha.toFixed(3)})`;
            }
            return `rgb(${r}, ${g}, ${b})`;
        }
        // CSS Color 4 format
        const comps = this.components.map(c => c.toFixed(4)).join(' ');
        if (this.alpha < 1) {
            return `color(${this.space} ${comps} / ${this.alpha.toFixed(3)})`;
        }
        return `color(${this.space} ${comps})`;
    }
    /**
     * Creates a new Color with modified alpha.
     */
    withAlpha(alpha) {
        return new Color(this.space, this.components, alpha);
    }
    /**
     * Creates a new Color with modified components.
     */
    withComponents(components) {
        return Color.create(this.space, components, this.alpha);
    }
    /**
     * Checks equality with another color within tolerance.
     */
    equals(other, tolerance = 0.0001) {
        if (this.space !== other.space)
            return false;
        if (Math.abs(this.alpha - other.alpha) > tolerance)
            return false;
        if (this.components.length !== other.components.length)
            return false;
        return this.components.every((c, i) => Math.abs(c - (other.components[i] ?? 0)) <= tolerance);
    }
    /**
     * Returns a plain object representation.
     */
    toJSON() {
        return {
            space: this.space,
            components: [...this.components],
            alpha: this.alpha,
        };
    }
    /**
     * Returns a string representation for debugging.
     */
    toString() {
        const comps = this.components.map(c => c.toFixed(4)).join(', ');
        return `Color(${this.space}: [${comps}], alpha: ${this.alpha.toFixed(3)})`;
    }
}
//# sourceMappingURL=Color.js.map