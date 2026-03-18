# Documentation

This directory contains documentation for the Color Theory MCP Server.

## Structure

```
docs/
├── README.md       # This file
└── api/            # Generated TypeDoc API documentation (git-ignored)
```

## API Documentation

The `api/` directory contains auto-generated API documentation from TypeScript source code using [TypeDoc](https://typedoc.org/).

**This directory is git-ignored** because it contains generated files that can be rebuilt from source.

### Building API Docs

To generate the API documentation locally:

```bash
# Generate docs once
npm run docs

# Generate and watch for changes (development)
npm run docs:serve
```

### Output

After running `npm run docs`, open `docs/api/index.html` in your browser to view the documentation.

## Documentation Workflow

1. Write TSDoc comments in source code
2. Run `npm run docs` to generate
3. Review generated docs locally
4. Docs are also built during CI to verify generation succeeds

## TSDoc Guidelines

Use JSDoc/TSDoc comments in source code for best documentation output:

```typescript
/**
 * Converts a color from one color space to another.
 *
 * @param color - The source color to convert
 * @param targetSpace - The target color space identifier
 * @returns The converted color in the target space
 *
 * @example
 * ```ts
 * const lab = convert(srgbColor, 'lab');
 * ```
 */
export function convert(color: Color, targetSpace: string): Color {
  // ...
}
```

## Notes

- API docs are generated during CI but not deployed (build verification only)
- For deployment, consider GitHub Pages or similar static hosting
- Keep source code comments up to date for accurate documentation
