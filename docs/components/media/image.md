# Image

Enhanced image component with lazy loading, placeholder, and fallback.

## Import

```typescript
import { Image } from '@liquidjs/image';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | -- | Image source URL |
| `alt` | `string` | `''` | Alt text |
| `width` | `string \| number` | `undefined` | Width (CSS value or number) |
| `height` | `string \| number` | `undefined` | Height (CSS value or number) |
| `fallback` | `string \| unknown` | `undefined` | Fallback URL or element shown on error |
| `placeholder` | `'blur' \| 'skeleton' \| unknown` | `undefined` | Placeholder shown while loading |
| `lazy` | `boolean` | `true` | Enable lazy loading |
| `objectFit` | `string` | `undefined` | CSS object-fit value |
| `borderRadius` | `string` | `undefined` | CSS border-radius value |
| `caption` | `string` | `undefined` | Caption text rendered below the image |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { Image } from '@liquidjs/image';

function App() {
  return createElement('div', { style: { display: 'flex', gap: '16px' } },
    // With skeleton placeholder and fallback
    createElement(Image, {
      src: '/photos/hero.jpg',
      alt: 'Hero image',
      width: 400,
      height: 300,
      placeholder: 'skeleton',
      fallback: '/photos/fallback.jpg',
      objectFit: 'cover',
      borderRadius: '8px',
    }),
    // With caption
    createElement(Image, {
      src: '/photos/landscape.jpg',
      alt: 'Mountain landscape',
      width: 300,
      caption: 'Photo by John Doe',
    }),
  );
}
```

## Features

- Three loading states: loading, loaded, error
- Skeleton placeholder with shimmer animation while loading
- Blur placeholder with gray blurred background while loading
- Custom placeholder element support
- Fallback image URL or custom element on error
- Native lazy loading via `loading="lazy"` attribute (enabled by default)
- Configurable `object-fit` and `border-radius`
- Optional caption rendered as a `<figcaption>` inside a `<figure>`
- Status resets when `src` prop changes

## Accessibility

- `alt` attribute always set (defaults to empty string)
- Caption uses semantic `<figure>` and `<figcaption>` elements
