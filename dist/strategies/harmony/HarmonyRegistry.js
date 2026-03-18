import { ComplementaryHarmony, AnalogousHarmony, TriadicHarmony, SplitComplementaryHarmony, TetradicHarmony, SquareHarmony, MonochromaticHarmony, } from './HarmonyAlgorithms.js';
/**
 * Registry for harmony algorithms.
 */
export class HarmonyRegistry {
    algorithms = new Map();
    register(algorithm) {
        this.algorithms.set(algorithm.type, algorithm);
    }
    get(type) {
        return this.algorithms.get(type);
    }
    list() {
        return [...this.algorithms.keys()];
    }
    /**
     * Creates a registry with all built-in harmony algorithms.
     */
    static createDefault() {
        const registry = new HarmonyRegistry();
        registry.register(new ComplementaryHarmony());
        registry.register(new AnalogousHarmony());
        registry.register(new TriadicHarmony());
        registry.register(new SplitComplementaryHarmony());
        registry.register(new TetradicHarmony());
        registry.register(new SquareHarmony());
        registry.register(new MonochromaticHarmony());
        return registry;
    }
}
//# sourceMappingURL=HarmonyRegistry.js.map