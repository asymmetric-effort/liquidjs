import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'specifyjs/hooks': path.resolve(__dirname, '../../../core/src/hooks/index.ts'),
      'specifyjs/dom': path.resolve(__dirname, '../../../core/src/dom/index.ts'),
      'specifyjs': path.resolve(__dirname, '../../../core/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
});
