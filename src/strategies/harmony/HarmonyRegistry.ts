import type { IHarmonyAlgorithm, IHarmonyRegistry, HarmonyType } from '../../domain/interfaces/IHarmonyAlgorithm.js';
import {
  ComplementaryHarmony,
  AnalogousHarmony,
  TriadicHarmony,
  SplitComplementaryHarmony,
  TetradicHarmony,
  SquareHarmony,
  MonochromaticHarmony,
} from './HarmonyAlgorithms.js';

/**
 * Registry for harmony algorithms.
 */
export class HarmonyRegistry implements IHarmonyRegistry {
  private readonly algorithms: Map<HarmonyType, IHarmonyAlgorithm> = new Map();

  register(algorithm: IHarmonyAlgorithm): void {
    this.algorithms.set(algorithm.type, algorithm);
  }

  get(type: HarmonyType): IHarmonyAlgorithm | undefined {
    return this.algorithms.get(type);
  }

  list(): readonly HarmonyType[] {
    return [...this.algorithms.keys()];
  }

  /**
   * Creates a registry with all built-in harmony algorithms.
   */
  static createDefault(): HarmonyRegistry {
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
