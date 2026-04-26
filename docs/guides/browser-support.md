# Browser Support

SpecifyJS targets modern browsers with ES2020+ support. The framework has zero runtime dependencies, so browser compatibility is determined solely by the JavaScript and DOM APIs it uses.

## Supported Browsers

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome / Chromium | Last 2 major versions | Fully supported |
| Firefox | Last 2 major versions | Fully supported |
| Safari | Last 2 major versions | Fully supported |
| Edge (Chromium) | Last 2 major versions | Fully supported |
| iOS Safari | 15+ | Fully supported |
| Chrome for Android | Last 2 major versions | Fully supported |

Older browsers (Internet Explorer, legacy Edge, Safari < 15) are not supported.

## Required Browser APIs

SpecifyJS relies on the following APIs that are available in all supported browsers:

- **ES2020 features** -- `Promise`, `Map`, `Set`, `WeakMap`, `WeakSet`, `Symbol`, optional chaining, nullish coalescing, `globalThis`
- **DOM APIs** -- `document.createElement`, `MutationObserver`, `requestAnimationFrame`, `queueMicrotask`
- **Fetch API** -- Used by feature flag loading and recommended for data fetching
- **URL / URLSearchParams** -- Used by the router for query string parsing
- **structuredClone** -- Used in some utilities (Chrome 98+, Firefox 94+, Safari 15.4+)

## Polyfill Recommendations

If you need to support slightly older browser versions, the following polyfills can extend compatibility:

| API | Polyfill | When Needed |
|-----|----------|-------------|
| `structuredClone` | `core-js/actual/structured-clone` | Safari < 15.4 |
| `queueMicrotask` | `core-js/actual/queue-microtask` | Very old browsers only |
| `fetch` | `whatwg-fetch` | Only if targeting legacy environments |

Add polyfills at the entry point of your application, before importing SpecifyJS:

```typescript
import 'core-js/actual/structured-clone';
import { createElement } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';
```

In most cases, no polyfills are needed if you target the browser versions listed above.

## Platform Support

| Platform | Architecture | Status |
|----------|-------------|--------|
| Linux | AMD64 | First-class (CI runs here) |
| Linux | ARM64 | Planned |
| macOS | Intel / Apple Silicon | Planned |
| Windows | x64 | Planned |

Development and CI are currently validated on Linux AMD64. The framework itself is pure JavaScript and runs identically on all platforms, but build tooling and E2E tests are validated on Linux first.
