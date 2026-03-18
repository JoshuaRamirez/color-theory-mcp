import { Color } from '../domain/values/Color.js';
import cssColors from './css-colors.json' with { type: 'json' };
/**
 * Repository for CSS named colors.
 */
export class NamedColorsRepository {
    colors = new Map();
    colorsByHex = new Map();
    constructor() {
        this.loadColors();
    }
    loadColors() {
        for (const [name, hex] of Object.entries(cssColors)) {
            const color = Color.fromHex(hex);
            const entry = { name, hex: hex.toLowerCase(), color };
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
    getByName(name) {
        return this.colors.get(name.toLowerCase());
    }
    /**
     * Gets named colors by hex value.
     */
    getByHex(hex) {
        const normalized = hex.toLowerCase().replace(/^#/, '');
        const fullHex = `#${normalized}`;
        return this.colorsByHex.get(fullHex) ?? [];
    }
    /**
     * Finds the closest named color to a given color.
     * Uses simple Euclidean distance in sRGB space.
     */
    findClosest(color) {
        // Convert to sRGB for comparison
        const targetRgb = color.space === 'srgb'
            ? color.components
            : Color.fromHex('#000000').components; // Fallback
        let closest;
        let minDistance = Infinity;
        for (const entry of this.colors.values()) {
            const [r1, g1, b1] = entry.color.components;
            const [r2, g2, b2] = targetRgb;
            const distance = Math.sqrt(Math.pow(r1 - r2, 2) +
                Math.pow(g1 - g2, 2) +
                Math.pow(b1 - b2, 2));
            if (distance < minDistance) {
                minDistance = distance;
                closest = entry;
            }
        }
        return closest;
    }
    /**
     * Lists all named colors.
     */
    listAll() {
        return [...this.colors.values()];
    }
    /**
     * Searches for colors by partial name match.
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        return [...this.colors.values()].filter(entry => entry.name.toLowerCase().includes(lowerQuery));
    }
    /**
     * Gets the total count of named colors.
     */
    get count() {
        return this.colors.size;
    }
}
//# sourceMappingURL=NamedColorsRepository.js.map