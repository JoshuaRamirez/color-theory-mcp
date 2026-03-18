# Color Theory MCP Server Examples

This directory contains practical examples demonstrating how to use the Color Theory MCP Server tools.

## Prerequisites

Before running these examples, ensure you have:

1. **Node.js** (v18 or higher)
2. **MCP-compatible client** (Claude Code, Claude Desktop, or another MCP client)
3. **Color Theory MCP Server** installed and configured

## Installation

1. Install and build the server:
   ```bash
   cd color-theory-mcp
   npm install
   npm run build
   ```

2. Add to your MCP client configuration:
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

3. Restart your MCP client to load the server.

## Example Files

| File | Description |
|------|-------------|
| [basic-usage.md](./basic-usage.md) | Fundamental operations: color conversion, information queries, simple harmonies |
| [accessibility.md](./accessibility.md) | WCAG contrast checking, color blindness simulation, accessible palette generation |
| [advanced-palettes.md](./advanced-palettes.md) | Complex palette generation, gradients, color mixing, scales |

## How to Use These Examples

Each example file contains:

1. **Tool name** - The MCP tool being demonstrated
2. **Input parameters** - JSON showing the exact parameters to pass
3. **Expected response** - Sample output showing what to expect
4. **Use cases** - Practical scenarios where this tool is helpful

### Running Examples

In your MCP client, you can invoke tools using the documented parameters. For example, to get color information:

```
Tool: get-color-info
Input: { "color": "#3B82F6" }
```

The server will return a structured JSON response with comprehensive color data.

## Tool Categories

### Query Tools (4 tools)
- `get-color-info` - Comprehensive color analysis
- `get-color-name` - Find closest CSS named color
- `get-color-meaning` - Cultural and psychological meanings
- `list-named-colors` - Browse all 147 CSS colors

### Convert Tools (3 tools)
- `convert-color` - Transform to any of 13 color spaces
- `convert-batch` - Convert multiple colors at once
- `parse-color-string` - Parse any CSS color format

### Calculate Tools (5 tools)
- `calculate-contrast` - WCAG contrast ratio
- `calculate-delta-e` - Perceptual color difference
- `calculate-luminance` - Relative luminance value
- `mix-colors` - Blend colors with optional gradient
- `adjust-color` - Lighten, darken, saturate, rotate

### Generate Tools (5 tools)
- `generate-harmony` - Color wheel harmonies
- `generate-palette` - Design system palettes
- `generate-gradient` - Smooth color gradients
- `generate-accessible-palette` - WCAG-compliant alternatives
- `generate-scale` - Tailwind-style 50-950 scales

### Validate Tools (5 tools)
- `validate-wcag-contrast` - Accessibility compliance check
- `validate-color-blindness` - CVD simulation
- `validate-gamut` - Verify colors are in-gamut
- `validate-print-safe` - CMYK feasibility
- `validate-palette-harmony` - Analyze palette relationships

## Supported Color Formats

The server accepts colors in multiple formats:

| Format | Examples |
|--------|----------|
| Hex (3-digit) | `#F00`, `#ABC` |
| Hex (6-digit) | `#FF0000`, `#AABBCC` |
| Hex (8-digit with alpha) | `#FF000080` |
| RGB | `rgb(255, 0, 0)` |
| RGBA | `rgba(255, 0, 0, 0.5)` |
| HSL | `hsl(0, 100%, 50%)` |
| CSS Named Colors | `red`, `dodgerblue`, `rebeccapurple` |

## Supported Color Spaces

The server supports 13 color spaces for conversion:

| Space | ID | Description |
|-------|-----|-------------|
| sRGB | `srgb` | Standard RGB (web default) |
| Linear sRGB | `linear-srgb` | Linearized RGB for blending |
| Display P3 | `display-p3` | Wide gamut for modern displays |
| XYZ D65 | `xyz-d65` | CIE XYZ with D65 illuminant |
| XYZ D50 | `xyz-d50` | CIE XYZ with D50 illuminant |
| Lab | `lab` | CIE L*a*b* perceptual |
| LCH | `lch` | CIE L*C*h cylindrical |
| Oklab | `oklab` | Improved perceptual space |
| Oklch | `oklch` | Oklch cylindrical (recommended) |
| HSL | `hsl` | Hue, Saturation, Lightness |
| HSV | `hsv` | Hue, Saturation, Value |
| HWB | `hwb` | Hue, Whiteness, Blackness |
| CMYK | `cmyk` | Cyan, Magenta, Yellow, Black |

## Tips

- **Use Oklch for perceptual work**: When adjusting lightness or creating harmonies, Oklch provides the most perceptually uniform results.
- **Check accessibility early**: Use `validate-wcag-contrast` before finalizing color choices.
- **Simulate CVD**: Always test palettes with `validate-color-blindness` to ensure inclusivity.
- **Generate scales for consistency**: Use `generate-scale` to create consistent lightness progressions.
