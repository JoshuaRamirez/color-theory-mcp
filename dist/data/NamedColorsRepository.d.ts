import { Color } from '../domain/values/Color.js';
/**
 * Named color entry.
 */
export interface NamedColor {
    name: string;
    hex: string;
    color: Color;
}
/**
 * Repository for CSS named colors.
 */
export declare class NamedColorsRepository {
    private readonly colors;
    private readonly colorsByHex;
    constructor();
    private loadColors;
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
     * Uses simple Euclidean distance in sRGB space.
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