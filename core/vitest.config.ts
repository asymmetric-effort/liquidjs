import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'liquidjs': path.resolve(__dirname, 'src/index.ts'),
      'liquidjs/dom': path.resolve(__dirname, 'src/dom/index.ts'),
      'liquidjs/server': path.resolve(__dirname, 'src/server/index.ts'),
      'liquidjs/client': path.resolve(__dirname, 'src/client/index.ts'),
      'liquidjs/telemetry': path.resolve(__dirname, 'src/telemetry/index.ts'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      '../components/*/tests/**/*.test.ts',
      '../components/*/*/tests/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/index.ts', 'src/**/*.d.ts'],
      thresholds: {
        statements: 97.5,
        branches: 94,
        functions: 98,
        lines: 97.5,
      },
    },
    setupFiles: ['tests/setup.ts'],
    teardownTimeout: 5000,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
