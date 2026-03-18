import type { IDeltaEStrategy, IDeltaERegistry, DeltaEMethod } from '../../domain/interfaces/IDeltaEStrategy.js';
/**
 * Registry for Delta-E calculation strategies.
 */
export declare class DeltaERegistry implements IDeltaERegistry {
    private readonly strategies;
    private defaultStrategy;
    constructor();
    register(strategy: IDeltaEStrategy): void;
    get(method: DeltaEMethod): IDeltaEStrategy | undefined;
    list(): readonly DeltaEMethod[];
    getDefault(): IDeltaEStrategy;
    /**
     * Creates a registry with all built-in strategies registered.
     */
    static createDefault(): DeltaERegistry;
}
//# sourceMappingURL=DeltaERegistry.d.ts.map