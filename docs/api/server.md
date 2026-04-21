# Server Rendering API

Import from `liquidjs/server`.

## renderToString

Renders to an HTML string with hydration attributes:

```typescript
import { renderToString } from 'liquidjs/server';

const html = renderToString(createElement(App, null));
// '<div class="app"><h1>Hello</h1></div>'
```

## renderToStaticMarkup

Renders to HTML without hydration attributes (for static pages):

```typescript
import { renderToStaticMarkup } from 'liquidjs/server';

const html = renderToStaticMarkup(createElement(Page, null));
```

## renderToPipeableStream

Node.js streaming SSR:

```typescript
import { renderToPipeableStream } from 'liquidjs/server';

const stream = renderToPipeableStream(createElement(App, null), {
  onShellReady() { stream.pipe(res); },
  onAllReady() { /* complete */ },
  onError(err) { console.error(err); },
});
```

## renderToReadableStream

Web Streams API (edge runtimes):

```typescript
import { renderToReadableStream } from 'liquidjs/server';

const stream = await renderToReadableStream(createElement(App, null));
return new Response(stream, { headers: { 'content-type': 'text/html' } });
```

## HTML Escaping

All text content and attribute values are automatically escaped to prevent XSS. Use `dangerouslySetInnerHTML` for raw HTML:

```typescript
createElement('div', { dangerouslySetInnerHTML: { __html: trustedHtml } });
```
