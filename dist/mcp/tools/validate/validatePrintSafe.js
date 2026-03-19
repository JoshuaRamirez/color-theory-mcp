import { z } from 'zod';
import { parseColor } from '../parseColor.js';
import { ConversionService } from '../../../services/ConversionService.js';
const conversionService = new ConversionService();
export const validatePrintSafeSchema = z.object({
    color: z.string().describe('Color to check for print safety'),
});
function reduceInkCoverage(c, m, y, k, targetTotal) {
    // GCR (Gray Component Replacement): convert shared CMY into K
    const minCMY = Math.min(c, m, y);
    const currentTotal = (c + m + y + k) * 100;
    if (currentTotal <= targetTotal) {
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100),
        };
    }
    // Replace shared CMY with K (GCR)
    const replacement = Math.min(minCMY, (currentTotal - targetTotal) / 300);
    return {
        c: Math.round((c - replacement) * 100),
        m: Math.round((m - replacement) * 100),
        y: Math.round((y - replacement) * 100),
        k: Math.round((k + replacement) * 100),
    };
}
export async function validatePrintSafe(input) {
    const color = parseColor(input.color);
    // Convert to CMYK
    const cmyk = conversionService.convert(color, 'cmyk');
    const [c, m, y, k] = cmyk.components;
    // Convert to sRGB for display
    const srgb = conversionService.convert(color, 'srgb');
    // Check for potential print issues
    const issues = [];
    const warnings = [];
    // High total ink coverage (>300% is often problematic)
    const totalInk = (c + m + y + k) * 100;
    if (totalInk > 300) {
        issues.push(`Total ink coverage (${Math.round(totalInk)}%) exceeds 300% - may cause bleeding or drying issues`);
    }
    else if (totalInk > 280) {
        warnings.push(`Total ink coverage (${Math.round(totalInk)}%) is high - consider reducing for better print quality`);
    }
    // Very saturated colors may not reproduce accurately
    const maxChannel = Math.max(c, m, y);
    if (maxChannel > 0.95 && k < 0.1) {
        warnings.push('Highly saturated color may not reproduce accurately on all printers');
    }
    // Pure black recommendation
    if (c === 0 && m === 0 && y === 0 && k === 1) {
        // Good - pure K black
    }
    else if (c + m + y > 0 && k > 0.9) {
        warnings.push('Consider using "rich black" (adding CMY to K) for deeper blacks in large areas');
    }
    // Very light colors may be hard to reproduce
    if (c + m + y + k < 0.05) {
        warnings.push('Very light color may appear as white when printed');
    }
    // Neon/fluorescent colors
    const hsl = conversionService.convert(color, 'hsl');
    const [_h, s, l] = hsl.components;
    if (s > 0.9 && l > 0.5) {
        warnings.push('Highly saturated bright colors may appear duller in print than on screen');
    }
    // Check if color is out of CMYK gamut and suggest closest printable version
    const isOutOfGamut = !conversionService.isInGamut(color, 'cmyk');
    let gamutMapped;
    if (isOutOfGamut || maxChannel > 0.95) {
        // Use perceptual gamut mapping to find closest printable color
        const mapped = conversionService.mapToGamut(color, 'srgb');
        const mappedCmyk = conversionService.convert(mapped, 'cmyk');
        const [mc, mm, my, mk] = mappedCmyk.components;
        const mappedSrgb = conversionService.convert(mapped, 'srgb');
        gamutMapped = {
            hex: mappedSrgb.toHex(),
            cmyk: {
                c: Math.round(mc * 100),
                m: Math.round(mm * 100),
                y: Math.round(my * 100),
                k: Math.round(mk * 100),
            },
            note: 'Closest perceptually faithful printable color (hue and lightness preserved)',
        };
        // Also check if total ink can be reduced
        const mappedTotalInk = (mc + mm + my + mk) * 100;
        if (mappedTotalInk > 280) {
            // Suggest increasing K to reduce total ink
            const inkReduced = reduceInkCoverage(mc, mm, my, mk, 280);
            gamutMapped.cmyk = inkReduced;
            gamutMapped.note += `. Ink coverage optimized to ${inkReduced.c + inkReduced.m + inkReduced.y + inkReduced.k}%`;
        }
    }
    const printSafe = issues.length === 0;
    return {
        input: input.color,
        hex: srgb.toHex(),
        printSafe,
        cmyk: {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100),
            string: `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`,
        },
        analysis: {
            totalInkCoverage: `${Math.round(totalInk)}%`,
            recommendedMax: '300%',
            issues: issues.length > 0 ? issues : undefined,
            warnings: warnings.length > 0 ? warnings : undefined,
        },
        recommendations: printSafe
            ? ['Color should print well on most commercial printers']
            : [
                'Consider adjusting the color to reduce ink coverage',
                'Request a proof print before final production',
                'Discuss with your printer about their ink coverage limits',
            ],
        gamutMapping: gamutMapped,
        note: 'CMYK conversion is approximate. For accurate print colors, use ICC profiles and professional color management.',
    };
}
//# sourceMappingURL=validatePrintSafe.js.map