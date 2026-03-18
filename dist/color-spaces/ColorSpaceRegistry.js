import { SrgbColorSpace } from './SrgbColorSpace.js';
import { LinearSrgbColorSpace } from './LinearSrgbColorSpace.js';
import { XyzD65ColorSpace } from './XyzD65ColorSpace.js';
import { XyzD50ColorSpace } from './XyzD50ColorSpace.js';
import { LabColorSpace } from './LabColorSpace.js';
import { LchColorSpace } from './LchColorSpace.js';
import { OklabColorSpace } from './OklabColorSpace.js';
import { OklchColorSpace } from './OklchColorSpace.js';
import { HslColorSpace } from './HslColorSpace.js';
import { HsvColorSpace } from './HsvColorSpace.js';
import { HwbColorSpace } from './HwbColorSpace.js';
import { DisplayP3ColorSpace } from './DisplayP3ColorSpace.js';
import { CmykColorSpace } from './CmykColorSpace.js';
/**
 * Registry for color space implementations.
 * Provides a central point for color space lookup.
 */
export class ColorSpaceRegistry {
    spaces = new Map();
    register(space) {
        this.spaces.set(space.type, space);
    }
    get(type) {
        return this.spaces.get(type);
    }
    list() {
        return [...this.spaces.keys()];
    }
    /**
     * Creates a registry with all built-in color spaces registered.
     */
    static createDefault() {
        const registry = new ColorSpaceRegistry();
        registry.register(new SrgbColorSpace());
        registry.register(new LinearSrgbColorSpace());
        registry.register(new XyzD65ColorSpace());
        registry.register(new XyzD50ColorSpace());
        registry.register(new LabColorSpace());
        registry.register(new LchColorSpace());
        registry.register(new OklabColorSpace());
        registry.register(new OklchColorSpace());
        registry.register(new HslColorSpace());
        registry.register(new HsvColorSpace());
        registry.register(new HwbColorSpace());
        registry.register(new DisplayP3ColorSpace());
        registry.register(new CmykColorSpace());
        return registry;
    }
}
//# sourceMappingURL=ColorSpaceRegistry.js.map