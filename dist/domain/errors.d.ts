/**
 * Base error for all color-theory-mcp errors.
 */
export declare class ColorError extends Error {
    constructor(message: string);
}
/**
 * Thrown when a color string cannot be parsed.
 */
export declare class ColorParseError extends ColorError {
    readonly input: string;
    constructor(input: string, reason?: string);
}
/**
 * Thrown when a color space is unknown or unsupported.
 */
export declare class UnknownColorSpaceError extends ColorError {
    readonly space: string;
    constructor(space: string);
}
/**
 * Thrown when a color is in the wrong color space for an operation.
 */
export declare class ColorSpaceMismatchError extends ColorError {
    readonly expected: string;
    readonly actual: string;
    constructor(expected: string, actual: string);
}
/**
 * Thrown when a color is outside the gamut of a target color space.
 */
export declare class GamutError extends ColorError {
    readonly targetSpace: string;
    constructor(targetSpace: string, detail?: string);
}
/**
 * Thrown when component count doesn't match color space requirements.
 */
export declare class ComponentCountError extends ColorError {
    readonly space: string;
    readonly expected: number;
    readonly actual: number;
    constructor(space: string, expected: number, actual: number);
}
//# sourceMappingURL=errors.d.ts.map