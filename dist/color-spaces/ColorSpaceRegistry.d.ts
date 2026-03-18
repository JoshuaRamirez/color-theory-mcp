import type { IColorSpace, IColorSpaceRegistry } from '../domain/interfaces/IColorSpace.js';
import type { ColorSpaceType } from '../domain/values/ColorSpaceType.js';
/**
 * Registry for color space implementations.
 * Provides a central point for color space lookup.
 */
export declare class ColorSpaceRegistry implements IColorSpaceRegistry {
    private readonly spaces;
    register(space: IColorSpace): void;
    get(type: ColorSpaceType): IColorSpace | undefined;
    list(): readonly ColorSpaceType[];
    /**
     * Creates a registry with all built-in color spaces registered.
     */
    static createDefault(): ColorSpaceRegistry;
}
//# sourceMappingURL=ColorSpaceRegistry.d.ts.map