# Advanced Palettes Examples

This guide covers complex palette generation, gradient creation, color mixing, and design system scales.

## Table of Contents

- [Design System Palettes](#design-system-palettes)
- [Color Scales](#color-scales)
- [Gradient Creation](#gradient-creation)
- [Color Mixing](#color-mixing)
- [Color Adjustments](#color-adjustments)
- [Workflow Examples](#workflow-examples)

---

## Design System Palettes

Use `generate-palette` to create complete design system color schemes with semantic roles.

### Example: Professional palette

**Tool:** `generate-palette`

**Input:**
```json
{
  "baseColor": "#3B82F6",
  "style": "professional",
  "includeNeutrals": true
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#3B82F6",
    "hex": "#3B82F6"
  },
  "style": "professional",
  "palette": {
    "primary": "#3674DE",
    "secondary": "#8B3DD9",
    "accent": "#D93D7A",
    "allColors": [
      { "role": "primary", "hex": "#3674DE" },
      { "role": "secondary", "hex": "#8B3DD9" },
      { "role": "accent", "hex": "#D93D7A" }
    ]
  },
  "scale": {
    "description": "Tailwind-style lightness scale for the primary color",
    "colors": [
      { "step": 50, "hex": "#EFF6FF" },
      { "step": 100, "hex": "#DBEAFE" },
      { "step": 200, "hex": "#BFDBFE" },
      { "step": 300, "hex": "#93C5FD" },
      { "step": 400, "hex": "#60A5FA" },
      { "step": 500, "hex": "#3B82F6" },
      { "step": 600, "hex": "#2563EB" },
      { "step": 700, "hex": "#1D4ED8" },
      { "step": 800, "hex": "#1E40AF" },
      { "step": 900, "hex": "#1E3A8A" },
      { "step": 950, "hex": "#172554" }
    ]
  },
  "neutrals": [
    { "role": "background", "hex": "#FFFFFF" },
    { "role": "surface", "hex": "#F8F9FB" },
    { "role": "border", "hex": "#DEE2E8" },
    { "role": "muted", "hex": "#6C7580" },
    { "role": "foreground", "hex": "#212529" }
  ]
}
```

**Understanding Styles:**
- `professional`: Split-complementary harmony, slightly desaturated (business-appropriate)
- `vibrant`: Triadic harmony, full saturation (energetic, playful)
- `minimal`: Monochromatic, desaturated (clean, modern)
- `muted`: Analogous, desaturated (calm, sophisticated)

---

### Example: Vibrant palette for a creative project

**Tool:** `generate-palette`

**Input:**
```json
{
  "baseColor": "#F97316",
  "style": "vibrant",
  "includeNeutrals": true
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#F97316",
    "hex": "#F97316"
  },
  "style": "vibrant",
  "palette": {
    "primary": "#F97316",
    "secondary": "#16F973",
    "accent": "#7316F9",
    "allColors": [
      { "role": "primary", "hex": "#F97316" },
      { "role": "secondary", "hex": "#16F973" },
      { "role": "accent", "hex": "#7316F9" }
    ]
  },
  "scale": {
    "description": "Tailwind-style lightness scale for the primary color",
    "colors": [
      { "step": 50, "hex": "#FFF7ED" },
      { "step": 100, "hex": "#FFEDD5" },
      { "step": 200, "hex": "#FED7AA" },
      { "step": 300, "hex": "#FDBA74" },
      { "step": 400, "hex": "#FB923C" },
      { "step": 500, "hex": "#F97316" },
      { "step": 600, "hex": "#EA580C" },
      { "step": 700, "hex": "#C2410C" },
      { "step": 800, "hex": "#9A3412" },
      { "step": 900, "hex": "#7C2D12" },
      { "step": 950, "hex": "#431407" }
    ]
  },
  "neutrals": [
    { "role": "background", "hex": "#FFFFFF" },
    { "role": "surface", "hex": "#FBF9F8" },
    { "role": "border", "hex": "#E8E2DE" },
    { "role": "muted", "hex": "#807568" },
    { "role": "foreground", "hex": "#292521" }
  ]
}
```

---

### Example: Minimal palette without neutrals

**Tool:** `generate-palette`

**Input:**
```json
{
  "baseColor": "#10B981",
  "style": "minimal",
  "includeNeutrals": false
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#10B981",
    "hex": "#10B981"
  },
  "style": "minimal",
  "palette": {
    "primary": "#0F9A6F",
    "secondary": "#0D8A63",
    "accent": "#0B7A57",
    "accent2": "#096A4B",
    "color5": "#085A3F",
    "allColors": [
      { "role": "primary", "hex": "#0F9A6F" },
      { "role": "secondary", "hex": "#0D8A63" },
      { "role": "accent", "hex": "#0B7A57" },
      { "role": "accent2", "hex": "#096A4B" },
      { "role": "color5", "hex": "#085A3F" }
    ]
  },
  "scale": {
    "description": "Tailwind-style lightness scale for the primary color",
    "colors": [
      { "step": 50, "hex": "#ECFDF5" },
      { "step": 100, "hex": "#D1FAE5" },
      { "step": 200, "hex": "#A7F3D0" },
      { "step": 300, "hex": "#6EE7B7" },
      { "step": 400, "hex": "#34D399" },
      { "step": 500, "hex": "#10B981" },
      { "step": 600, "hex": "#059669" },
      { "step": 700, "hex": "#047857" },
      { "step": 800, "hex": "#065F46" },
      { "step": 900, "hex": "#064E3B" },
      { "step": 950, "hex": "#022C22" }
    ]
  }
}
```

---

## Color Scales

Use `generate-scale` to create Tailwind-style lightness scales for any color.

### Example: Generate a complete scale

**Tool:** `generate-scale`

**Input:**
```json
{
  "baseColor": "#8B5CF6"
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#8B5CF6",
    "hex": "#8B5CF6"
  },
  "scale": [
    { "step": 50, "hex": "#F5F3FF", "lightness": 97, "chroma": 0.015, "hue": 270 },
    { "step": 100, "hex": "#EDE9FE", "lightness": 93, "chroma": 0.032, "hue": 270 },
    { "step": 200, "hex": "#DDD6FE", "lightness": 87, "chroma": 0.052, "hue": 270 },
    { "step": 300, "hex": "#C4B5FD", "lightness": 78, "chroma": 0.082, "hue": 270 },
    { "step": 400, "hex": "#A78BFA", "lightness": 67, "chroma": 0.125, "hue": 270 },
    { "step": 500, "hex": "#8B5CF6", "lightness": 55, "chroma": 0.168, "hue": 270 },
    { "step": 600, "hex": "#7C3AED", "lightness": 47, "chroma": 0.195, "hue": 270 },
    { "step": 700, "hex": "#6D28D9", "lightness": 40, "chroma": 0.182, "hue": 270 },
    { "step": 800, "hex": "#5B21B6", "lightness": 33, "chroma": 0.162, "hue": 270 },
    { "step": 900, "hex": "#4C1D95", "lightness": 27, "chroma": 0.142, "hue": 270 },
    { "step": 950, "hex": "#2E1065", "lightness": 17, "chroma": 0.112, "hue": 270 }
  ],
  "usage": {
    "tailwindConfig": {
      "description": "Use in tailwind.config.js colors section",
      "config": {
        "50": "#F5F3FF",
        "100": "#EDE9FE",
        "200": "#DDD6FE",
        "300": "#C4B5FD",
        "400": "#A78BFA",
        "500": "#8B5CF6",
        "600": "#7C3AED",
        "700": "#6D28D9",
        "800": "#5B21B6",
        "900": "#4C1D95",
        "950": "#2E1065"
      }
    },
    "cssVariables": {
      "description": "CSS custom properties",
      "css": "--color-50: #F5F3FF;\n--color-100: #EDE9FE;\n--color-200: #DDD6FE;\n--color-300: #C4B5FD;\n--color-400: #A78BFA;\n--color-500: #8B5CF6;\n--color-600: #7C3AED;\n--color-700: #6D28D9;\n--color-800: #5B21B6;\n--color-900: #4C1D95;\n--color-950: #2E1065;"
    }
  },
  "guidelines": {
    "50-100": "Background tints, subtle highlights",
    "200-300": "Hover states, secondary backgrounds",
    "400-500": "Primary UI elements, borders",
    "600-700": "Primary text on light backgrounds",
    "800-950": "Headings, high contrast elements"
  }
}
```

---

### Example: Custom scale steps

**Tool:** `generate-scale`

**Input:**
```json
{
  "baseColor": "#DC2626",
  "steps": [100, 300, 500, 700, 900]
}
```

**Expected Response:**
```json
{
  "baseColor": {
    "input": "#DC2626",
    "hex": "#DC2626"
  },
  "scale": [
    { "step": 100, "hex": "#FEE2E2", "lightness": 93, "chroma": 0.045, "hue": 25 },
    { "step": 300, "hex": "#FCA5A5", "lightness": 78, "chroma": 0.112, "hue": 25 },
    { "step": 500, "hex": "#DC2626", "lightness": 52, "chroma": 0.192, "hue": 25 },
    { "step": 700, "hex": "#B91C1C", "lightness": 40, "chroma": 0.168, "hue": 25 },
    { "step": 900, "hex": "#7F1D1D", "lightness": 27, "chroma": 0.128, "hue": 25 }
  ],
  "usage": {
    "tailwindConfig": {
      "description": "Use in tailwind.config.js colors section",
      "config": {
        "100": "#FEE2E2",
        "300": "#FCA5A5",
        "500": "#DC2626",
        "700": "#B91C1C",
        "900": "#7F1D1D"
      }
    },
    "cssVariables": {
      "description": "CSS custom properties",
      "css": "--color-100: #FEE2E2;\n--color-300: #FCA5A5;\n--color-500: #DC2626;\n--color-700: #B91C1C;\n--color-900: #7F1D1D;"
    }
  },
  "guidelines": {
    "50-100": "Background tints, subtle highlights",
    "200-300": "Hover states, secondary backgrounds",
    "400-500": "Primary UI elements, borders",
    "600-700": "Primary text on light backgrounds",
    "800-950": "Headings, high contrast elements"
  }
}
```

---

## Gradient Creation

Use `generate-gradient` to create smooth color gradients using perceptually uniform interpolation.

### Example: Two-color gradient

**Tool:** `generate-gradient`

**Input:**
```json
{
  "startColor": "#6366F1",
  "endColor": "#EC4899",
  "steps": 5,
  "includeCSS": true
}
```

**Expected Response:**
```json
{
  "startColor": {
    "input": "#6366F1",
    "hex": "#6366F1"
  },
  "endColor": {
    "input": "#EC4899",
    "hex": "#EC4899"
  },
  "steps": 5,
  "gradient": {
    "stops": [
      { "index": 0, "position": "0%", "hex": "#6366F1" },
      { "index": 1, "position": "25%", "hex": "#8B5CF6" },
      { "index": 2, "position": "50%", "hex": "#A855F7" },
      { "index": 3, "position": "75%", "hex": "#D946EF" },
      { "index": 4, "position": "100%", "hex": "#EC4899" }
    ]
  },
  "css": {
    "linear": "linear-gradient(to right, #6366F1 0%, #8B5CF6 25%, #A855F7 50%, #D946EF 75%, #EC4899 100%)",
    "radial": "radial-gradient(circle, #6366F1 0%, #8B5CF6 25%, #A855F7 50%, #D946EF 75%, #EC4899 100%)"
  },
  "note": "Gradient uses Oklch interpolation for perceptually uniform color transitions"
}
```

---

### Example: More granular gradient

**Tool:** `generate-gradient`

**Input:**
```json
{
  "startColor": "#22C55E",
  "endColor": "#3B82F6",
  "steps": 10,
  "includeCSS": true
}
```

**Expected Response:**
```json
{
  "startColor": {
    "input": "#22C55E",
    "hex": "#22C55E"
  },
  "endColor": {
    "input": "#3B82F6",
    "hex": "#3B82F6"
  },
  "steps": 10,
  "gradient": {
    "stops": [
      { "index": 0, "position": "0%", "hex": "#22C55E" },
      { "index": 1, "position": "11%", "hex": "#22C57A" },
      { "index": 2, "position": "22%", "hex": "#22C596" },
      { "index": 3, "position": "33%", "hex": "#22C5B2" },
      { "index": 4, "position": "44%", "hex": "#22BFC5" },
      { "index": 5, "position": "56%", "hex": "#22A5C5" },
      { "index": 6, "position": "67%", "hex": "#228BC5" },
      { "index": 7, "position": "78%", "hex": "#3B82E8" },
      { "index": 8, "position": "89%", "hex": "#3B82F6" },
      { "index": 9, "position": "100%", "hex": "#3B82F6" }
    ]
  },
  "css": {
    "linear": "linear-gradient(to right, #22C55E 0%, #22C57A 11%, #22C596 22%, #22C5B2 33%, #22BFC5 44%, #22A5C5 56%, #228BC5 67%, #3B82E8 78%, #3B82F6 89%, #3B82F6 100%)",
    "radial": "radial-gradient(circle, #22C55E 0%, #22C57A 11%, #22C596 22%, #22C5B2 33%, #22BFC5 44%, #22A5C5 56%, #228BC5 67%, #3B82E8 78%, #3B82F6 89%, #3B82F6 100%)"
  },
  "note": "Gradient uses Oklch interpolation for perceptually uniform color transitions"
}
```

**Why Oklch Interpolation Matters:**
Traditional RGB interpolation can create muddy or gray colors in the middle of gradients. Oklch interpolation maintains consistent perceived brightness and saturation throughout.

---

## Color Mixing

Use `mix-colors` to blend colors together or create custom gradients.

### Example: 50/50 mix

**Tool:** `mix-colors`

**Input:**
```json
{
  "color1": "#3B82F6",
  "color2": "#EF4444",
  "ratio": 0.5
}
```

**Expected Response:**
```json
{
  "color1": {
    "input": "#3B82F6",
    "hex": "#3B82F6"
  },
  "color2": {
    "input": "#EF4444",
    "hex": "#EF4444"
  },
  "ratio": 0.5,
  "result": {
    "hex": "#9B619D",
    "rgb": { "r": 155, "g": 97, "b": 157 }
  },
  "note": "50% color1 + 50% color2"
}
```

---

### Example: Tint a color (mix with white)

**Tool:** `mix-colors`

**Input:**
```json
{
  "color1": "#DC2626",
  "color2": "#FFFFFF",
  "ratio": 0.7
}
```

**Expected Response:**
```json
{
  "color1": {
    "input": "#DC2626",
    "hex": "#DC2626"
  },
  "color2": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF"
  },
  "ratio": 0.7,
  "result": {
    "hex": "#F5A3A3",
    "rgb": { "r": 245, "g": 163, "b": 163 }
  },
  "note": "30% color1 + 70% color2"
}
```

---

### Example: Shade a color (mix with black)

**Tool:** `mix-colors`

**Input:**
```json
{
  "color1": "#22C55E",
  "color2": "#000000",
  "ratio": 0.3
}
```

**Expected Response:**
```json
{
  "color1": {
    "input": "#22C55E",
    "hex": "#22C55E"
  },
  "color2": {
    "input": "#000000",
    "hex": "#000000"
  },
  "ratio": 0.3,
  "result": {
    "hex": "#178A42",
    "rgb": { "r": 23, "g": 138, "b": 66 }
  },
  "note": "70% color1 + 30% color2"
}
```

---

### Example: Mix with gradient output

**Tool:** `mix-colors`

**Input:**
```json
{
  "color1": "#F59E0B",
  "color2": "#7C3AED",
  "ratio": 0.5,
  "steps": 7
}
```

**Expected Response:**
```json
{
  "color1": {
    "input": "#F59E0B",
    "hex": "#F59E0B"
  },
  "color2": {
    "input": "#7C3AED",
    "hex": "#7C3AED"
  },
  "ratio": 0.5,
  "result": {
    "hex": "#C8697C",
    "rgb": { "r": 200, "g": 105, "b": 124 }
  },
  "note": "50% color1 + 50% color2",
  "gradient": [
    { "step": 0, "position": 0, "hex": "#F59E0B" },
    { "step": 1, "position": 17, "hex": "#E88C2E" },
    { "step": 2, "position": 33, "hex": "#DA7A4F" },
    { "step": 3, "position": 50, "hex": "#C8697C" },
    { "step": 4, "position": 67, "hex": "#AB5BA6" },
    { "step": 5, "position": 83, "hex": "#944DC9" },
    { "step": 6, "position": 100, "hex": "#7C3AED" }
  ]
}
```

---

## Color Adjustments

Use `adjust-color` to modify colors by lightening, darkening, saturating, desaturating, or rotating hue.

### Example: Lighten a color

**Tool:** `adjust-color`

**Input:**
```json
{
  "color": "#3B82F6",
  "lighten": 0.2
}
```

**Expected Response:**
```json
{
  "original": {
    "input": "#3B82F6",
    "hex": "#3B82F6",
    "oklch": { "L": 0.627, "C": 0.146, "H": 264.11 }
  },
  "adjusted": {
    "hex": "#7EB0FA",
    "oklch": { "L": 0.827, "C": 0.146, "H": 264.11 }
  },
  "changes": {
    "lightness": 0.2,
    "chroma": 0,
    "hue": 0
  },
  "appliedAdjustments": ["lightened by 20%"]
}
```

---

### Example: Darken and desaturate

**Tool:** `adjust-color`

**Input:**
```json
{
  "color": "#EF4444",
  "darken": 0.15,
  "desaturate": 0.3
}
```

**Expected Response:**
```json
{
  "original": {
    "input": "#EF4444",
    "hex": "#EF4444",
    "oklch": { "L": 0.627, "C": 0.192, "H": 25.23 }
  },
  "adjusted": {
    "hex": "#A54E4E",
    "oklch": { "L": 0.477, "C": 0.134, "H": 25.23 }
  },
  "changes": {
    "lightness": -0.15,
    "chroma": -0.058,
    "hue": 0
  },
  "appliedAdjustments": ["darkened by 15%", "desaturated by 30%"]
}
```

---

### Example: Rotate hue (create variant)

**Tool:** `adjust-color`

**Input:**
```json
{
  "color": "#22C55E",
  "rotate": 30
}
```

**Expected Response:**
```json
{
  "original": {
    "input": "#22C55E",
    "hex": "#22C55E",
    "oklch": { "L": 0.723, "C": 0.182, "H": 158.34 }
  },
  "adjusted": {
    "hex": "#22C5A5",
    "oklch": { "L": 0.723, "C": 0.182, "H": 188.34 }
  },
  "changes": {
    "lightness": 0,
    "chroma": 0,
    "hue": 30
  },
  "appliedAdjustments": ["hue rotated by 30 degrees"]
}
```

---

### Example: Create a hover state

**Tool:** `adjust-color`

**Input:**
```json
{
  "color": "#6366F1",
  "darken": 0.1,
  "saturate": 0.05
}
```

**Expected Response:**
```json
{
  "original": {
    "input": "#6366F1",
    "hex": "#6366F1",
    "oklch": { "L": 0.567, "C": 0.168, "H": 265.45 }
  },
  "adjusted": {
    "hex": "#5558E3",
    "oklch": { "L": 0.467, "C": 0.176, "H": 265.45 }
  },
  "changes": {
    "lightness": -0.1,
    "chroma": 0.008,
    "hue": 0
  },
  "appliedAdjustments": ["darkened by 10%", "saturated by 5%"]
}
```

---

## Workflow Examples

### Complete Brand Palette Workflow

1. **Start with your brand color:**
   ```json
   // get-color-info
   { "color": "#6366F1" }
   ```

2. **Generate the design system palette:**
   ```json
   // generate-palette
   { "baseColor": "#6366F1", "style": "professional", "includeNeutrals": true }
   ```

3. **Create full scales for each color:**
   ```json
   // generate-scale
   { "baseColor": "#6366F1" }
   { "baseColor": "#8B3DD9" }  // secondary
   { "baseColor": "#D93D7A" }  // accent
   ```

4. **Validate accessibility:**
   ```json
   // validate-wcag-contrast
   { "foreground": "#6366F1", "background": "#FFFFFF", "level": "AA" }
   ```

5. **Test for color blindness:**
   ```json
   // validate-color-blindness
   { "colors": ["#6366F1", "#8B3DD9", "#D93D7A", "#22C55E", "#EF4444"] }
   ```

6. **Generate accessible alternatives if needed:**
   ```json
   // generate-accessible-palette
   { "colors": ["#6366F1", "#8B3DD9"], "backgroundColor": "#FFFFFF", "level": "AA" }
   ```

---

### Gradient Design Workflow

1. **Start with two colors:**
   ```json
   // get-color-info
   { "color": "#F59E0B" }
   { "color": "#EC4899" }
   ```

2. **Check if they work for CVD:**
   ```json
   // validate-color-blindness
   { "colors": ["#F59E0B", "#EC4899"] }
   ```

3. **Generate the gradient:**
   ```json
   // generate-gradient
   { "startColor": "#F59E0B", "endColor": "#EC4899", "steps": 7, "includeCSS": true }
   ```

4. **Verify all stops for accessibility:**
   ```json
   // validate-wcag-contrast (for each key stop as text)
   { "foreground": "#F59E0B", "background": "#FFFFFF", "level": "AA", "textSize": "large" }
   ```

---

### Theme Variant Workflow

1. **Generate base palette:**
   ```json
   // generate-palette
   { "baseColor": "#3B82F6", "style": "professional" }
   ```

2. **Create light theme variants:**
   ```json
   // adjust-color
   { "color": "#3B82F6", "lighten": 0.4, "desaturate": 0.2 }  // for backgrounds
   { "color": "#3B82F6", "darken": 0.15 }  // for hover states
   ```

3. **Create dark theme variants:**
   ```json
   // adjust-color
   { "color": "#3B82F6", "lighten": 0.1 }  // brighter for dark backgrounds
   ```

4. **Validate dark theme contrast:**
   ```json
   // validate-wcag-contrast
   { "foreground": "#60A5FA", "background": "#1F2937", "level": "AA" }
   ```

---

## Next Steps

- See [basic-usage.md](./basic-usage.md) for fundamental operations
- See [accessibility.md](./accessibility.md) for WCAG compliance and CVD testing
