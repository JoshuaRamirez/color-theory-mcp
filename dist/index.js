import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');
// Query tools
import { getColorInfo, getColorInfoSchema, getColorName, getColorNameSchema, getColorMeaning, getColorMeaningSchema, listNamedColors, listNamedColorsSchema, } from './mcp/tools/query/index.js';
// Convert tools
import { convertColor, convertColorSchema, convertBatch, convertBatchSchema, parseColorString, parseColorStringSchema, } from './mcp/tools/convert/index.js';
// Calculate tools
import { calculateContrast, calculateContrastSchema, calculateDeltaE, calculateDeltaESchema, calculateLuminance, calculateLuminanceSchema, mixColors, mixColorsSchema, adjustColor, adjustColorSchema, } from './mcp/tools/calculate/index.js';
// Generate tools
import { generateHarmony, generateHarmonySchema, generatePalette, generatePaletteSchema, generateGradient, generateGradientSchema, generateAccessiblePalette, generateAccessiblePaletteSchema, generateScale, generateScaleSchema, } from './mcp/tools/generate/index.js';
// Validate tools
import { validateWcagContrast, validateWcagContrastSchema, validateColorBlindness, validateColorBlindnessSchema, validateGamut, validateGamutSchema, validatePrintSafe, validatePrintSafeSchema, validatePaletteHarmony, validatePaletteHarmonySchema, } from './mcp/tools/validate/index.js';
const server = new McpServer({
    name: 'color-theory-mcp',
    version: pkg.version,
});
// ============================================
// Query Tools (4)
// ============================================
server.tool('get-color-info', 'Get comprehensive information about a color including all formats, perceptual values, and analysis', getColorInfoSchema.shape, async (input) => {
    const result = await getColorInfo(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('get-color-name', 'Find the closest CSS named color to a given color value', getColorNameSchema.shape, async (input) => {
    const result = await getColorName(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('get-color-meaning', 'Get cultural and psychological meanings of a color across different regions', getColorMeaningSchema.shape, async (input) => {
    const result = await getColorMeaning(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('list-named-colors', 'List CSS named colors with optional filtering', listNamedColorsSchema.shape, async (input) => {
    const result = await listNamedColors(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
// ============================================
// Convert Tools (3)
// ============================================
server.tool('convert-color', 'Convert a color to a different color space (sRGB, Lab, Oklch, HSL, CMYK, etc.)', convertColorSchema.shape, async (input) => {
    const result = await convertColor(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('convert-batch', 'Convert multiple colors to a target color space at once', convertBatchSchema.shape, async (input) => {
    const result = await convertBatch(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('parse-color-string', 'Parse any CSS color string and return normalized values', parseColorStringSchema.shape, async (input) => {
    const result = await parseColorString(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
// ============================================
// Calculate Tools (5)
// ============================================
server.tool('calculate-contrast', 'Calculate WCAG contrast ratio between two colors', calculateContrastSchema.shape, async (input) => {
    const result = await calculateContrast(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('calculate-delta-e', 'Calculate perceptual color difference (Delta-E) between two colors', calculateDeltaESchema.shape, async (input) => {
    const result = await calculateDeltaE(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('calculate-luminance', 'Calculate the relative luminance of a color', calculateLuminanceSchema.shape, async (input) => {
    const result = await calculateLuminance(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('mix-colors', 'Mix two colors together with optional gradient generation', mixColorsSchema.shape, async (input) => {
    const result = await mixColors(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('adjust-color', 'Adjust a color by lightening, darkening, saturating, desaturating, or rotating hue', adjustColorSchema.shape, async (input) => {
    const result = await adjustColor(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
// ============================================
// Generate Tools (5)
// ============================================
server.tool('generate-harmony', 'Generate a color harmony palette (complementary, analogous, triadic, etc.)', generateHarmonySchema.shape, async (input) => {
    const result = await generateHarmony(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('generate-palette', 'Generate a complete design system palette from a base color', generatePaletteSchema.shape, async (input) => {
    const result = await generatePalette(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('generate-gradient', 'Generate a smooth color gradient between two colors', generateGradientSchema.shape, async (input) => {
    const result = await generateGradient(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('generate-accessible-palette', 'Generate WCAG-compliant versions of colors for a given background', generateAccessiblePaletteSchema.shape, async (input) => {
    const result = await generateAccessiblePalette(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('generate-scale', 'Generate a Tailwind-style color scale (50-950) from a base color', generateScaleSchema.shape, async (input) => {
    const result = await generateScale(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
// ============================================
// Validate Tools (5)
// ============================================
server.tool('validate-wcag-contrast', 'Check if a color combination meets WCAG accessibility requirements', validateWcagContrastSchema.shape, async (input) => {
    const result = await validateWcagContrast(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('validate-color-blindness', 'Simulate how colors appear to people with color vision deficiencies', validateColorBlindnessSchema.shape, async (input) => {
    const result = await validateColorBlindness(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('validate-gamut', 'Check if a color is within a specific color space gamut', validateGamutSchema.shape, async (input) => {
    const result = await validateGamut(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('validate-print-safe', 'Check if a color will reproduce well in CMYK print', validatePrintSafeSchema.shape, async (input) => {
    const result = await validatePrintSafe(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
server.tool('validate-palette-harmony', 'Analyze a palette for color harmony and distinguishability', validatePaletteHarmonySchema.shape, async (input) => {
    const result = await validatePaletteHarmony(input);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
// ============================================
// Start Server
// ============================================
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Color Theory MCP Server started');
}
main().catch(console.error);
//# sourceMappingURL=index.js.map