# Static Pre-rendering API

Import from `specifyjs/server`.

> **Important:** These APIs are for **build-time static HTML generation only** — use them in build scripts to produce static HTML files served as-is by a web server or CDN. They must NOT be used in server request handlers, middleware, or any runtime code that responds to HTTP requests.
>
> SpecifyJS is a **browser-side SPA framework**. For dynamic content, use client-side rendering with data fetched via HTTPS from API endpoints.

## When to Use Static Pre-rendering

- **Static site generation (SSG)** — Generate HTML pages at build time for SEO or initial page load performance
- **Build scripts** — Pre-render component trees to HTML files during `npm run build`
- **Testing** — Generate HTML snapshots for visual regression testing

## When NOT to Use These APIs

- **Request handlers** — Never call `renderToString` inside an Express route, Koa middleware, or any HTTP handler
- **Edge functions** — Never render components on Cloudflare Workers, Vercel Edge, etc. at request time
- **API responses** — Never return pre-rendered HTML as an API response

If you need dynamic content, have the SPA fetch it as JSON from an API endpoint.

## renderToString

Renders a component tree to an HTML string during the build process:

```typescript
// build-script.ts — run with: SPECIFYJS_ALLOW_PRERENDER=true node build-script.ts
import { renderToString } from 'specifyjs/server';

const html = renderToString(createElement(App, null));
fs.writeFileSync('dist/index.html', wrapInShell(html));
```

Set the environment variable `SPECIFYJS_ALLOW_PRERENDER=true` to confirm you are using this in a build context. Without it, a warning is emitted in production environments.

## renderToStaticMarkup

Same as `renderToString` but without hydration markers. Use for pages that don't need client-side interactivity after load:

```typescript
const html = renderToStaticMarkup(createElement(StaticPage, null));
fs.writeFileSync('dist/about.html', html);
```

## renderToPipeableStream

Writes pre-rendered HTML to a Node.js writable stream in chunks. Useful for generating large static pages during build:

```typescript
import { renderToPipeableStream } from 'specifyjs/server';
import { createWriteStream } from 'fs';

const stream = renderToPipeableStream(createElement(App, null), {
  onAllReady() { console.log('Pre-render complete'); },
});
stream.pipe(createWriteStream('dist/index.html'));
```

## renderToReadableStream

Returns a Web ReadableStream of pre-rendered HTML. Useful in build tools that work with Web Streams:

```typescript
import { renderToReadableStream } from 'specifyjs/server';

const stream = await renderToReadableStream(createElement(App, null));
// Write stream to file during build
```

## Security

These APIs execute component code (including any side effects in component functions). Running untrusted component code on a server at request time creates security risks:

- **Code injection** — Malicious components could access server resources (filesystem, environment variables, databases)
- **Denial of service** — Expensive component trees could block the server event loop
- **Data leakage** — Build-time state could leak into rendered HTML

By restricting these APIs to build-time usage, component code only runs in the build environment (which is already trusted), and the output is static HTML served by a simple file server with no execution context.

## HTML Escaping

All text content and attribute values are automatically escaped to prevent XSS in the generated HTML. Use `dangerouslySetInnerHTML` only for trusted content:

```typescript
createElement('div', { dangerouslySetInnerHTML: { __html: trustedHtml } });
```
