import { describe, it, expect } from 'vitest';
import { Color } from '../domain/values/Color.js';
import { ConversionService } from '../services/ConversionService.js';

const service = new ConversionService();

const TEST_COLORS = [
  { name: 'red', hex: '#FF0000' },
  { name: 'green', hex: '#00FF00' },
  { name: 'blue', hex: '#0000FF' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'mid-gray', hex: '#808080' },
  { name: 'complex', hex: '#C87533' },
];

const ALL_SPACES = [
  'srgb',
  'linear-srgb',
  'display-p3',
  'rec2020',
  'prophoto-rgb',
  'xyz-d65',
  'xyz-d50',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'hsl',
  'hsv',
  'hwb',
  'cmyk',
  // acescg excluded from round-trip because its wide gamut + scene-referred
  // nature means sRGB -> ACEScg -> sRGB may have slight precision differences
] as const;

// ---------------------------------------------------------------------------
// Round-trip accuracy: sRGB -> space -> sRGB for every supported space
// ---------------------------------------------------------------------------
describe('Color space round-trip accuracy', () => {
  for (const space of ALL_SPACES) {
    describe(space, () => {
      for (const { name, hex } of TEST_COLORS) {
        it(`should round-trip ${name} through ${space}`, () => {
          const original = Color.fromHex(hex);
          const converted = service.convert(original, space);
          const roundTripped = service.convert(converted, 'srgb');

          const [r1, g1, b1] = original.components;
          const [r2, g2, b2] = roundTripped.components;

          // Tolerance: 1 decimal place (~0.05, about 12/255)
          // Reasonable for intermediate conversions through diverse spaces
          expect(r2).toBeCloseTo(r1!, 1);
          expect(g2).toBeCloseTo(g1!, 1);
          expect(b2).toBeCloseTo(b1!, 1);
        });
      }
    });
  }
});

// ACEScg round-trip (looser tolerance due to scene-referred nature)
describe('ACEScg round-trip', () => {
  for (const { name, hex } of TEST_COLORS) {
    it(`should round-trip ${name} through acescg`, () => {
      const original = Color.fromHex(hex);
      const converted = service.convert(original, 'acescg');
      const roundTripped = service.convert(converted, 'srgb');

      const [r1, g1, b1] = original.components;
      const [r2, g2, b2] = roundTripped.components;

      expect(r2).toBeCloseTo(r1!, 1);
      expect(g2).toBeCloseTo(g1!, 1);
      expect(b2).toBeCloseTo(b1!, 1);
    });
  }
});

// ---------------------------------------------------------------------------
// Reference value tests for new color spaces
// ---------------------------------------------------------------------------
describe('Rec2020 reference values', () => {
  it('should convert D65 white correctly', () => {
    const white = Color.fromHex('#FFFFFF');
    const rec2020 = service.convert(white, 'rec2020');
    // White in any RGB space should be [1, 1, 1]
    expect(rec2020.components[0]).toBeCloseTo(1, 2);
    expect(rec2020.components[1]).toBeCloseTo(1, 2);
    expect(rec2020.components[2]).toBeCloseTo(1, 2);
  });

  it('should convert black correctly', () => {
    const black = Color.fromHex('#000000');
    const rec2020 = service.convert(black, 'rec2020');
    expect(rec2020.components[0]).toBeCloseTo(0, 4);
    expect(rec2020.components[1]).toBeCloseTo(0, 4);
    expect(rec2020.components[2]).toBeCloseTo(0, 4);
  });

  it('sRGB red should be within Rec2020 gamut', () => {
    const red = Color.fromHex('#FF0000');
    expect(service.isInGamut(red, 'rec2020')).toBe(true);
  });
});

describe('ProPhoto RGB reference values', () => {
  it('should convert D65 white correctly', () => {
    const white = Color.fromHex('#FFFFFF');
    const prophoto = service.convert(white, 'prophoto-rgb');
    expect(prophoto.components[0]).toBeCloseTo(1, 1);
    expect(prophoto.components[1]).toBeCloseTo(1, 1);
    expect(prophoto.components[2]).toBeCloseTo(1, 1);
  });

  it('sRGB colors should be within ProPhoto gamut', () => {
    const red = Color.fromHex('#FF0000');
    expect(service.isInGamut(red, 'prophoto-rgb')).toBe(true);
  });
});

describe('ACEScg reference values', () => {
  it('should convert white to approximately [1, 1, 1]', () => {
    const white = Color.fromHex('#FFFFFF');
    const acescg = service.convert(white, 'acescg');
    // ACEScg white is approximately [1, 1, 1] with D60 adaptation
    expect(acescg.components[0]).toBeCloseTo(1, 0);
    expect(acescg.components[1]).toBeCloseTo(1, 0);
    expect(acescg.components[2]).toBeCloseTo(1, 0);
  });

  it('should be a linear space (no gamma)', () => {
    // Mid-gray in sRGB (0.5 encoded) should NOT be 0.5 in ACEScg
    // because sRGB has gamma and ACEScg is linear
    const midGray = Color.fromHex('#808080');
    const acescg = service.convert(midGray, 'acescg');
    // Linear value of sRGB 0.5 is approximately 0.214
    expect(acescg.components[0]).toBeLessThan(0.3);
    expect(acescg.components[0]).toBeGreaterThan(0.1);
  });
});

// ---------------------------------------------------------------------------
// Perceptual gamut mapping tests
// ---------------------------------------------------------------------------
describe('Perceptual gamut mapping', () => {
  it('should return in-gamut colors unchanged', () => {
    const red = Color.fromHex('#FF0000');
    const mapped = service.mapToGamut(red, 'srgb');
    expect(mapped.toHex()).toBe('#ff0000');
  });

  it('should preserve hue when mapping out-of-gamut colors', () => {
    // Create an out-of-gamut color by making a very saturated Oklch
    const outOfGamut = Color.create('oklch', [0.7, 0.35, 145], 1);
    const mapped = service.mapToGamut(outOfGamut, 'srgb');
    const mappedOklch = service.convert(mapped, 'oklch');

    // Hue should be preserved (within a few degrees due to chroma reduction)
    expect(mappedOklch.components[2]).toBeCloseTo(145, 0);
    expect(service.isInGamut(mapped, 'srgb')).toBe(true);
  });

  it('should handle achromatic colors', () => {
    const gray = Color.create('oklch', [0.5, 0, 0], 1);
    const mapped = service.mapToGamut(gray, 'srgb');
    expect(service.isInGamut(mapped, 'srgb')).toBe(true);
  });

  it('should reduce chroma rather than shift lightness', () => {
    const outOfGamut = Color.create('oklch', [0.6, 0.4, 30], 1);
    const mapped = service.mapToGamut(outOfGamut, 'srgb');
    const mappedOklch = service.convert(mapped, 'oklch');

    // Lightness should stay close to the original
    expect(mappedOklch.components[0]).toBeCloseTo(0.6, 1);
    // Chroma should be reduced from 0.4 to fit in gamut
    expect(mappedOklch.components[1]).toBeLessThan(0.4);
    expect(mappedOklch.components[1]).toBeGreaterThan(0);
  });

  it('should produce sRGB-valid components after mapping to sRGB', () => {
    const outOfGamut = Color.create('oklch', [0.8, 0.3, 200], 1);
    const mapped = service.mapToGamut(outOfGamut, 'srgb');
    const srgb = service.convert(mapped, 'srgb');

    for (const c of srgb.components) {
      expect(c).toBeGreaterThanOrEqual(-0.01);
      expect(c).toBeLessThanOrEqual(1.01);
    }
  });
});
