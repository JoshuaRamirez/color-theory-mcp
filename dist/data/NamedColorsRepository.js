import { Color } from '../domain/values/Color.js';
import { ConversionService } from '../services/ConversionService.js';
import { CIEDE2000Strategy } from '../strategies/delta-e/CIEDE2000Strategy.js';
import cssColors from './css-colors.json' with { type: 'json' };
import xkcdColors from './xkcd-colors.json' with { type: 'json' };
/**
 * Repository for named colors (CSS + XKCD).
 */
export class NamedColorsRepository {
    colors = new Map();
    colorsByHex = new Map();
    labCache = new Map();
    conversionService = new ConversionService();
    deltaE = new CIEDE2000Strategy();
    includeXkcd;
    constructor(options) {
        this.includeXkcd = options?.includeXkcd ?? false;
        this.loadColors();
    }
    loadColors() {
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
    addColor(name, hex, source) {
        const color = Color.fromHex(hex);
        const entry = { name, hex: hex.toLowerCase(), color, source };
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
     * Uses CIEDE2000 perceptual distance in Lab space.
     * Lab values are pre-computed at load time for performance.
     */
    findClosest(color) {
        // Convert target to Lab for perceptual comparison
        const targetLab = this.conversionService.convert(color, 'lab');
        let closest;
        let minDeltaE = Infinity;
        for (const [name, entry] of this.colors.entries()) {
            const entryLabComponents = this.labCache.get(name);
            if (!entryLabComponents)
                continue;
            const entryLab = Color.create('lab', entryLabComponents, 1);
            const de = this.deltaE.calculate(targetLab, entryLab);
            if (de < minDeltaE) {
                minDeltaE = de;
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
        return [...this.colors.values()].filter((entry) => entry.name.toLowerCase().includes(lowerQuery));
    }
    /**
     * Gets the total count of named colors.
     */
    get count() {
        return this.colors.size;
    }
}
//# sourceMappingURL=NamedColorsRepository.js.map