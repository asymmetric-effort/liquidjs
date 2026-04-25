# Production Builds

## Library Build

Build the LiquidJS library for distribution:

```bash
cd core
npm run build
```

Outputs:
- `dist/liquidjs.esm.js` — ES module (14KB)
- `dist/liquidjs.cjs.js` — CommonJS (15KB)
- `dist/liquidjs-dom.esm.js` — DOM renderer (40KB)
- `dist/liquidjs-server.esm.js` — Pre-rendering (11KB)
- `dist/liquidjs.d.ts` — TypeScript declarations

## Application Build

Build a LiquidJS SPA for deployment using Vite:

```bash
npx vite build
```

Vite automatically:
- Tree-shakes unused code
- Minifies with esbuild/Terser
- Generates source maps
- Code-splits dynamic imports

## Bundle Size Targets

- Core framework: < 15KB gzipped
- Full app (core + DOM renderer): < 50KB gzipped

## Optimization Tips

1. Use `memo` to prevent unnecessary re-renders
2. Use `useMemo`/`useCallback` for expensive operations
3. Use `lazy` for code splitting large components
4. Minimize component depth — flatter trees diff faster

## Debugging Production Bundles

Use the `liquidjs-debug` CLI tool:

```bash
liquidjs-debug analyze dist/bundle.js     # Bundle statistics
liquidjs-debug deminify dist/bundle.js    # Pretty-print minified code
liquidjs-debug sourcemap info bundle.map  # Inspect source map
```

See [Debug Tools](../tools/liquidjs-debug.md) for full documentation.
