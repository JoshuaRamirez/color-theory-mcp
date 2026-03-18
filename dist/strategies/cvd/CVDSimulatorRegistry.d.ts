import type { ICVDSimulator, ICVDSimulatorRegistry, CVDType, CVDInfo } from '../../domain/interfaces/ICVDSimulator.js';
/**
 * Registry for CVD simulators.
 */
export declare class CVDSimulatorRegistry implements ICVDSimulatorRegistry {
    private readonly simulators;
    register(simulator: ICVDSimulator): void;
    get(type: CVDType): ICVDSimulator | undefined;
    list(): readonly CVDType[];
    getAllInfo(): readonly CVDInfo[];
    /**
     * Creates a registry with all built-in simulators.
     */
    static createDefault(): CVDSimulatorRegistry;
}
//# sourceMappingURL=CVDSimulatorRegistry.d.ts.map