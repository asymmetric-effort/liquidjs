import { defineConfig, type Plugin } from 'vite';
import path from 'path';

const JS_BANNER = '/* (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE */';
const CSS_BANNER = '/* (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE */';

/**
 * Vite plugin to prepend a copyright banner to CSS assets.
 * Rollup's `output.banner` only applies to JS chunks.
 */
function cssBannerPlugin(): Plugin {
  return {
    name: 'css-banner',
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css') && chunk.type === 'asset' && typeof chunk.source === 'string') {
          chunk.source = CSS_BANNER + '\n' + chunk.source;
        }
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      'liquidjs/hooks': path.resolve(__dirname, '../core/src/hooks/index.ts'),
      'liquidjs/dom': path.resolve(__dirname, '../core/src/dom/index.ts'),
      'liquidjs': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        banner: JS_BANNER,
      },
    },
  },
  plugins: [cssBannerPlugin()],
  base: './',
});
