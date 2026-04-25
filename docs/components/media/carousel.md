# Carousel

Image/content carousel slider with arrows, dots, auto-play, and touch support.

## Import

```typescript
import { Carousel } from '@specifyjs/carousel';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CarouselItem[]` | -- | Carousel items |
| `autoPlay` | `boolean` | `false` | Enable auto-advance |
| `interval` | `number` | `5000` | Auto-advance interval in ms |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `showArrows` | `boolean` | `true` | Show prev/next arrows |
| `loop` | `boolean` | `true` | Loop from last to first |
| `animation` | `'slide' \| 'fade'` | `'slide'` | Transition animation type |
| `onChange` | `(index: number) => void` | `undefined` | Called when the active index changes |

### CarouselItem

| Prop | Type | Description |
|------|------|-------------|
| `content` | `unknown` | Slide content element |
| `caption` | `string` | Optional caption text below the content |

## Usage

```typescript
import { createElement } from 'specifyjs';
import { Carousel } from '@specifyjs/carousel';

function App() {
  const items = [
    { content: createElement('img', { src: '/slide1.jpg', style: { width: '100%' } }), caption: 'First slide' },
    { content: createElement('img', { src: '/slide2.jpg', style: { width: '100%' } }), caption: 'Second slide' },
    { content: createElement('img', { src: '/slide3.jpg', style: { width: '100%' } }) },
  ];

  return createElement(Carousel, {
    items,
    autoPlay: true,
    interval: 4000,
    animation: 'slide',
    loop: true,
  });
}
```

## Features

- Slide and fade animation modes
- Auto-play with configurable interval
- Previous/next arrow buttons
- Dot indicators for direct slide navigation
- Loop mode wrapping from last to first slide and vice versa
- Keyboard navigation: Left/Right arrow keys
- Touch/pointer swipe support (50px threshold)
- Optional captions per slide
- CSS transform-based slide animation with 400ms ease transition

## Accessibility

- Container uses `role="region"` with `aria-label="Carousel"`
- Container is focusable (`tabindex="0"`) for keyboard navigation
- Arrow buttons include `aria-label` ("Previous slide" / "Next slide")
- Dot buttons include `aria-label` ("Go to slide N")
