import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'liquidjs': path.resolve(__dirname, 'src/index.ts'),
      'liquidjs/dom': path.resolve(__dirname, 'src/dom/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
});
