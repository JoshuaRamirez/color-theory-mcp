import { ProtanopiaSimulator, ProtanomalySimulator, DeuteranopiaSimulator, DeuteranomalySimulator, TritanopiaSimulator, TritanomalySimulator, AchromatopsiaSimulator, AchromatomalySimulator, } from './CVDSimulators.js';
/**
 * Registry for CVD simulators.
 */
export class CVDSimulatorRegistry {
    simulators = new Map();
    register(simulator) {
        this.simulators.set(simulator.type, simulator);
    }
    get(type) {
        return this.simulators.get(type);
    }
    list() {
        return [...this.simulators.keys()];
    }
    getAllInfo() {
        return [...this.simulators.values()].map(s => s.info);
    }
    /**
     * Creates a registry with all built-in simulators.
     */
    static createDefault() {
        const registry = new CVDSimulatorRegistry();
        registry.register(new ProtanopiaSimulator());
        registry.register(new ProtanomalySimulator());
        registry.register(new DeuteranopiaSimulator());
        registry.register(new DeuteranomalySimulator());
        registry.register(new TritanopiaSimulator());
        registry.register(new TritanomalySimulator());
        registry.register(new AchromatopsiaSimulator());
        registry.register(new AchromatomalySimulator());
        return registry;
    }
}
//# sourceMappingURL=CVDSimulatorRegistry.js.map