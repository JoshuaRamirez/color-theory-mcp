# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-19

### Added

- **New Color Spaces**
  - **CAM16**: Advanced Color Appearance Model (J, C, h) for accurate perceptual modeling.
  - **HCT**: Google's Material Design 3 color space (Hue, Chroma, Tone), bridging CAM16 and design utility.

- **Advanced Mixing & Blending**
  - **Blend Modes**: Added 12 compositing modes (multiply, screen, overlay, soft-light, etc.) to `mix-colors`.
  - **Subtractive Mixing**: Pigment-like mixing simulation for realistic paint/ink blending.
  - **Interpolation Strategies**: CSS Color 4 hue interpolation methods (shorter, longer, increasing, decreasing).

- **Accessibility Enhancements**
  - **APCA Support**: Added Advanced Perceptual Contrast Algorithm (Lc value) to `validate-wcag-contrast` and `get-color-info`.
  - **Daltonization**: `validate-color-blindness` now suggests corrected colors for CVD users.
  - **WCAG 2.2**: Added non-text contrast checks (3:1) for UI components and graphics.

- **Production-Ready Generation**
  - **Multi-Platform Tokens**: `generate-design-tokens` now exports to **iOS (Swift)**, **Android (XML)**, **SCSS**, and **Figma JSON**.
  - **Material 3 Themes**: `generate-theme` upgraded to use HCT engine for official Material Design fidelity.
  - **Advanced Gradients**: Multi-stop gradients with easing functions (linear, ease-in, ease-out) in `generate-gradient`.

- **Parsing & Math**
  - **Universal Parsing**: Full CSS Color 4 support (oklch, lab, color(display-p3), hwb).
  - **Gamut Mapping**: Implemented Oklch binary-search gamut mapping for high-quality reduction.
  - **Chromatic Adaptation**: Verified Bradford transform for accurate D50/D65 illuminant handling.

## [1.0.1] - 2026-02-04

### Added

- **MCP Server Implementation**
  - 24 tools for comprehensive color theory operations
  - Full Model Context Protocol (MCP) compliance

- **Color Space Support (13 spaces)**
  - sRGB and Linear sRGB
  - Display P3 for wide-gamut displays
  - XYZ-D65 and XYZ-D50 reference illuminants
  - Lab (CIELAB) and LCH (cylindrical Lab)
  - Oklab and Oklch perceptually uniform spaces
  - HSL, HSV, and HWB cylindrical models
  - CMYK for print workflows

- **Query Tools**
  - `get-color-info` - Comprehensive color information retrieval
  - `get-color-name` - Find closest CSS named color match
  - `get-color-meaning` - Cultural and psychological color meanings
  - `list-named-colors` - List all 147 CSS named colors

- **Conversion Tools**
  - `convert-color` - Convert between any supported color spaces
  - `convert-batch` - Batch conversion for multiple colors
  - `parse-color-string` - Parse any CSS color format

- **Calculation Tools**
  - `calculate-contrast` - WCAG contrast ratio calculation
  - `calculate-delta-e` - Perceptual difference (CIE76, CIE94, CIEDE2000)
  - `calculate-luminance` - Relative luminance computation
  - `mix-colors` - Color blending with gradient support
  - `adjust-color` - Lighten, darken, saturate, desaturate operations

- **Generation Tools**
  - `generate-harmony` - 7 harmony algorithms (complementary, analogous, triadic, split-complementary, tetradic, square, monochromatic)
  - `generate-palette` - Design system palette generation
  - `generate-gradient` - Smooth gradient generation
  - `generate-accessible-palette` - WCAG-compliant color alternatives
  - `generate-scale` - Tailwind-style 50-950 color scales

- **Validation Tools**
  - `validate-wcag-contrast` - AA/AAA accessibility compliance checking
  - `validate-color-blindness` - CVD simulation (protanopia, deuteranopia, tritanopia)
  - `validate-gamut` - In-gamut verification for color spaces
  - `validate-print-safe` - CMYK feasibility checking
  - `validate-palette-harmony` - Harmony analysis for palettes

- **Data Resources**
  - 147 CSS named colors with lookup and closest match
  - Cultural color meanings (Western, East Asian, South Asian, Middle Eastern)

- **Domain-Driven Architecture**
  - Value objects for Color, Palette, Gradient, Matrix3x3
  - Clean separation with interfaces for color spaces, harmony algorithms, and CVD strategies
  - Strategy pattern for Delta-E calculations and CVD simulation

[Unreleased]: https://github.com/JoshuaRamirez/color-theory-mcp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/JoshuaRamirez/color-theory-mcp/releases/tag/v1.0.0
