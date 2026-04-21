import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'liquidjs/hooks': path.resolve(__dirname, '../../../core/src/hooks/index.ts'),
      'liquidjs/dom': path.resolve(__dirname, '../../../core/src/dom/index.ts'),
      'liquidjs': path.resolve(__dirname, '../../../core/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
});
