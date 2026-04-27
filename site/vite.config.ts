import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { specifyJsSeoPlugin } from '../core/src/build/index';

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
        if (
          fileName.endsWith('.css') &&
          chunk.type === 'asset' &&
          typeof chunk.source === 'string'
        ) {
          chunk.source = CSS_BANNER + '\n' + chunk.source;
        }
      }
    },
  };
}

/**
 * Load local HTTPS certs if available.
 * Run scripts/setup-dev-certs.sh to generate them.
 */
function loadHttpsCerts(): { key: Buffer; cert: Buffer } | undefined {
  const certDir = path.resolve(__dirname, '../.certs');
  const certPath = path.join(certDir, 'cert.pem');
  const keyPath = path.join(certDir, 'key.pem');
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  return undefined;
}

const https = loadHttpsCerts();

export default defineConfig({
  resolve: {
    alias: {
      'specifyjs/hooks': path.resolve(__dirname, '../core/src/hooks/index.ts'),
      'specifyjs/dom': path.resolve(__dirname, '../core/src/dom/index.ts'),
      'specifyjs': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  server: {
    https: https as any,
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        banner: JS_BANNER,
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  plugins: [
    cssBannerPlugin(),
    specifyJsSeoPlugin({
      siteUrl: 'https://specifyjs.asymmetric-effort.com',
      title: 'SpecifyJS',
      description: 'A declarative TypeScript UI framework built for performance, browser compatibility, and developer simplicity. Zero runtime dependencies. 4KB gzipped core.',
      routes: ['/', '/#/components', '/#/dashboard', '/#/concurrent', '/#/api', '/#/docs', '/#/getting-started', '/#/featureflags'],
      docsDir: path.resolve(__dirname, '..', 'docs'),
      npmPackage: '@asymmetric-effort/specifyjs',
      author: 'Asymmetric Effort, LLC',
      license: 'MIT',
      repository: 'https://github.com/asymmetric-effort/specifyjs',
    }),
  ],
  base: './',
});
