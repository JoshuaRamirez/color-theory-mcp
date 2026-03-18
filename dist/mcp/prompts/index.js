import { z } from 'zod';
/**
 * Registers all MCP prompts with the server.
 */
export function registerPrompts(server) {
    // Design System palette prompt
    server.prompt('design-system', 'Generate a complete design system color palette from a brand color', { brandColor: z.string().describe('Primary brand color (hex or CSS name)') }, async ({ brandColor }) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Create a complete design system color palette based on the brand color "${brandColor}".

Use these tools in sequence:
1. **get-color-info** on "${brandColor}" to understand the base color
2. **generate-theme** with seedColor="${brandColor}" to get Material Design 3 light/dark themes
3. **generate-scale** to create a Tailwind-style 50-950 scale for the primary color
4. **generate-harmony** with type "split-complementary" for accent colors
5. **generate-accessible-palette** to ensure all generated colors meet WCAG AA on white and dark backgrounds
6. **generate-design-tokens** to export the final palette in W3C Design Token format

Present the results as a structured design system with:
- Primary, secondary, and accent color families
- Light and dark theme variants
- Accessibility validation for all foreground/background combinations
- Exportable design tokens`,
                },
            },
        ],
    }));
    // Accessibility Audit prompt
    server.prompt('accessibility-audit', 'Comprehensive accessibility audit of a color palette', {
        colors: z.string().describe('Comma-separated list of colors to audit'),
        background: z.string().optional().default('#ffffff').describe('Background color'),
    }, async ({ colors, background }) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Perform a comprehensive accessibility audit on these colors: ${colors}
Against background: ${background}

Use these tools:
1. **generate-accessible-report** with all colors against the background (includeAPCA=true, includeCVD=true)
2. **calculate-apca-contrast** for each color pair to get WCAG 3.0 contrast values
3. **validate-color-blindness** for each color to check all 8 CVD types
4. **validate-palette-harmony** to check distinguishability

Report:
- Which colors pass WCAG 2.x AA and AAA
- Which colors pass APCA thresholds for body text (Lc≥75)
- How colors appear under each color vision deficiency
- Whether all colors are sufficiently distinguishable (Delta-E > 10)
- Specific recommendations for any failing colors`,
                },
            },
        ],
    }));
    // Color Temperature prompt
    server.prompt('color-temperature', 'Explore color temperature and lighting conditions', {
        scenario: z
            .string()
            .optional()
            .default('interior-design')
            .describe('Scenario: interior-design, photography, web-design'),
    }, async ({ scenario }) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Help me understand and work with color temperature for ${scenario}.

Use these tools:
1. **calculate-temperature** with kelvin values for common light sources:
   - 2700K (warm incandescent)
   - 3500K (halogen)
   - 5000K (noon daylight)
   - 6500K (overcast/D65 standard)
   - 9000K (blue sky)
2. Show the color each temperature produces and how it affects perceived colors
3. Generate a temperature gradient from 2000K to 10000K using **calculate-temperature**

Explain how color temperature affects:
- ${scenario === 'interior-design' ? 'Room mood and paint color selection' : ''}
- ${scenario === 'photography' ? 'White balance and color grading' : ''}
- ${scenario === 'web-design' ? 'Screen calibration and design for different displays' : ''}`,
                },
            },
        ],
    }));
    // Cultural Color Analysis prompt
    server.prompt('cultural-analysis', 'Analyze colors for cultural appropriateness across regions', {
        colors: z.string().describe('Comma-separated colors to analyze'),
        purpose: z
            .string()
            .optional()
            .default('general')
            .describe('Purpose: general, business, wedding, mourning'),
    }, async ({ colors, purpose }) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Analyze the cultural meanings of these colors: ${colors}
Purpose: ${purpose}

Use these tools:
1. **get-color-meaning** for each color across all 7 cultural regions
2. **get-color-info** for each color to understand its properties

Create a cross-cultural comparison matrix showing:
- How each color is perceived in each region for the "${purpose}" context
- Potential cultural conflicts or sensitivities
- Recommendations for global-safe color choices
- Alternative colors where cultural conflicts exist`,
                },
            },
        ],
    }));
}
//# sourceMappingURL=index.js.map