# Color Theory MCP Server

[![npm version](https://img.shields.io/npm/v/color-theory-mcp.svg)](https://www.npmjs.com/package/color-theory-mcp)
[![npm downloads](https://img.shields.io/npm/dm/color-theory-mcp.svg)](https://www.npmjs.com/package/color-theory-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/color-theory-mcp.svg)](https://nodejs.org)
[![CI](https://github.com/JoshuaRamirez/color-theory-mcp/actions/workflows/test.yml/badge.svg)](https://github.com/JoshuaRamirez/color-theory-mcp/actions/workflows/test.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A comprehensive MCP (Model Context Protocol) server providing 24 tools for color theory operations including color space conversions, harmony generation, accessibility validation, and cultural meaning lookup.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Tools](#tools)
- [Examples](#examples)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [References](#references)
- [Getting Help](#getting-help)
- [License](#license)

## Features

- **15 Color Spaces**: sRGB, Linear sRGB, Display P3, XYZ-D65, XYZ-D50, Lab, LCH, Oklab, Oklch, HSL, HSV, HWB, CMYK, **CAM16**, **HCT**
- **12 Blend Modes**: Multiply, Screen, Overlay, Soft-light, Color-burn, Subtractive (Pigment), etc.
- **Advanced Accessibility**: **APCA (Lc)**, **Daltonization** (CVD Correction), WCAG 2.2 Non-text
- **Production Exports**: Design tokens for **iOS Swift**, **Android XML**, **SCSS**, **Figma JSON**, Tailwind
- **7 Harmony Algorithms**: Complementary, Analogous, Triadic, Split-complementary, Tetradic, Square, Monochromatic
- **Color Vision Deficiency**: Simulation & Correction for protanopia, deuteranopia, tritanopia
- **Delta-E Calculations**: CIE76, CIE94, CIEDE2000 perceptual difference formulas
- **147 CSS Named Colors**: Lookup and closest match finding
- **Cultural Meanings**: Color associations across Western, East Asian, South Asian, and Middle Eastern cultures

## Installation

```bash
npm install color-theory-mcp
```

Or install from source:

```bash
git clone https://github.com/JoshuaRamirez/color-theory-mcp.git
cd color-theory-mcp
npm install
npm run build
```

## Quick Start

Get up and running in under a minute:

1. **Install the package:**

   ```bash
   npm install color-theory-mcp
   ```

2. **Add to your Claude Code MCP settings** (see [Usage](#usage) for details):

   ```json
   {
     "mcpServers": {
       "color-theory": {
         "command": "node",
         "args": ["node_modules/color-theory-mcp/dist/index.js"]
       }
     }
   }
   ```

3. **Start using color tools:**
   ```
   "Convert #FF5733 to Oklch" -> Use convert-color
   "Is this text accessible?" -> Use validate-wcag-contrast
   "Generate a triadic palette from blue" -> Use generate-harmony
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

- `convert-color` - Convert to any color space (15+ supported)
- `convert-batch` - Convert multiple colors
- `parse-color-string` - Parse CSS Color 4 formats (oklch, lab, hwb, etc.)

### Calculate Tools (5)

- `calculate-contrast` - WCAG/APCA contrast ratio
- `calculate-delta-e` - Perceptual difference (CIE76/94/2000)
- `calculate-luminance` - Relative luminance
- `mix-colors` - Blend/Mix colors (Blend modes, Subtractive)
- `adjust-color` - Lighten/darken/saturate/rotate hue

### Generate Tools (6)

- `generate-harmony` - Color wheel harmonies
- `generate-palette` - Design system palette (HCT/Material)
- `generate-gradient` - Multi-stop gradients with easing
- `generate-accessible-palette` - WCAG/APCA-compliant alternatives
- `generate-design-tokens` - iOS, Android, SCSS, Figma JSON
- `generate-scale` - Tailwind-style 50-950 scale

### Validate Tools (5)

- `validate-wcag-contrast` - WCAG 2.2 & APCA checks
- `validate-color-blindness` - CVD simulation & Daltonization
- `validate-gamut` - In-gamut verification & perceptual mapping
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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development setup
- Submitting pull requests
- Coding standards

For a history of changes, see the [Changelog](CHANGELOG.md).

## References

- [W3C CSS Color 4](https://www.w3.org/TR/css-color-4/)
- [Oklab by Björn Ottosson](https://bottosson.github.io/posts/oklab/)
- [CIEDE2000 (Sharma 2005)](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/)
- [WCAG 2.1 Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Machado 2009 CVD Simulation](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)

## Getting Help

- **Bug Reports**: [Open an issue](https://github.com/JoshuaRamirez/color-theory-mcp/issues/new?template=bug_report.md)
- **Feature Requests**: [Open an issue](https://github.com/JoshuaRamirez/color-theory-mcp/issues/new?template=feature_request.md)
- **Security Issues**: Please review our [Security Policy](SECURITY.md) for responsible disclosure
- **Discussions**: [GitHub Discussions](https://github.com/JoshuaRamirez/color-theory-mcp/discussions)

## License

MIT - see [LICENSE](LICENSE) for details.
