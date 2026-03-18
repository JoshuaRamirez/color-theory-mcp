import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ContrastService } from '../../../services/ContrastService.js';
import { APCAService } from '../../../services/APCAService.js';
import { ConversionService } from '../../../services/ConversionService.js';
import { CVDSimulatorRegistry } from '../../../strategies/cvd/index.js';
import { DeltaERegistry } from '../../../strategies/delta-e/index.js';
const contrastService = new ContrastService();
const apcaService = new APCAService();
const conversionService = new ConversionService();
const cvdRegistry = CVDSimulatorRegistry.createDefault();
const deltaERegistry = DeltaERegistry.createDefault();
export const generateAccessibleReportSchema = z.object({
    colors: z.array(z.string()).describe('Colors to audit'),
    backgroundColor: z.string().describe('Background color'),
    includeAPCA: z.boolean().optional().default(true).describe('Include APCA analysis'),
    includeCVD: z.boolean().optional().default(true).describe('Include color vision deficiency simulation'),
});
/**
 * Generates a comprehensive accessibility audit for a palette of colors
 * against a background. Evaluates WCAG contrast, optionally APCA contrast,
 * optionally CVD simulation, and checks pairwise distinguishability via Delta-E.
 */
export async function generateAccessibleReport(input) {
    const includeAPCA = input.includeAPCA ?? true;
    const includeCVD = input.includeCVD ?? true;
    const bgColor = parseColor(input.backgroundColor);
    const bgSrgb = conversionService.convert(bgColor, 'srgb');
    const bgClamped = conversionService.clampToGamut(bgSrgb);
    // Parse all input colors
    const parsedColors = input.colors.map((colorStr) => {
        const parsed = parseColor(colorStr);
        const srgb = conversionService.convert(parsed, 'srgb');
        return conversionService.clampToGamut(srgb);
    });
    // Audit each color against the background
    let wcagAAPassCount = 0;
    let wcagAAAPassCount = 0;
    let apcaBodyTextPassCount = 0;
    const colorResults = parsedColors.map((color, index) => {
        const hex = color.toHex();
        // WCAG contrast
        const wcagResult = contrastService.checkContrast(color, bgClamped);
        if (wcagResult.passes.AA.normal) {
            wcagAAPassCount++;
        }
        if (wcagResult.passes.AAA.normal) {
            wcagAAAPassCount++;
        }
        const colorEntry = {
            input: input.colors[index],
            hex,
            wcag: {
                ratio: Math.round(wcagResult.ratio * 100) / 100,
                AA: {
                    normal: wcagResult.passes.AA.normal,
                    large: wcagResult.passes.AA.large,
                },
                AAA: {
                    normal: wcagResult.passes.AAA.normal,
                    large: wcagResult.passes.AAA.large,
                },
            },
        };
        // APCA analysis
        if (includeAPCA) {
            const apcaResult = apcaService.calculateAPCA(color, bgClamped);
            if (apcaResult.meetsMinimum.bodyText) {
                apcaBodyTextPassCount++;
            }
            colorEntry.apca = {
                Lc: Math.round(apcaResult.Lc * 100) / 100,
                passes: {
                    bodyText: apcaResult.meetsMinimum.bodyText,
                    largeText: apcaResult.meetsMinimum.largeText,
                },
            };
        }
        // CVD simulation
        if (includeCVD) {
            const cvdEntries = {};
            const deltaEStrategy = deltaERegistry.get('CIEDE2000');
            for (const cvdType of cvdRegistry.list()) {
                const simulator = cvdRegistry.get(cvdType);
                if (!simulator) {
                    continue;
                }
                const simulated = simulator.simulate(color);
                const simSrgb = conversionService.convert(simulated, 'srgb');
                const simClamped = conversionService.clampToGamut(simSrgb);
                const deltaE = deltaEStrategy
                    ? deltaEStrategy.calculate(color, simClamped)
                    : 0;
                cvdEntries[cvdType] = {
                    simulatedHex: simClamped.toHex(),
                    deltaEFromOriginal: Math.round(deltaE * 100) / 100,
                };
            }
            colorEntry.cvd = cvdEntries;
        }
        return colorEntry;
    });
    // Pairwise distinguishability (Delta-E between all color pairs)
    const deltaEStrategy = deltaERegistry.get('CIEDE2000');
    const pairwiseResults = [];
    let allDistinguishable = true;
    if (deltaEStrategy && parsedColors.length > 1) {
        for (let i = 0; i < parsedColors.length; i++) {
            for (let j = i + 1; j < parsedColors.length; j++) {
                const dE = deltaEStrategy.calculate(parsedColors[i], parsedColors[j]);
                const rounded = Math.round(dE * 100) / 100;
                const distinguishable = rounded > 10;
                if (!distinguishable) {
                    allDistinguishable = false;
                }
                pairwiseResults.push({
                    color1: parsedColors[i].toHex(),
                    color2: parsedColors[j].toHex(),
                    deltaE: rounded,
                    distinguishable,
                });
            }
        }
    }
    const summary = {
        totalColors: parsedColors.length,
        wcagAAPass: wcagAAPassCount,
        wcagAAAPass: wcagAAAPassCount,
        distinguishable: allDistinguishable,
    };
    if (includeAPCA) {
        summary.apcaBodyTextPass = apcaBodyTextPassCount;
    }
    return {
        background: { hex: bgClamped.toHex() },
        summary,
        colors: colorResults,
        pairwiseDistinguishability: pairwiseResults.length > 0 ? pairwiseResults : undefined,
    };
}
//# sourceMappingURL=generateAccessibleReport.js.map