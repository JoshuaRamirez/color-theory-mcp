export const COLOR_SPACE_COMPONENTS = {
    srgb: ['r', 'g', 'b'],
    'linear-srgb': ['r', 'g', 'b'],
    'display-p3': ['r', 'g', 'b'],
    rec2020: ['r', 'g', 'b'],
    'prophoto-rgb': ['r', 'g', 'b'],
    acescg: ['r', 'g', 'b'],
    'xyz-d65': ['x', 'y', 'z'],
    'xyz-d50': ['x', 'y', 'z'],
    lab: ['l', 'a', 'b'],
    lch: ['l', 'c', 'h'],
    oklab: ['l', 'a', 'b'],
    oklch: ['l', 'c', 'h'],
    hsl: ['h', 's', 'l'],
    hsv: ['h', 's', 'v'],
    hwb: ['h', 'w', 'b'],
    cmyk: ['c', 'm', 'y', 'k'],
};
export const COLOR_SPACE_RANGES = {
    srgb: [
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    'linear-srgb': [
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    'display-p3': [
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    rec2020: [
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    'prophoto-rgb': [
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    acescg: [
        { min: 0, max: 65504 },
        { min: 0, max: 65504 },
        { min: 0, max: 65504 },
    ],
    'xyz-d65': [
        { min: 0, max: 0.95047 },
        { min: 0, max: 1 },
        { min: 0, max: 1.08883 },
    ],
    'xyz-d50': [
        { min: 0, max: 0.96422 },
        { min: 0, max: 1 },
        { min: 0, max: 0.82521 },
    ],
    lab: [
        { min: 0, max: 100 },
        { min: -128, max: 127 },
        { min: -128, max: 127 },
    ],
    lch: [
        { min: 0, max: 100 },
        { min: 0, max: 150 },
        { min: 0, max: 360 },
    ],
    oklab: [
        { min: 0, max: 1 },
        { min: -0.4, max: 0.4 },
        { min: -0.4, max: 0.4 },
    ],
    oklch: [
        { min: 0, max: 1 },
        { min: 0, max: 0.4 },
        { min: 0, max: 360 },
    ],
    hsl: [
        { min: 0, max: 360 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    hsv: [
        { min: 0, max: 360 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    hwb: [
        { min: 0, max: 360 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
    cmyk: [
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
        { min: 0, max: 1 },
    ],
};
export function isValidColorSpace(space) {
    return space in COLOR_SPACE_COMPONENTS;
}
//# sourceMappingURL=ColorSpaceType.js.map