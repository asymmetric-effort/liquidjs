# Production Builds

## Library Build

Build the SpecifyJS library for distribution:

```bash
cd core
npm run build
```

Outputs:
- `dist/specifyjs.esm.js` — ES module (14KB)
- `dist/specifyjs.cjs.js` — CommonJS (15KB)
- `dist/specifyjs-dom.esm.js` — DOM renderer (40KB)
- `dist/specifyjs-server.esm.js` — Pre-rendering (11KB)
- `dist/specifyjs.d.ts` — TypeScript declarations

## Application Build

Build a SpecifyJS SPA for deployment using Vite:

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

