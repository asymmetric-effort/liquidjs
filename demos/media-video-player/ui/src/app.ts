import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { VideoPlayer } from '../../../../components/media/video-player/src/index';

function Demo() {
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = (name: string) => {
    setEvents((prev: string[]) => [...prev.slice(-9), `${new Date().toLocaleTimeString()} - ${name}`]);
  };

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'VideoPlayer Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Custom Controls (default)'),
      createElement(VideoPlayer, {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        width: '100%',
        height: 400,
        onPlay: () => logEvent('play'),
        onPause: () => logEvent('pause'),
        onEnded: () => logEvent('ended'),
        onTimeUpdate: (time: number, dur: number) => {
          if (Math.floor(time) % 5 === 0 && time > 0) {
            logEvent(`time: ${Math.floor(time)}s / ${Math.floor(dur)}s`);
          }
        },
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Event Log'),
      createElement(
        'div',
        { style: { fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.8', color: '#6b7280' } },
        events.length === 0
          ? 'Play the video to see events...'
          : events.map((e, i) => createElement('div', { key: String(i) }, e)),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Native Controls'),
      createElement(VideoPlayer, {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        controls: false,
        width: '100%',
        height: 300,
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Muted + Loop'),
      createElement(VideoPlayer, {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        muted: true,
        loop: true,
        width: '100%',
        height: 250,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
