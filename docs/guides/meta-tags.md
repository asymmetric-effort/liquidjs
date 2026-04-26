# Meta Tags

The `useHead` hook lets components declaratively manage document `<head>` meta tags. Tags are applied when the component mounts and cleaned up when it unmounts, preventing stale metadata from persisting across route changes.

## useHead Hook API

```typescript
import { useHead } from 'specifyjs/hooks';

function AboutPage() {
  useHead({
    title: 'About Us',
    description: 'Learn about our team and mission.',
    keywords: 'about, team, company',
    author: 'SpecifyJS Team',
  });

  return createElement('h1', null, 'About Us');
}
```

### Options

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Sets `document.title`. |
| `description` | `string` | Sets `<meta name="description">`. |
| `keywords` | `string` | Sets `<meta name="keywords">` (comma-separated). |
| `author` | `string` | Sets `<meta name="author">`. |
| `canonical` | `string` | Adds a `<link rel="canonical">` element. |
| `og` | `Record<string, string>` | Open Graph `<meta property="og:*">` tags. |
| `twitter` | `Record<string, string>` | Twitter Card `<meta name="twitter:*">` tags. |
| `httpEquiv` | `HeadHttpEquiv` | HTTP-equiv meta tags. |
| `meta` | `Array<{ name?, property?, content }>` | Arbitrary meta tags. |

## Setting Title, Description, Keywords, Author

Each property maps to a standard HTML meta tag:

```typescript
useHead({
  title: 'Product Page - MyApp',
  description: 'Browse our product catalog with free shipping.',
  keywords: 'products, catalog, shopping',
  author: 'MyApp Inc.',
  canonical: 'https://myapp.com/products',
});
```

## Open Graph Tags

Open Graph tags control how your page appears when shared on social media:

```typescript
useHead({
  title: 'Blog Post Title',
  og: {
    title: 'Blog Post Title',
    description: 'A summary of the blog post.',
    image: 'https://myapp.com/images/post-og.png',
    url: 'https://myapp.com/blog/post-slug',
    type: 'article',
    site_name: 'MyApp Blog',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myapp',
    title: 'Blog Post Title',
    image: 'https://myapp.com/images/post-og.png',
  },
});
```

Each key in the `og` object becomes `<meta property="og:key" content="value">`. Each key in the `twitter` object becomes `<meta name="twitter:key" content="value">`.

## HTTP-equiv Meta Tags

HTTP-equiv meta tags set browser-level policies. The `httpEquiv` option provides named shortcuts for common security headers:

```typescript
useHead({
  httpEquiv: {
    csp: "default-src 'self'; script-src 'self'",
    referrer: 'strict-origin-when-cross-origin',
    contentType: 'nosniff',
    cacheControl: 'no-cache, no-store, must-revalidate',
  },
});
```

### Named Shortcuts

| Key | HTTP-equiv header |
|-----|-------------------|
| `csp` | `Content-Security-Policy` |
| `referrer` | `Referrer-Policy` |
| `contentType` | `X-Content-Type-Options` |
| `frameOptions` | `X-Frame-Options` |
| `cacheControl` | `Cache-Control` |

You can also pass arbitrary http-equiv names as keys:

```typescript
useHead({
  httpEquiv: {
    'X-Custom-Header': 'custom-value',
  },
});
```

## Cleanup on Unmount

When the component calling `useHead` unmounts, all meta tags it created are removed. Tags that existed before the component mounted have their previous values restored. This automatic cleanup prevents stale meta tags from accumulating as users navigate between routes:

```typescript
function ProductPage(props: { product: Product }) {
  // These tags are set on mount and removed on unmount
  useHead({
    title: `${props.product.name} - Shop`,
    description: props.product.summary,
    og: {
      title: props.product.name,
      image: props.product.imageUrl,
    },
  });

  return createElement('div', null,
    createElement('h1', null, props.product.name),
    createElement('p', null, props.product.summary),
  );
}
```

The dependency array includes all head properties, so if props change (e.g., navigating to a different product), the tags are updated accordingly.
