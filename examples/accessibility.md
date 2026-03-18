# Accessibility Examples

This guide demonstrates how to use the Color Theory MCP Server for accessibility testing and creating inclusive color designs.

## Table of Contents

- [WCAG Contrast Checking](#wcag-contrast-checking)
- [Color Blindness Simulation](#color-blindness-simulation)
- [Generating Accessible Palettes](#generating-accessible-palettes)
- [Calculating Color Differences](#calculating-color-differences)
- [Best Practices](#best-practices)

---

## WCAG Contrast Checking

WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios for text readability.

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

Use `validate-wcag-contrast` to check if your color combinations meet these standards.

### Example: Check text on background (passing)

**Tool:** `validate-wcag-contrast`

**Input:**
```json
{
  "foreground": "#1F2937",
  "background": "#FFFFFF",
  "level": "AA",
  "textSize": "normal"
}
```

**Expected Response:**
```json
{
  "valid": true,
  "foreground": {
    "input": "#1F2937",
    "hex": "#1F2937"
  },
  "background": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF"
  },
  "contrast": {
    "ratio": 14.72,
    "ratioString": "14.72:1"
  },
  "requirement": {
    "level": "AA",
    "textSize": "normal",
    "minimumRatio": 4.5
  },
  "result": "Passes WCAG AA for normal text",
  "allLevels": {
    "AA-normal": true,
    "AA-large": true,
    "AAA-normal": true,
    "AAA-large": true
  }
}
```

---

### Example: Check text on background (failing)

**Tool:** `validate-wcag-contrast`

**Input:**
```json
{
  "foreground": "#9CA3AF",
  "background": "#FFFFFF",
  "level": "AA",
  "textSize": "normal"
}
```

**Expected Response:**
```json
{
  "valid": false,
  "foreground": {
    "input": "#9CA3AF",
    "hex": "#9CA3AF"
  },
  "background": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF"
  },
  "contrast": {
    "ratio": 2.85,
    "ratioString": "2.85:1"
  },
  "requirement": {
    "level": "AA",
    "textSize": "normal",
    "minimumRatio": 4.5
  },
  "result": "Fails WCAG AA for normal text",
  "suggestion": {
    "message": "Suggested accessible foreground color:",
    "hex": "#6B7280",
    "contrast": 4.63
  },
  "allLevels": {
    "AA-normal": false,
    "AA-large": false,
    "AAA-normal": false,
    "AAA-large": false
  }
}
```

**Note:** The tool automatically suggests an adjusted color that meets the requirement.

---

### Example: Check for AAA compliance (strictest level)

**Tool:** `validate-wcag-contrast`

**Input:**
```json
{
  "foreground": "#4B5563",
  "background": "#F9FAFB",
  "level": "AAA",
  "textSize": "normal"
}
```

**Expected Response:**
```json
{
  "valid": true,
  "foreground": {
    "input": "#4B5563",
    "hex": "#4B5563"
  },
  "background": {
    "input": "#F9FAFB",
    "hex": "#F9FAFB"
  },
  "contrast": {
    "ratio": 7.24,
    "ratioString": "7.24:1"
  },
  "requirement": {
    "level": "AAA",
    "textSize": "normal",
    "minimumRatio": 7
  },
  "result": "Passes WCAG AAA for normal text",
  "allLevels": {
    "AA-normal": true,
    "AA-large": true,
    "AAA-normal": true,
    "AAA-large": true
  }
}
```

---

### Example: Check large text (lower requirements)

Large text is defined as 18pt+ regular or 14pt+ bold.

**Tool:** `validate-wcag-contrast`

**Input:**
```json
{
  "foreground": "#6366F1",
  "background": "#FFFFFF",
  "level": "AA",
  "textSize": "large"
}
```

**Expected Response:**
```json
{
  "valid": true,
  "foreground": {
    "input": "#6366F1",
    "hex": "#6366F1"
  },
  "background": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF"
  },
  "contrast": {
    "ratio": 4.34,
    "ratioString": "4.34:1"
  },
  "requirement": {
    "level": "AA",
    "textSize": "large",
    "minimumRatio": 3
  },
  "result": "Passes WCAG AA for large text",
  "allLevels": {
    "AA-normal": false,
    "AA-large": true,
    "AAA-normal": false,
    "AAA-large": false
  }
}
```

---

## Color Blindness Simulation

Use `validate-color-blindness` to simulate how your colors appear to people with color vision deficiencies (CVD).

### Types of Color Vision Deficiency

| Type | Description | Prevalence |
|------|-------------|------------|
| Protanopia | Red blindness (no red cones) | 1% of males |
| Protanomaly | Red weakness (reduced red sensitivity) | 1% of males |
| Deuteranopia | Green blindness (no green cones) | 1% of males |
| Deuteranomaly | Green weakness (reduced green sensitivity) | 5% of males |
| Tritanopia | Blue blindness (no blue cones) | 0.01% |
| Tritanomaly | Blue weakness (reduced blue sensitivity) | 0.01% |
| Achromatopsia | Complete color blindness | 0.003% |
| Achromatomaly | Partial color blindness | Rare |

### Example: Simulate common CVD types

**Tool:** `validate-color-blindness`

**Input:**
```json
{
  "colors": ["#EF4444", "#22C55E", "#3B82F6"],
  "severity": 1.0
}
```

**Expected Response:**
```json
{
  "severity": 1.0,
  "colorCount": 3,
  "results": {
    "protanopia": {
      "info": {
        "name": "Protanopia",
        "description": "Red blindness (dichromacy)",
        "prevalence": "1% of males, 0.01% of females"
      },
      "colors": [
        {
          "input": "#EF4444",
          "original": "#EF4444",
          "simulated": "#A19552",
          "deltaE": 32.45,
          "perceptualChange": "Major change"
        },
        {
          "input": "#22C55E",
          "original": "#22C55E",
          "simulated": "#B9B439",
          "deltaE": 28.91,
          "perceptualChange": "Major change"
        },
        {
          "input": "#3B82F6",
          "original": "#3B82F6",
          "simulated": "#4E7FF4",
          "deltaE": 5.23,
          "perceptualChange": "Noticeable change"
        }
      ],
      "confusablePairs": [
        {
          "color1": "#EF4444",
          "color2": "#22C55E",
          "simulatedDeltaE": 2.34
        }
      ],
      "hasConfusablePairs": true
    },
    "deuteranopia": {
      "info": {
        "name": "Deuteranopia",
        "description": "Green blindness (dichromacy)",
        "prevalence": "1% of males, 0.01% of females"
      },
      "colors": [
        {
          "input": "#EF4444",
          "original": "#EF4444",
          "simulated": "#C08935",
          "deltaE": 29.87,
          "perceptualChange": "Major change"
        },
        {
          "input": "#22C55E",
          "original": "#22C55E",
          "simulated": "#A9A750",
          "deltaE": 31.22,
          "perceptualChange": "Major change"
        },
        {
          "input": "#3B82F6",
          "original": "#3B82F6",
          "simulated": "#5B7AF0",
          "deltaE": 4.89,
          "perceptualChange": "Noticeable change"
        }
      ],
      "confusablePairs": [
        {
          "color1": "#EF4444",
          "color2": "#22C55E",
          "simulatedDeltaE": 2.78
        }
      ],
      "hasConfusablePairs": true
    },
    "tritanopia": {
      "info": {
        "name": "Tritanopia",
        "description": "Blue blindness (dichromacy)",
        "prevalence": "Less than 0.01%"
      },
      "colors": [
        {
          "input": "#EF4444",
          "original": "#EF4444",
          "simulated": "#F04949",
          "deltaE": 1.23,
          "perceptualChange": "Barely perceptible change"
        },
        {
          "input": "#22C55E",
          "original": "#22C55E",
          "simulated": "#3DC0A8",
          "deltaE": 18.34,
          "perceptualChange": "Major change"
        },
        {
          "input": "#3B82F6",
          "original": "#3B82F6",
          "simulated": "#2A9494",
          "deltaE": 23.56,
          "perceptualChange": "Major change"
        }
      ],
      "hasConfusablePairs": false
    }
  },
  "overallAssessment": {
    "accessible": false,
    "message": "Some color pairs may be confusable for people with color vision deficiencies",
    "recommendation": "Consider using additional visual cues (patterns, labels, icons) alongside color"
  }
}
```

**Key Insight:** Red (#EF4444) and green (#22C55E) become nearly indistinguishable for people with protanopia and deuteranopia. This is why red/green should never be the only differentiator.

---

### Example: Simulate specific CVD type

**Tool:** `validate-color-blindness`

**Input:**
```json
{
  "colors": ["#F59E0B", "#8B5CF6", "#06B6D4"],
  "cvdType": "deuteranopia",
  "severity": 1.0
}
```

**Expected Response:**
```json
{
  "severity": 1.0,
  "colorCount": 3,
  "results": {
    "deuteranopia": {
      "info": {
        "name": "Deuteranopia",
        "description": "Green blindness (dichromacy)",
        "prevalence": "1% of males, 0.01% of females"
      },
      "colors": [
        {
          "input": "#F59E0B",
          "original": "#F59E0B",
          "simulated": "#D9A520",
          "deltaE": 8.34,
          "perceptualChange": "Significant change"
        },
        {
          "input": "#8B5CF6",
          "original": "#8B5CF6",
          "simulated": "#4B6FF4",
          "deltaE": 15.67,
          "perceptualChange": "Major change"
        },
        {
          "input": "#06B6D4",
          "original": "#06B6D4",
          "simulated": "#8AAFD0",
          "deltaE": 19.23,
          "perceptualChange": "Major change"
        }
      ],
      "hasConfusablePairs": false
    }
  },
  "overallAssessment": {
    "accessible": true,
    "message": "Colors appear distinguishable across simulated CVD types"
  }
}
```

This palette (amber, violet, cyan) maintains distinctiveness even with deuteranopia.

---

### Example: Partial color blindness simulation

**Tool:** `validate-color-blindness`

**Input:**
```json
{
  "colors": ["#DC2626", "#16A34A"],
  "cvdType": "deuteranomaly",
  "severity": 0.5
}
```

**Expected Response:**
```json
{
  "severity": 0.5,
  "colorCount": 2,
  "results": {
    "deuteranomaly": {
      "info": {
        "name": "Deuteranomaly",
        "description": "Green weakness (anomalous trichromacy)",
        "prevalence": "5% of males, 0.35% of females"
      },
      "colors": [
        {
          "input": "#DC2626",
          "original": "#DC2626",
          "simulated": "#C95528",
          "deltaE": 12.34,
          "perceptualChange": "Major change"
        },
        {
          "input": "#16A34A",
          "original": "#16A34A",
          "simulated": "#6E9245",
          "deltaE": 18.56,
          "perceptualChange": "Major change"
        }
      ],
      "confusablePairs": [
        {
          "color1": "#DC2626",
          "color2": "#16A34A",
          "simulatedDeltaE": 2.89
        }
      ],
      "hasConfusablePairs": true
    }
  },
  "overallAssessment": {
    "accessible": false,
    "message": "Some color pairs may be confusable for people with color vision deficiencies",
    "recommendation": "Consider using additional visual cues (patterns, labels, icons) alongside color"
  }
}
```

---

## Generating Accessible Palettes

Use `generate-accessible-palette` to automatically adjust colors to meet WCAG contrast requirements.

### Example: Make brand colors accessible

**Tool:** `generate-accessible-palette`

**Input:**
```json
{
  "colors": ["#60A5FA", "#34D399", "#F472B6"],
  "backgroundColor": "#FFFFFF",
  "level": "AA"
}
```

**Expected Response:**
```json
{
  "background": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF"
  },
  "targetLevel": "AA",
  "requiredContrast": "4.5:1",
  "summary": {
    "total": 3,
    "alreadyAccessible": 0,
    "adjusted": 3
  },
  "colors": [
    {
      "input": "#60A5FA",
      "original": {
        "hex": "#60A5FA",
        "contrast": 2.67,
        "passes": false
      },
      "adjusted": {
        "hex": "#2563EB",
        "contrast": 4.58,
        "passes": true,
        "lightnessChange": -22
      },
      "note": "Darkened to meet contrast"
    },
    {
      "input": "#34D399",
      "original": {
        "hex": "#34D399",
        "contrast": 2.18,
        "passes": false
      },
      "adjusted": {
        "hex": "#059669",
        "contrast": 4.52,
        "passes": true,
        "lightnessChange": -24
      },
      "note": "Darkened to meet contrast"
    },
    {
      "input": "#F472B6",
      "original": {
        "hex": "#F472B6",
        "contrast": 2.89,
        "passes": false
      },
      "adjusted": {
        "hex": "#DB2777",
        "contrast": 4.61,
        "passes": true,
        "lightnessChange": -18
      },
      "note": "Darkened to meet contrast"
    }
  ]
}
```

---

### Example: Accessible text for dark background

**Tool:** `generate-accessible-palette`

**Input:**
```json
{
  "colors": ["#6B7280", "#9CA3AF", "#D1D5DB"],
  "backgroundColor": "#1F2937",
  "level": "AA"
}
```

**Expected Response:**
```json
{
  "background": {
    "input": "#1F2937",
    "hex": "#1F2937"
  },
  "targetLevel": "AA",
  "requiredContrast": "4.5:1",
  "summary": {
    "total": 3,
    "alreadyAccessible": 2,
    "adjusted": 1
  },
  "colors": [
    {
      "input": "#6B7280",
      "original": {
        "hex": "#6B7280",
        "contrast": 3.87,
        "passes": false
      },
      "adjusted": {
        "hex": "#9CA3AF",
        "contrast": 5.89,
        "passes": true,
        "lightnessChange": 12
      },
      "note": "Lightened to meet contrast"
    },
    {
      "input": "#9CA3AF",
      "original": {
        "hex": "#9CA3AF",
        "contrast": 5.89,
        "passes": true
      },
      "adjusted": null,
      "note": "Already meets WCAG AA requirements"
    },
    {
      "input": "#D1D5DB",
      "original": {
        "hex": "#D1D5DB",
        "contrast": 10.43,
        "passes": true
      },
      "adjusted": null,
      "note": "Already meets WCAG AA requirements"
    }
  ]
}
```

---

### Example: Generate AAA-compliant palette

**Tool:** `generate-accessible-palette`

**Input:**
```json
{
  "colors": ["#3B82F6", "#10B981", "#F59E0B"],
  "backgroundColor": "#FFFFFF",
  "level": "AAA"
}
```

**Expected Response:**
```json
{
  "background": {
    "input": "#FFFFFF",
    "hex": "#FFFFFF"
  },
  "targetLevel": "AAA",
  "requiredContrast": "7:1",
  "summary": {
    "total": 3,
    "alreadyAccessible": 0,
    "adjusted": 3
  },
  "colors": [
    {
      "input": "#3B82F6",
      "original": {
        "hex": "#3B82F6",
        "contrast": 3.43,
        "passes": false
      },
      "adjusted": {
        "hex": "#1D4ED8",
        "contrast": 7.12,
        "passes": true,
        "lightnessChange": -28
      },
      "note": "Darkened to meet contrast"
    },
    {
      "input": "#10B981",
      "original": {
        "hex": "#10B981",
        "contrast": 3.34,
        "passes": false
      },
      "adjusted": {
        "hex": "#047857",
        "contrast": 7.08,
        "passes": true,
        "lightnessChange": -26
      },
      "note": "Darkened to meet contrast"
    },
    {
      "input": "#F59E0B",
      "original": {
        "hex": "#F59E0B",
        "contrast": 2.15,
        "passes": false
      },
      "adjusted": {
        "hex": "#B45309",
        "contrast": 7.15,
        "passes": true,
        "lightnessChange": -32
      },
      "note": "Darkened to meet contrast"
    }
  ]
}
```

---

## Calculating Color Differences

Use `calculate-delta-e` to measure perceptual differences between colors using industry-standard formulas.

### Delta-E Interpretation

| Delta-E Value | Perception |
|---------------|------------|
| < 1.0 | Imperceptible difference |
| 1.0 - 2.0 | Perceptible only through close observation |
| 2.0 - 3.5 | Perceptible at a glance |
| 3.5 - 5.0 | Colors are more similar than different |
| > 5.0 | Colors are noticeably different |

### Example: Compare two similar colors

**Tool:** `calculate-delta-e`

**Input:**
```json
{
  "color1": "#3B82F6",
  "color2": "#2563EB",
  "method": "CIEDE2000"
}
```

**Expected Response:**
```json
{
  "color1": {
    "input": "#3B82F6",
    "hex": "#3B82F6",
    "lab": { "L": 55.89, "a": 8.03, "b": -55.54 }
  },
  "color2": {
    "input": "#2563EB",
    "hex": "#2563EB",
    "lab": { "L": 47.53, "a": 23.82, "b": -68.23 }
  },
  "deltaE": {
    "value": 11.23,
    "method": "CIEDE2000",
    "methodDescription": "CIEDE2000 - Most accurate for small color differences, accounts for perceptual non-uniformities"
  },
  "interpretation": {
    "description": "Colors are noticeably different",
    "perceptible": true,
    "acceptable": false
  },
  "thresholds": {
    "imperceptible": "< 1.0",
    "closeObservation": "1.0 - 2.0",
    "perceptibleAtGlance": "2.0 - 3.5",
    "moreSimilarThanDifferent": "3.5 - 5.0",
    "noticeablyDifferent": "> 5.0"
  }
}
```

---

### Example: Verify brand color consistency

Check if two implementations of the same brand color are acceptably similar.

**Tool:** `calculate-delta-e`

**Input:**
```json
{
  "color1": "#FF5722",
  "color2": "#FF5A26",
  "method": "CIEDE2000"
}
```

**Expected Response:**
```json
{
  "color1": {
    "input": "#FF5722",
    "hex": "#FF5722",
    "lab": { "L": 57.38, "a": 55.92, "b": 54.12 }
  },
  "color2": {
    "input": "#FF5A26",
    "hex": "#FF5A26",
    "lab": { "L": 58.12, "a": 54.67, "b": 53.89 }
  },
  "deltaE": {
    "value": 1.23,
    "method": "CIEDE2000",
    "methodDescription": "CIEDE2000 - Most accurate for small color differences, accounts for perceptual non-uniformities"
  },
  "interpretation": {
    "description": "Perceptible only through close observation",
    "perceptible": true,
    "acceptable": true
  },
  "thresholds": {
    "imperceptible": "< 1.0",
    "closeObservation": "1.0 - 2.0",
    "perceptibleAtGlance": "2.0 - 3.5",
    "moreSimilarThanDifferent": "3.5 - 5.0",
    "noticeablyDifferent": "> 5.0"
  }
}
```

**Use Case:** Ensuring consistent brand colors across different displays or print runs.

---

## Best Practices

### 1. Test Early, Test Often

Run accessibility checks during design, not just before launch:

```json
// Check every text/background combination
{
  "foreground": "your-text-color",
  "background": "your-bg-color",
  "level": "AA"
}
```

### 2. Design for the 8%

Approximately 8% of males have some form of color vision deficiency. Always:
- Test palettes with `validate-color-blindness`
- Never use color as the only means of conveying information
- Include icons, labels, or patterns alongside color coding

### 3. Provide Sufficient Contrast

| Use Case | Minimum Ratio |
|----------|---------------|
| Body text | 4.5:1 (AA) |
| Large text (18pt+) | 3:1 (AA) |
| UI components/graphics | 3:1 (AA) |
| Enhanced accessibility | 7:1 (AAA) |

### 4. Consider Context

Adjust requirements based on environment:
- Mobile devices in sunlight need higher contrast
- Dark mode requires re-testing all combinations
- Print materials have different concerns than screen

### 5. Document Your Choices

Include accessibility rationale in your design documentation:

```
Primary Blue: #2563EB
- Contrast on white: 4.58:1 (passes WCAG AA)
- Contrast on dark (#1F2937): 3.12:1 (passes large text only)
- CVD: Distinguishable from green #059669 (Delta-E: 34.5)
```

---

## Next Steps

- See [basic-usage.md](./basic-usage.md) for fundamental color operations
- See [advanced-palettes.md](./advanced-palettes.md) for complex palette generation
