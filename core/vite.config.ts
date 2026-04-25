import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'specifyjs': path.resolve(__dirname, 'src/index.ts'),
      'specifyjs/dom': path.resolve(__dirname, 'src/dom/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
});
