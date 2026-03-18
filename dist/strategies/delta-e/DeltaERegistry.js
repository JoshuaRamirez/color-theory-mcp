import { CIE76Strategy } from './CIE76Strategy.js';
import { CIE94Strategy } from './CIE94Strategy.js';
import { CIEDE2000Strategy } from './CIEDE2000Strategy.js';
/**
 * Registry for Delta-E calculation strategies.
 */
export class DeltaERegistry {
    strategies = new Map();
    defaultStrategy;
    constructor() {
        this.defaultStrategy = new CIEDE2000Strategy();
    }
    register(strategy) {
        this.strategies.set(strategy.method, strategy);
    }
    get(method) {
        return this.strategies.get(method);
    }
    list() {
        return [...this.strategies.keys()];
    }
    getDefault() {
        return this.defaultStrategy;
    }
    /**
     * Creates a registry with all built-in strategies registered.
     */
    static createDefault() {
        const registry = new DeltaERegistry();
        registry.register(new CIE76Strategy());
        registry.register(new CIE94Strategy());
        registry.register(new CIEDE2000Strategy());
        return registry;
    }
}
//# sourceMappingURL=DeltaERegistry.js.map