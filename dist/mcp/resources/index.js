import { NamedColorsRepository } from '../../data/NamedColorsRepository.js';
import { CulturalMeaningsRepository } from '../../data/CulturalMeaningsRepository.js';
import { ColorSpaceRegistry } from '../../color-spaces/ColorSpaceRegistry.js';
const cssColors = new NamedColorsRepository();
const xkcdColors = new NamedColorsRepository({ includeXkcd: true });
const culturalMeanings = new CulturalMeaningsRepository();
/**
 * Registers all MCP resources with the server.
 */
export function registerResources(server) {
    // CSS Named Colors resource
    server.resource('named-colors-css', 'color://named-colors/css', {
        description: '147 CSS named colors with hex values',
        mimeType: 'application/json',
    }, async () => {
        const colors = cssColors.listAll().map((c) => ({
            name: c.name,
            hex: c.hex,
        }));
        return {
            contents: [
                {
                    uri: 'color://named-colors/css',
                    text: JSON.stringify({ count: colors.length, colors }, null, 2),
                    mimeType: 'application/json',
                },
            ],
        };
    });
    // XKCD Named Colors resource
    server.resource('named-colors-xkcd', 'color://named-colors/xkcd', {
        description: '795+ XKCD survey colors with hex values (includes CSS colors)',
        mimeType: 'application/json',
    }, async () => {
        const colors = xkcdColors.listAll().map((c) => ({
            name: c.name,
            hex: c.hex,
            source: c.source,
        }));
        return {
            contents: [
                {
                    uri: 'color://named-colors/xkcd',
                    text: JSON.stringify({ count: colors.length, colors }, null, 2),
                    mimeType: 'application/json',
                },
            ],
        };
    });
    // Color Spaces reference
    server.resource('color-spaces', 'color://color-spaces', {
        description: 'Available color spaces with component info and ranges',
        mimeType: 'application/json',
    }, async () => {
        const registry = ColorSpaceRegistry.createDefault();
        const spaces = registry.list().map((type) => {
            const space = registry.get(type);
            return {
                type: space.type,
                components: space.componentNames,
                componentCount: space.componentCount,
            };
        });
        return {
            contents: [
                {
                    uri: 'color://color-spaces',
                    text: JSON.stringify({ count: spaces.length, spaces }, null, 2),
                    mimeType: 'application/json',
                },
            ],
        };
    });
    // Cultural Meanings reference
    server.resource('cultural-meanings', 'color://cultural-meanings', {
        description: 'Color meanings across 7 cultural regions',
        mimeType: 'application/json',
    }, async () => {
        const colors = culturalMeanings.listColors();
        const data = colors.map((name) => ({
            color: name,
            meanings: culturalMeanings.getByColor(name),
        }));
        return {
            contents: [
                {
                    uri: 'color://cultural-meanings',
                    text: JSON.stringify({
                        count: colors.length,
                        regions: [
                            'western',
                            'eastAsian',
                            'southAsian',
                            'middleEastern',
                            'african',
                            'latinAmerican',
                            'indigenous',
                        ],
                        colors: data,
                    }, null, 2),
                    mimeType: 'application/json',
                },
            ],
        };
    });
}
//# sourceMappingURL=index.js.map