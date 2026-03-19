import { Color } from '../domain/values/Color.js';
import { ConversionService } from './ConversionService.js';
import { HarmonyRegistry } from '../strategies/harmony/HarmonyRegistry.js';
const conversionService = new ConversionService();
/**
 * Service for generating color palettes and scales.
 */
export class PaletteService {
    harmonyRegistry;
    constructor(harmonyRegistry) {
        this.harmonyRegistry = harmonyRegistry ?? HarmonyRegistry.createDefault();
    }
    /**
     * Generates a harmony palette from a base color.
     */
    generateHarmony(baseColor, harmonyType, options) {
        const algorithm = this.harmonyRegistry.get(harmonyType);
        if (!algorithm) {
            throw new Error(`Unknown harmony type: ${harmonyType}`);
        }
        return algorithm.generate(baseColor, options);
    }
    /**
     * Generates a Tailwind-style color scale (50-950).
     * Uses Oklch for perceptually uniform lightness distribution.
     */
    generateScale(baseColor, options) {
        const steps = options?.steps ?? [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        // Convert to Oklch for perceptual manipulation
        const oklchColor = conversionService.convert(baseColor, 'oklch');
        const [, C, H] = oklchColor.components;
        // Lightness values for each step (empirically determined for good results)
        const lightnessMap = {
            50: 0.97,
            100: 0.93,
            200: 0.87,
            300: 0.78,
            400: 0.67,
            500: 0.55,
            600: 0.45,
            700: 0.35,
            800: 0.27,
            900: 0.20,
            950: 0.13,
        };
        // Chroma adjustments (more saturated in mid-tones)
        const chromaMultiplier = {
            50: 0.3,
            100: 0.5,
            200: 0.7,
            300: 0.85,
            400: 0.95,
            500: 1.0,
            600: 1.0,
            700: 0.95,
            800: 0.85,
            900: 0.7,
            950: 0.55,
        };
        const resultSteps = new Map();
        for (const step of steps) {
            const L = lightnessMap[step];
            const adjustedC = C * chromaMultiplier[step];
            const stepOklch = Color.create('oklch', [L, adjustedC, H], baseColor.alpha);
            const stepColor = conversionService.convert(stepOklch, baseColor.space);
            resultSteps.set(step, stepColor);
        }
        return {
            baseColor,
            steps: resultSteps,
        };
    }
    /**
     * Mixes two colors together.
     * Uses Oklch for perceptually uniform blending.
     */
    mixColors(color1, color2, ratio = 0.5) {
        const t = Math.max(0, Math.min(1, ratio));
        // Convert both to Oklch
        const oklch1 = conversionService.convert(color1, 'oklch');
        const oklch2 = conversionService.convert(color2, 'oklch');
        const [L1, C1, H1] = oklch1.components;
        const [L2, C2, H2] = oklch2.components;
        // Interpolate lightness and chroma linearly
        const L = L1 * (1 - t) + L2 * t;
        const C = C1 * (1 - t) + C2 * t;
        // Interpolate hue (handling wraparound)
        let H;
        const hueDiff = H2 - H1;
        if (Math.abs(hueDiff) <= 180) {
            H = H1 + hueDiff * t;
        }
        else if (hueDiff > 180) {
            H = H1 + (hueDiff - 360) * t;
        }
        else {
            H = H1 + (hueDiff + 360) * t;
        }
        H = ((H % 360) + 360) % 360;
        // Interpolate alpha
        const alpha = color1.alpha * (1 - t) + color2.alpha * t;
        const mixed = Color.create('oklch', [L, C, H], alpha);
        return conversionService.convert(mixed, color1.space);
    }
    /**
     * Mixes two colors in a specified interpolation space.
     * Handles hue-wrap interpolation for cylindrical spaces (oklch, lch, hsl).
     */
    mixColorsInSpace(color1, color2, ratio = 0.5, interpolationSpace = 'oklch') {
        const t = Math.max(0, Math.min(1, ratio));
        const c1 = conversionService.convert(color1, interpolationSpace);
        const c2 = conversionService.convert(color2, interpolationSpace);
        // Cylindrical spaces require shortest-path hue interpolation
        const isHueSpace = ['oklch', 'lch', 'hsl'].includes(interpolationSpace);
        const hueIndex = interpolationSpace === 'hsl' ? 0 : 2; // HSL has hue first, Oklch/Lch last
        const mixed = [];
        for (let i = 0; i < c1.components.length; i++) {
            const v1 = c1.components[i];
            const v2 = c2.components[i];
            if (isHueSpace && i === hueIndex) {
                // Shortest-path hue interpolation across the 0-360 boundary
                let diff = v2 - v1;
                if (Math.abs(diff) > 180) {
                    diff = diff > 0 ? diff - 360 : diff + 360;
                }
                let h = v1 + diff * t;
                h = ((h % 360) + 360) % 360;
                mixed.push(h);
            }
            else {
                mixed.push(v1 * (1 - t) + v2 * t);
            }
        }
        const alpha = color1.alpha * (1 - t) + color2.alpha * t;
        const result = Color.create(interpolationSpace, mixed, alpha);
        return conversionService.convert(result, color1.space);
    }
    /**
     * Adjusts a color's properties.
     */
    adjustColor(color, adjustments) {
        const oklch = conversionService.convert(color, 'oklch');
        let [L, C, H] = oklch.components;
        // Apply lightness adjustments
        if (adjustments.lighten) {
            L = Math.min(1, L + adjustments.lighten * (1 - L));
        }
        if (adjustments.darken) {
            L = Math.max(0, L - adjustments.darken * L);
        }
        // Apply saturation adjustments
        if (adjustments.saturate) {
            C = Math.min(0.4, C + adjustments.saturate * (0.4 - C));
        }
        if (adjustments.desaturate) {
            C = Math.max(0, C - adjustments.desaturate * C);
        }
        // Apply hue rotation
        if (adjustments.rotate) {
            H = ((H + adjustments.rotate) % 360 + 360) % 360;
        }
        const adjusted = Color.create('oklch', [L, C, H], color.alpha);
        return conversionService.convert(adjusted, color.space);
    }
    /**
     * Generates a gradient between colors.
     */
    generateGradient(startColor, endColor, steps) {
        if (steps < 2) {
            throw new Error('Gradient must have at least 2 steps');
        }
        const colors = [];
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            colors.push(this.mixColors(startColor, endColor, t));
        }
        return colors;
    }
    /**
     * Generates a gradient through multiple color stops.
     * Each adjacent pair is interpolated evenly, and steps are distributed
     * proportionally across segments.
     */
    generateMultiStopGradient(colors, totalSteps, interpolationSpace = 'oklch') {
        if (colors.length < 2) {
            throw new Error('Gradient requires at least 2 colors');
        }
        if (totalSteps < colors.length) {
            throw new Error('Total steps must be at least the number of colors');
        }
        if (colors.length === 2) {
            return this.generateGradientInSpace(colors[0], colors[1], totalSteps, interpolationSpace);
        }
        // Distribute steps across segments
        const segments = colors.length - 1;
        const stepsPerSegment = Math.floor((totalSteps - 1) / segments);
        const extraSteps = (totalSteps - 1) % segments;
        const result = [];
        for (let seg = 0; seg < segments; seg++) {
            const segSteps = stepsPerSegment + (seg < extraSteps ? 1 : 0);
            const start = colors[seg];
            const end = colors[seg + 1];
            for (let i = 0; i < segSteps; i++) {
                const t = segSteps === 0 ? 0 : i / segSteps;
                result.push(this.mixColorsInSpace(start, end, t, interpolationSpace));
            }
        }
        // Always include the last color
        result.push(colors[colors.length - 1]);
        return result;
    }
    /**
     * Generates a 2-color gradient in a specified interpolation space.
     */
    generateGradientInSpace(startColor, endColor, steps, interpolationSpace = 'oklch') {
        if (steps < 2) {
            throw new Error('Gradient must have at least 2 steps');
        }
        const result = [];
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            result.push(this.mixColorsInSpace(startColor, endColor, t, interpolationSpace));
        }
        return result;
    }
}
//# sourceMappingURL=PaletteService.js.map