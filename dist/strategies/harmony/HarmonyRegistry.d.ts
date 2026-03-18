import type { IHarmonyAlgorithm, IHarmonyRegistry, HarmonyType } from '../../domain/interfaces/IHarmonyAlgorithm.js';
/**
 * Registry for harmony algorithms.
 */
export declare class HarmonyRegistry implements IHarmonyRegistry {
    private readonly algorithms;
    register(algorithm: IHarmonyAlgorithm): void;
    get(type: HarmonyType): IHarmonyAlgorithm | undefined;
    list(): readonly HarmonyType[];
    /**
     * Creates a registry with all built-in harmony algorithms.
     */
    static createDefault(): HarmonyRegistry;
}
//# sourceMappingURL=HarmonyRegistry.d.ts.map