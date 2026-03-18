/**
 * CIE XYZ color space with D65 illuminant.
 * This is the "connection space" - all conversions go through XYZ-D65.
 */
export class XyzD65ColorSpace {
    type = 'xyz-d65';
    componentCount = 3;
    componentNames = ['X', 'Y', 'Z'];
    toXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        // Identity transformation - already in XYZ-D65
        return color;
    }
    fromXyzD65(color) {
        if (color.space !== 'xyz-d65') {
            throw new Error(`Expected xyz-d65 color, got ${color.space}`);
        }
        // Identity transformation
        return color;
    }
    isInGamut(components) {
        // XYZ can represent any visible color; no strict gamut
        const [x, y, z] = components;
        return x >= 0 && y >= 0 && z >= 0;
    }
    clampToGamut(components) {
        return components.map(c => Math.max(0, c));
    }
}
//# sourceMappingURL=XyzD65ColorSpace.js.map