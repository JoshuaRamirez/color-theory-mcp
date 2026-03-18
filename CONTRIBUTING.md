# Contributing to Color Theory MCP Server

Thank you for your interest in contributing to the Color Theory MCP Server. This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Commit Messages](#commit-messages)

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

Before submitting a bug report:

1. **Search existing issues** to avoid duplicates
2. **Test with the latest version** to ensure the bug hasn't been fixed

When submitting a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs. **actual behavior**
- **Environment details**: Node.js version, operating system, MCP client used
- **Code samples** or tool inputs that trigger the bug
- **Error messages** or logs if available

### Suggesting Features

Feature requests are welcome. When suggesting a feature:

1. **Check existing issues** for similar suggestions
2. **Describe the use case** - what problem does this solve?
3. **Propose a solution** if you have one in mind
4. **Consider scope** - does this fit the project's goals?

Good feature suggestions might include:

- Additional color spaces (e.g., ACEScg, Rec. 2020)
- New harmony algorithms
- Additional accessibility standards
- Performance improvements
- New MCP tools

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Follow the development setup** instructions below
3. **Make your changes** with appropriate tests
4. **Ensure all tests pass** before submitting
5. **Update documentation** if your changes affect the public API
6. **Submit the pull request** with a clear description

#### Pull Request Guidelines

- Keep PRs focused on a single change
- Reference any related issues
- Include tests for new functionality
- Update the CHANGELOG.md for user-facing changes
- Ensure your code follows the project's style guidelines

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/color-theory-mcp.git
cd color-theory-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Development Commands

```bash
npm run dev      # Run with tsx for development (auto-reload)
npm run build    # Compile TypeScript to JavaScript
npm run test     # Run the test suite
npm run lint     # Check code style (if configured)
```

### Project Structure

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

## Code Style

### General Guidelines

- **TypeScript**: Use strict typing; avoid `any` when possible
- **Naming**: Use descriptive names; prefer clarity over brevity
- **Comments**: Add comments for complex algorithms or non-obvious code
- **Files**: One class per file; keep files focused and modular

### Specific Conventions

- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and interfaces
- Prefix interfaces with `I` (e.g., `IColorSpace`)
- Use meaningful parameter names in public APIs

### Color Handling

- Internal calculations should use linear sRGB or XYZ-D65
- Clamp output values to valid ranges
- Document color space assumptions in comments
- Include units in variable names where helpful (e.g., `angleDegrees`)

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Add tests for all new functionality
- Test edge cases: out-of-gamut colors, boundary values, invalid inputs
- Use descriptive test names that explain what is being tested
- Group related tests using describe blocks

### Test Coverage

Focus testing on:

- Color space conversions (round-trip accuracy)
- Calculation correctness (contrast ratios, Delta-E values)
- Tool input validation
- Edge cases and error handling

## Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(tools): add generate-tints tool for tint generation

fix(conversion): correct Lab to XYZ matrix coefficients

docs(readme): add examples for color blindness simulation

test(harmony): add tests for tetradic harmony edge cases
```

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

Thank you for contributing to Color Theory MCP Server!
