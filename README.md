# Color Theory MCP Server

A comprehensive MCP (Model Context Protocol) server providing 24 tools for color theory operations including color space conversions, harmony generation, accessibility validation, and cultural meaning lookup.

## Features

- **13 Color Spaces**: sRGB, Linear sRGB, Display P3, XYZ-D65, XYZ-D50, Lab, LCH, Oklab, Oklch, HSL, HSV, HWB, CMYK
- **7 Harmony Algorithms**: Complementary, Analogous, Triadic, Split-complementary, Tetradic, Square, Monochromatic
- **WCAG Accessibility**: Contrast ratio calculation, AA/AAA compliance validation
- **Color Vision Deficiency**: Simulation for protanopia, deuteranopia, tritanopia, and more
- **Delta-E Calculations**: CIE76, CIE94, CIEDE2000 perceptual difference formulas
- **147 CSS Named Colors**: Lookup and closest match finding
- **Cultural Meanings**: Color associations across Western, East Asian, South Asian, and Middle Eastern cultures

## Installation

```bash
npm install
npm run build
```

## Usage

### With Claude Code

Add to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "color-theory": {
      "command": "node",
      "args": ["/path/to/color-theory-mcp/dist/index.js"]
    }
  }
}
```

### Development

```bash
npm run dev      # Run with tsx (development)
npm run build    # Build TypeScript
npm run test     # Run tests
```

## Tools

### Query Tools (4)
- `get-color-info` - Comprehensive color information
- `get-color-name` - Find closest CSS named color
- `get-color-meaning` - Cultural/psychological meanings
- `list-named-colors` - List CSS named colors

### Convert Tools (3)
- `convert-color` - Convert to any color space
- `convert-batch` - Convert multiple colors
- `parse-color-string` - Parse any CSS color format

### Calculate Tools (5)
- `calculate-contrast` - WCAG contrast ratio
- `calculate-delta-e` - Perceptual difference
- `calculate-luminance` - Relative luminance
- `mix-colors` - Blend colors with gradient
- `adjust-color` - Lighten/darken/saturate

### Generate Tools (5)
- `generate-harmony` - Color wheel harmonies
- `generate-palette` - Design system palette
- `generate-gradient` - Smooth gradients
- `generate-accessible-palette` - WCAG-compliant alternatives
- `generate-scale` - Tailwind-style 50-950 scale

### Validate Tools (5)
- `validate-wcag-contrast` - Accessibility check
- `validate-color-blindness` - CVD simulation
- `validate-gamut` - In-gamut verification
- `validate-print-safe` - CMYK feasibility
- `validate-palette-harmony` - Harmony analysis

## Examples

### Check accessibility
```
"Is #333333 on #FFFFFF WCAG AA compliant?"
→ Use validate-wcag-contrast
```

### Generate a palette
```
"Generate a 5-color analogous harmony from navy blue"
→ Use generate-harmony with harmonyType: "analogous"
```

### Simulate color blindness
```
"How does this palette look to someone with deuteranopia?"
→ Use validate-color-blindness with cvdType: "deuteranopia"
```

### Convert color spaces
```
"Convert #FF5733 to Oklch"
→ Use convert-color with targetSpace: "oklch"
```

## Architecture

```
src/
├── domain/           # Value objects & interfaces
│   ├── values/       # Color, Palette, Gradient, Matrix3x3
│   └── interfaces/   # IColorSpace, IHarmonyAlgorithm, etc.
├── color-spaces/     # Color space implementations
├── services/         # ConversionService, ContrastService, PaletteService
├── strategies/       # Delta-E, CVD, Harmony algorithms
├── data/             # CSS colors, cultural meanings
└── mcp/tools/        # MCP tool implementations
```

## References

- [W3C CSS Color 4](https://www.w3.org/TR/css-color-4/)
- [Oklab by Björn Ottosson](https://bottosson.github.io/posts/oklab/)
- [CIEDE2000 (Sharma 2005)](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/)
- [WCAG 2.1 Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Machado 2009 CVD Simulation](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)

## License

MIT
