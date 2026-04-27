import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

const SITE_URL = 'https://specifyjs.asymmetric-effort.com';
const JS_BANNER = '/* (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE */';
const CSS_BANNER = '/* (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE */';

/**
 * Vite plugin to generate sitemap.xml, robots.txt, and llms.txt at build time.
 * Reads routes from the site and docs from docs/ to produce accurate files.
 */
function seoFilesPlugin(): Plugin {
  return {
    name: 'seo-files',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const docsDir = path.resolve(__dirname, '..', 'docs');
      const today = new Date().toISOString().split('T')[0];

      // Collect all routes
      const routes = [
        '/',
        '/#/components',
        '/#/dashboard',
        '/#/concurrent',
        '/#/api',
        '/#/docs',
        '/#/getting-started',
        '/#/featureflags',
      ];

      // Collect doc routes
      const docPaths: string[] = [];
      function walkDocs(dir: string, prefix: string) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (entry.isDirectory()) {
            walkDocs(path.join(dir, entry.name), prefix + entry.name + '/');
          } else if (entry.name.endsWith('.md')) {
            docPaths.push(prefix + entry.name.replace('.md', ''));
          }
        }
      }
      if (fs.existsSync(docsDir)) {
        walkDocs(docsDir, '');
      }
      for (const dp of docPaths) {
        routes.push(`/#/docs/${dp}`);
      }

      // ── sitemap.xml ────────────────────────────────────────────────
      const sitemapEntries = routes.map(
        (r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod></url>`,
      );
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...sitemapEntries,
        '</urlset>',
      ].join('\n');
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

      // ── robots.txt ─────────────────────────────────────────────────
      const robots = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${SITE_URL}/sitemap.xml`,
      ].join('\n');
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);

      // ── llms.txt ───────────────────────────────────────────────────
      const guideNames = docPaths
        .filter((p) => p.startsWith('guides/'))
        .map((p) => p.replace('guides/', ''));
      const apiNames = docPaths
        .filter((p) => p.startsWith('api/'))
        .map((p) => p.replace('api/', ''));

      const llms = [
        '# SpecifyJS',
        '',
        '> A declarative TypeScript UI framework built for performance,',
        '> browser compatibility, and developer simplicity.',
        '> Zero runtime dependencies. 4KB gzipped core.',
        '',
        `## Website: ${SITE_URL}`,
        `## Repository: https://github.com/asymmetric-effort/specifyjs`,
        `## npm: https://www.npmjs.com/package/@asymmetric-effort/specifyjs`,
        '',
        '## Documentation',
        '',
        ...guideNames.map((g) => `- ${g}: ${SITE_URL}/#/docs/guides/${g}`),
        '',
        '## API Reference',
        '',
        ...apiNames.map((a) => `- ${a}: ${SITE_URL}/#/docs/api/${a}`),
        '',
        '## Install',
        '',
        '```',
        'npm install @asymmetric-effort/specifyjs',
        '```',
        '',
        '## License: MIT',
        '## Author: Asymmetric Effort, LLC',
      ].join('\n');
      fs.writeFileSync(path.join(distDir, 'llms.txt'), llms);

      console.log(`Generated: sitemap.xml (${routes.length} URLs), robots.txt, llms.txt`);
    },
  };
}

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
  plugins: [cssBannerPlugin(), seoFilesPlugin()],
  base: './',
});
