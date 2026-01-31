import type { IDeltaEStrategy, IDeltaERegistry, DeltaEMethod } from '../../domain/interfaces/IDeltaEStrategy.js';
import { CIE76Strategy } from './CIE76Strategy.js';
import { CIE94Strategy } from './CIE94Strategy.js';
import { CIEDE2000Strategy } from './CIEDE2000Strategy.js';

/**
 * Registry for Delta-E calculation strategies.
 */
export class DeltaERegistry implements IDeltaERegistry {
  private readonly strategies: Map<DeltaEMethod, IDeltaEStrategy> = new Map();
  private defaultStrategy: IDeltaEStrategy;

  constructor() {
    this.defaultStrategy = new CIEDE2000Strategy();
  }

  register(strategy: IDeltaEStrategy): void {
    this.strategies.set(strategy.method, strategy);
  }

  get(method: DeltaEMethod): IDeltaEStrategy | undefined {
    return this.strategies.get(method);
  }

  list(): readonly DeltaEMethod[] {
    return [...this.strategies.keys()];
  }

  getDefault(): IDeltaEStrategy {
    return this.defaultStrategy;
  }

  /**
   * Creates a registry with all built-in strategies registered.
   */
  static createDefault(): DeltaERegistry {
    const registry = new DeltaERegistry();

    registry.register(new CIE76Strategy());
    registry.register(new CIE94Strategy());
    registry.register(new CIEDE2000Strategy());

    return registry;
  }
}
