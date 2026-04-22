# VideoPlayer

Video player wrapper with optional custom controls overlay.

## Import

```typescript
import { VideoPlayer } from '@liquidjs/video-player';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | -- | Video source URL |
| `poster` | `string` | `undefined` | Poster image URL |
| `width` | `string \| number` | `'100%'` | Width (CSS value or number) |
| `height` | `string \| number` | `'auto'` | Height (CSS value or number) |
| `autoPlay` | `boolean` | `false` | Auto-play video |
| `loop` | `boolean` | `false` | Loop playback |
| `muted` | `boolean` | `false` | Muted |
| `controls` | `boolean` | `true` | Show custom controls (falls back to native when false) |
| `onPlay` | `() => void` | `undefined` | Play callback |
| `onPause` | `() => void` | `undefined` | Pause callback |
| `onEnded` | `() => void` | `undefined` | Ended callback |
| `onTimeUpdate` | `(currentTime: number, duration: number) => void` | `undefined` | Time update callback |

## Usage

```typescript
import { createElement } from 'liquidjs';
import { VideoPlayer } from '@liquidjs/video-player';

function App() {
  return createElement(VideoPlayer, {
    src: '/videos/demo.mp4',
    poster: '/videos/poster.jpg',
    width: 800,
    height: 450,
    controls: true,
    onEnded: () => console.log('Video ended'),
  });
}
```

## Features

- Custom controls overlay: play/pause, seekable progress bar, time display, volume slider, fullscreen button
- Falls back to native browser controls when `controls` is set to `false`
- Auto-hiding control bar that shows on mouse enter and hides during playback on mouse leave
- Clickable video area to toggle play/pause
- Seekable progress bar with click-to-seek
- Volume slider (range input from 0 to 1)
- Time display in `M:SS / M:SS` format
- Fullscreen button via the Fullscreen API
- Gradient overlay background on the control bar for readability
- Event callbacks for play, pause, ended, and time updates

## Accessibility

- Play/pause button includes `aria-label` ("Play" / "Pause")
- Volume slider includes `aria-label="Volume"`
- Fullscreen button includes `aria-label="Fullscreen"`
- Uses `playsinline` attribute for mobile compatibility
