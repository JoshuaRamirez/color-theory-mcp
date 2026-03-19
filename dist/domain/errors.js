/**
 * Base error for all color-theory-mcp errors.
 */
export class ColorError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ColorError';
    }
}
/**
 * Thrown when a color string cannot be parsed.
 */
export class ColorParseError extends ColorError {
    input;
    constructor(input, reason) {
        super(reason ? `Unable to parse color "${input}": ${reason}` : `Unable to parse color: ${input}`);
        this.name = 'ColorParseError';
        this.input = input;
    }
}
/**
 * Thrown when a color space is unknown or unsupported.
 */
export class UnknownColorSpaceError extends ColorError {
    space;
    constructor(space) {
        super(`Unknown color space: ${space}`);
        this.name = 'UnknownColorSpaceError';
        this.space = space;
    }
}
/**
 * Thrown when a color is in the wrong color space for an operation.
 */
export class ColorSpaceMismatchError extends ColorError {
    expected;
    actual;
    constructor(expected, actual) {
        super(`Expected ${expected} color, got ${actual}`);
        this.name = 'ColorSpaceMismatchError';
        this.expected = expected;
        this.actual = actual;
    }
}
/**
 * Thrown when a color is outside the gamut of a target color space.
 */
export class GamutError extends ColorError {
    targetSpace;
    constructor(targetSpace, detail) {
        super(detail
            ? `Color is outside ${targetSpace} gamut: ${detail}`
            : `Color is outside ${targetSpace} gamut`);
        this.name = 'GamutError';
        this.targetSpace = targetSpace;
    }
}
/**
 * Thrown when component count doesn't match color space requirements.
 */
export class ComponentCountError extends ColorError {
    space;
    expected;
    actual;
    constructor(space, expected, actual) {
        super(`Color space '${space}' requires ${expected} components, got ${actual}`);
        this.name = 'ComponentCountError';
        this.space = space;
        this.expected = expected;
        this.actual = actual;
    }
}
//# sourceMappingURL=errors.js.map