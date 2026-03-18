# Basic Usage Examples

This guide covers fundamental operations with the Color Theory MCP Server: getting color information, converting between color spaces, and generating simple color harmonies.

## Table of Contents

- [Getting Color Information](#getting-color-information)
- [Converting Colors](#converting-colors)
- [Finding Color Names](#finding-color-names)
- [Generating Harmonies](#generating-harmonies)
- [Cultural Color Meanings](#cultural-color-meanings)

---

## Getting Color Information

Use `get-color-info` to get comprehensive information about any color. This is often the first tool to use when working with a color.

### Example: Analyze a brand color

**Tool:** `get-color-info`

**Input:**
```json
{
  "color": "#3B82F6"
}
```

**Expected Response:**
```json
{
  "input": "#3B82F6",
  "formats": {
    "hex": "#3B82F6",
    "hexWithAlpha": "#3B82F6FF",
    "rgb": { "r": 59, "g": 130, "b": 246 },
    "rgbString": "rgb(59, 130, 246)",
    "hsl": { "h": 217, "s": 91, "l": 60 },
    "hslString": "hsl(217, 91%, 60%)",
    "hsv": { "h": 217, "s": 76, "v": 96 }
  },
  "perceptual": {
    "lab": { "L": 55.89, "a": 8.03, "b": -55.54 },
    "lch": { "L": 55.89, "C": 56.12, "H": 278.23 },
    "oklab": { "L": 0.627, "a": -0.015, "b": -0.145 },
    "oklch": { "L": 0.627, "C": 0.146, "H": 264.11 }
  },
  "analysis": {
    "luminance": 0.2178,
    "isLight": true,
    "suggestedTextColor": "#000000",
    "contrastWithWhite": 3.43,
    "contrastWithBlack": 6.12
  },
  "closestNamedColor": {
    "name": "dodgerblue",
    "hex": "#1E90FF"
  },
  "alpha": 1
}
```

**Use Cases:**
- Auditing an existing color's properties
- Understanding how a color will appear in different contexts
- Determining appropriate text color for contrast
- Finding the closest named CSS color for documentation

---

### Example: Analyze a CSS named color

**Tool:** `get-color-info`

**Input:**
```json
{
  "color": "coral"
}
```

**Expected Response:**
```json
{
  "input": "coral",
  "formats": {
    "hex": "#FF7F50",
    "hexWithAlpha": "#FF7F50FF",
    "rgb": { "r": 255, "g": 127, "b": 80 },
    "rgbString": "rgb(255, 127, 80)",
    "hsl": { "h": 16, "s": 100, "l": 66 },
    "hslString": "hsl(16, 100%, 66%)",
    "hsv": { "h": 16, "s": 69, "v": 100 }
  },
  "analysis": {
    "luminance": 0.3619,
    "isLight": true,
    "suggestedTextColor": "#000000",
    "contrastWithWhite": 2.35,
    "contrastWithBlack": 8.24
  },
  "closestNamedColor": {
    "name": "coral",
    "hex": "#FF7F50"
  },
  "alpha": 1
}
```

---

## Converting Colors

Use `convert-color` to transform colors between any of the 13 supported color spaces.

### Example: Convert hex to Oklch

Oklch is recommended for perceptual color manipulation.

**Tool:** `convert-color`

**Input:**
```json
{
  "color": "#FF5733",
  "targetSpace": "oklch"
}
```

**Expected Response:**
```json
{
  "input": "#FF5733",
  "targetSpace": "oklch",
  "components": {
    "L": 0.676,
    "C": 0.199,
    "H": 38.54
  },
  "rawComponents": [0.6764, 0.1993, 38.5389],
  "alpha": 1,
  "hex": "#FF5733",
  "cssString": "oklch(0.676 0.199 38.54)"
}
```

**Understanding the Result:**
- `L` (Lightness): 0.676 means this color is 67.6% lightness (0 = black, 1 = white)
- `C` (Chroma): 0.199 is moderately saturated (0 = gray, higher = more colorful)
- `H` (Hue): 38.54 degrees (in the orange range)

---

### Example: Convert to Lab for perceptual comparison

**Tool:** `convert-color`

**Input:**
```json
{
  "color": "steelblue",
  "targetSpace": "lab"
}
```

**Expected Response:**
```json
{
  "input": "steelblue",
  "targetSpace": "lab",
  "components": {
    "L": 52.47,
    "a": -4.07,
    "b": -32.2
  },
  "rawComponents": [52.4657, -4.0686, -32.1982],
  "alpha": 1,
  "hex": "#4682B4",
  "cssString": "lab(52.47 -4.07 -32.2)"
}
```

---

### Example: Convert to CMYK for print

**Tool:** `convert-color`

**Input:**
```json
{
  "color": "#E63946",
  "targetSpace": "cmyk"
}
```

**Expected Response:**
```json
{
  "input": "#E63946",
  "targetSpace": "cmyk",
  "components": {
    "c": 0,
    "m": 75,
    "y": 69,
    "k": 10
  },
  "rawComponents": [0, 0.7513, 0.6957, 0.0980],
  "alpha": 1,
  "hex": "#E63946",
  "cssString": "cmyk(0% 75% 69% 10%)"
}
```

**Understanding CMYK:**
- `c` (Cyan): 0% - no cyan needed
- `m` (Magenta): 75% - heavy magenta component
- `y` (Yellow): 69% - significant yellow
- `k` (Key/Black): 10% - small amount of black for depth

---

### Example: Convert to HSL for CSS

**Tool:** `convert-color`

**Input:**
```json
{
  "color": "#10B981",
  "targetSpace": "hsl"
}
```

**Expected Response:**
```json
{
  "input": "#10B981",
  "targetSpace": "hsl",
  "components": {
    "h": 159,
    "s": 84,
    "l": 39
  },
  "rawComponents": [159.1304, 0.8396, 0.3941],
  "alpha": 1,
  "hex": "#10B981",
  "cssString": "hsl(159, 84%, 39%)"
}
```

---

## Finding Color Names

Use `get-color-name` to find the closest CSS named color for any input color.

### Example: Find name for a custom color

**Tool:** `get-color-name`

**Input:**
```json
{
  "color": "#4A5568"
}
```

**Expected Response:**
```json
{
  "input": "#4A5568",
  "inputHex": "#4A5568",
  "closestMatch": {
    "name": "slategray",
    "hex": "#708090",
    "deltaE": 12.34
  },
  "isExactMatch": false,
  "alternativeMatches": [
    { "name": "dimgray", "hex": "#696969", "deltaE": 8.21 },
    { "name": "gray", "hex": "#808080", "deltaE": 15.67 }
  ]
}
```

**Use Cases:**
- Finding semantic names for documentation
- Understanding color relationships
- Communicating colors in design discussions

---

## Generating Harmonies

Use `generate-harmony` to create color palettes based on color theory principles.

### Example: Complementary harmony

Complementary colors are opposite on the color wheel, creating high contrast.

**Tool:** `generate-harmony`

**Input:**
```json
{
  "baseColor": "#3B82F6",
  "harmonyType": "complementary"
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#3B82F6",
    "hex": "#3B82F6"
  },
  "harmonyType": "complementary",
  "description": "Colors opposite on the color wheel (180 degrees apart)",
  "angles": [0, 180],
  "palette": {
    "count": 2,
    "colors": [
      { "index": 0, "hex": "#3B82F6", "hue": 264 },
      { "index": 1, "hex": "#F6A83B", "hue": 84 }
    ]
  },
  "usage": "Use for high contrast designs. Good for call-to-action elements against backgrounds."
}
```

---

### Example: Analogous harmony

Analogous colors are adjacent on the color wheel, creating natural harmony.

**Tool:** `generate-harmony`

**Input:**
```json
{
  "baseColor": "forestgreen",
  "harmonyType": "analogous",
  "count": 5,
  "angleSpread": 30
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "forestgreen",
    "hex": "#228B22"
  },
  "harmonyType": "analogous",
  "description": "Adjacent colors on the color wheel",
  "angles": [-60, -30, 0, 30, 60],
  "palette": {
    "count": 5,
    "colors": [
      { "index": 0, "hex": "#228B6A", "hue": 98 },
      { "index": 1, "hex": "#228B46", "hue": 128 },
      { "index": 2, "hex": "#228B22", "hue": 158 },
      { "index": 3, "hex": "#468B22", "hue": 188 },
      { "index": 4, "hex": "#6A8B22", "hue": 218 }
    ]
  },
  "usage": "Creates harmony and unity. Best for nature-inspired or calming designs."
}
```

---

### Example: Triadic harmony

Triadic colors are evenly spaced (120 degrees apart) on the color wheel.

**Tool:** `generate-harmony`

**Input:**
```json
{
  "baseColor": "#E63946",
  "harmonyType": "triadic"
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#E63946",
    "hex": "#E63946"
  },
  "harmonyType": "triadic",
  "description": "Three colors evenly spaced (120 degrees apart)",
  "angles": [0, 120, 240],
  "palette": {
    "count": 3,
    "colors": [
      { "index": 0, "hex": "#E63946", "hue": 25 },
      { "index": 1, "hex": "#46E639", "hue": 145 },
      { "index": 2, "hex": "#3946E6", "hue": 265 }
    ]
  },
  "usage": "Vibrant and balanced. Use one color as dominant, others as accents."
}
```

---

### Example: Monochromatic harmony

Monochromatic uses variations of a single hue at different lightness levels.

**Tool:** `generate-harmony`

**Input:**
```json
{
  "baseColor": "#6366F1",
  "harmonyType": "monochromatic",
  "count": 5
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#6366F1",
    "hex": "#6366F1"
  },
  "harmonyType": "monochromatic",
  "description": "Variations of a single hue at different lightness levels",
  "angles": [0],
  "palette": {
    "count": 5,
    "colors": [
      { "index": 0, "hex": "#C4C6FA", "hue": 264 },
      { "index": 1, "hex": "#9395F5", "hue": 264 },
      { "index": 2, "hex": "#6366F1", "hue": 264 },
      { "index": 3, "hex": "#4346C9", "hue": 264 },
      { "index": 4, "hex": "#2D2F8A", "hue": 264 }
    ]
  },
  "usage": "Elegant and cohesive. Add texture and contrast through value variations."
}
```

---

### Example: Split-complementary harmony

Split-complementary uses the two colors adjacent to the complement.

**Tool:** `generate-harmony`

**Input:**
```json
{
  "baseColor": "#F59E0B",
  "harmonyType": "split-complementary"
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#F59E0B",
    "hex": "#F59E0B"
  },
  "harmonyType": "split-complementary",
  "description": "Base color plus two colors adjacent to its complement",
  "angles": [0, 150, 210],
  "palette": {
    "count": 3,
    "colors": [
      { "index": 0, "hex": "#F59E0B", "hue": 86 },
      { "index": 1, "hex": "#0B71F5", "hue": 236 },
      { "index": 2, "hex": "#710BF5", "hue": 296 }
    ]
  },
  "usage": "High contrast but less tension than complementary. Versatile for many designs."
}
```

---

## Cultural Color Meanings

Use `get-color-meaning` to understand psychological and cultural associations of colors.

### Example: Get all meanings for a color

**Tool:** `get-color-meaning`

**Input:**
```json
{
  "color": "red"
}
```

**Expected Response:**
```json
{
  "color": "red",
  "meanings": {
    "western": {
      "general": ["passion", "love", "danger", "excitement", "energy"],
      "business": ["urgency", "clearance sales", "food industry", "power"],
      "wedding": ["passion", "bold statement", "accent color"],
      "mourning": ["sacrifice", "blood", "rarely used"]
    },
    "eastAsian": {
      "general": ["luck", "prosperity", "happiness", "celebration"],
      "business": ["success", "good fortune", "auspicious"],
      "wedding": ["primary color", "good luck", "traditional"],
      "mourning": ["inappropriate", "avoid"]
    },
    "southAsian": {
      "general": ["purity", "fertility", "love", "beauty"],
      "business": ["auspicious", "new beginnings"],
      "wedding": ["primary bridal color", "prosperity", "good fortune"],
      "mourning": ["inappropriate", "avoid"]
    },
    "middleEastern": {
      "general": ["danger", "caution", "courage"],
      "business": ["attention", "warning"],
      "wedding": ["accent color", "not primary"],
      "mourning": ["varies by country"]
    }
  }
}
```

---

### Example: Get meanings for a specific region and context

**Tool:** `get-color-meaning`

**Input:**
```json
{
  "color": "white",
  "region": "eastAsian",
  "context": "wedding"
}
```

**Expected Response:**
```json
{
  "color": "white",
  "region": "eastAsian",
  "context": "wedding",
  "meanings": ["traditionally avoided", "mourning color", "modern acceptance", "purity in contemporary weddings"]
}
```

**Use Cases:**
- Designing for international audiences
- Understanding color psychology
- Avoiding cultural missteps in branding
- Creating culturally appropriate designs

---

## Next Steps

- See [accessibility.md](./accessibility.md) for WCAG compliance and color blindness simulation
- See [advanced-palettes.md](./advanced-palettes.md) for complex palette generation, gradients, and mixing
