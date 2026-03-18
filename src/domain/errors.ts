/**
 * Base error for all color-theory-mcp errors.
 */
export class ColorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ColorError';
  }
}

/**
 * Thrown when a color string cannot be parsed.
 */
export class ColorParseError extends ColorError {
  readonly input: string;

  constructor(input: string, reason?: string) {
    super(
      reason ? `Unable to parse color "${input}": ${reason}` : `Unable to parse color: ${input}`
    );
    this.name = 'ColorParseError';
    this.input = input;
  }
}

/**
 * Thrown when a color space is unknown or unsupported.
 */
export class UnknownColorSpaceError extends ColorError {
  readonly space: string;

  constructor(space: string) {
    super(`Unknown color space: ${space}`);
    this.name = 'UnknownColorSpaceError';
    this.space = space;
  }
}

/**
 * Thrown when a color is in the wrong color space for an operation.
 */
export class ColorSpaceMismatchError extends ColorError {
  readonly expected: string;
  readonly actual: string;

  constructor(expected: string, actual: string) {
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
  readonly targetSpace: string;

  constructor(targetSpace: string, detail?: string) {
    super(
      detail
        ? `Color is outside ${targetSpace} gamut: ${detail}`
        : `Color is outside ${targetSpace} gamut`
    );
    this.name = 'GamutError';
    this.targetSpace = targetSpace;
  }
}

/**
 * Thrown when component count doesn't match color space requirements.
 */
export class ComponentCountError extends ColorError {
  readonly space: string;
  readonly expected: number;
  readonly actual: number;

  constructor(space: string, expected: number, actual: number) {
    super(`Color space '${space}' requires ${expected} components, got ${actual}`);
    this.name = 'ComponentCountError';
    this.space = space;
    this.expected = expected;
    this.actual = actual;
  }
}
