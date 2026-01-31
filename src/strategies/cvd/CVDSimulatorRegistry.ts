import type { ICVDSimulator, ICVDSimulatorRegistry, CVDType, CVDInfo } from '../../domain/interfaces/ICVDSimulator.js';
import {
  ProtanopiaSimulator,
  ProtanomalySimulator,
  DeuteranopiaSimulator,
  DeuteranomalySimulator,
  TritanopiaSimulator,
  TritanomalySimulator,
  AchromatopsiaSimulator,
  AchromatomalySimulator,
} from './CVDSimulators.js';

/**
 * Registry for CVD simulators.
 */
export class CVDSimulatorRegistry implements ICVDSimulatorRegistry {
  private readonly simulators: Map<CVDType, ICVDSimulator> = new Map();

  register(simulator: ICVDSimulator): void {
    this.simulators.set(simulator.type, simulator);
  }

  get(type: CVDType): ICVDSimulator | undefined {
    return this.simulators.get(type);
  }

  list(): readonly CVDType[] {
    return [...this.simulators.keys()];
  }

  getAllInfo(): readonly CVDInfo[] {
    return [...this.simulators.values()].map(s => s.info);
  }

  /**
   * Creates a registry with all built-in simulators.
   */
  static createDefault(): CVDSimulatorRegistry {
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
