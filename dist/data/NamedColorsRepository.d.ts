import { Color } from '../domain/values/Color.js';
/**
 * Named color source.
 */
export type ColorSource = 'css' | 'xkcd';
/**
 * Named color entry.
 */
export interface NamedColor {
    name: string;
    hex: string;
    color: Color;
    source?: ColorSource;
}
/**
 * Repository for named colors (CSS + XKCD).
 */
export declare class NamedColorsRepository {
    private readonly colors;
    private readonly colorsByHex;
    private readonly labCache;
    private readonly conversionService;
    private readonly deltaE;
    private readonly includeXkcd;
    constructor(options?: {
        includeXkcd?: boolean;
    });
    private loadColors;
    private addColor;
    /**
     * Gets a named color by name.
     */
    getByName(name: string): NamedColor | undefined;
    /**
     * Gets named colors by hex value.
     */
    getByHex(hex: string): NamedColor[];
    /**
     * Finds the closest named color to a given color.
     * Uses CIEDE2000 perceptual distance in Lab space.
     * Lab values are pre-computed at load time for performance.
     */
    findClosest(color: Color): NamedColor;
    /**
     * Lists all named colors.
     */
    listAll(): NamedColor[];
    /**
     * Searches for colors by partial name match.
     */
    search(query: string): NamedColor[];
    /**
     * Gets the total count of named colors.
     */
    get count(): number;
}
//# sourceMappingURL=NamedColorsRepository.d.ts.map