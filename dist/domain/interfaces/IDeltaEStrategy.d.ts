import type { Color } from '../values/Color.js';
/**
 * Delta-E calculation methods.
 * Each represents a different formula for calculating perceptual color difference.
 */
export type DeltaEMethod = 'CIE76' | 'CIE94' | 'CIEDE2000' | 'CMC' | 'Euclidean';
/**
 * Options for Delta-E calculations.
 */
export interface DeltaEOptions {
    /**
     * For CIE94: application type affecting weighting.
     * 'graphic-arts' (default) or 'textiles'
     */
    application?: 'graphic-arts' | 'textiles';
    /**
     * For CMC: lightness:chroma ratio.
     * Default is 2:1 for perceptibility, 1:1 for acceptability.
     */
    cmcRatio?: {
        l: number;
        c: number;
    };
}
/**
 * Interpretation of Delta-E values.
 */
export interface DeltaEInterpretation {
    readonly value: number;
    readonly description: string;
    readonly perceptible: boolean;
    readonly acceptable: boolean;
}
/**
 * Interface for Delta-E calculation strategies.
 */
export interface IDeltaEStrategy {
    /**
     * The method identifier.
     */
    readonly method: DeltaEMethod;
    /**
     * Human-readable description of this method.
     */
    readonly description: string;
    /**
     * Calculates the Delta-E between two colors.
     * Colors are automatically converted to appropriate space (Lab).
     */
    calculate(color1: Color, color2: Color, options?: DeltaEOptions): number;
    /**
     * Interprets a Delta-E value.
     */
    interpret(deltaE: number): DeltaEInterpretation;
}
/**
 * Registry for Delta-E strategies.
 */
export interface IDeltaERegistry {
    /**
     * Registers a Delta-E strategy.
     */
    register(strategy: IDeltaEStrategy): void;
    /**
     * Gets a Delta-E strategy by method.
     */
    get(method: DeltaEMethod): IDeltaEStrategy | undefined;
    /**
     * Lists all registered methods.
     */
    list(): readonly DeltaEMethod[];
    /**
     * Gets the default strategy (CIEDE2000).
     */
    getDefault(): IDeltaEStrategy;
}
//# sourceMappingURL=IDeltaEStrategy.d.ts.map