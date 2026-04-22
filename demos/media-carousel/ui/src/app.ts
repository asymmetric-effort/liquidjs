import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Carousel } from '../../../../components/media/carousel/src/index';

function makeSlide(color: string, label: string) {
  return createElement('div', {
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '300px', backgroundColor: color, color: '#fff',
      fontSize: '24px', fontWeight: '600', borderRadius: '8px',
    },
  }, label);
}

const slides = [
  { content: makeSlide('#3b82f6', 'Slide 1 - Blue'), caption: 'First slide' },
  { content: makeSlide('#ef4444', 'Slide 2 - Red'), caption: 'Second slide' },
  { content: makeSlide('#22c55e', 'Slide 3 - Green'), caption: 'Third slide' },
  { content: makeSlide('#f59e0b', 'Slide 4 - Amber'), caption: 'Fourth slide' },
  { content: makeSlide('#8b5cf6', 'Slide 5 - Purple'), caption: 'Fifth slide' },
];

function Demo() {
  const [autoPlay, setAutoPlay] = useState(false);
  const [animation, setAnimation] = useState<'slide' | 'fade'>('slide');
  const [currentIndex, setCurrentIndex] = useState(0);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Carousel Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Carousel'),
      createElement(
        'div',
        { className: 'controls' },
        createElement('label', null,
          createElement('input', { type: 'checkbox', checked: autoPlay, onChange: () => setAutoPlay((a: boolean) => !a) }),
          ' Auto-play',
        ),
        createElement('button', { onClick: () => setAnimation('slide'), style: { fontWeight: animation === 'slide' ? '700' : '400' } }, 'Slide'),
        createElement('button', { onClick: () => setAnimation('fade'), style: { fontWeight: animation === 'fade' ? '700' : '400' } }, 'Fade'),
        createElement('span', null, `Current: ${currentIndex + 1} / ${slides.length}`),
      ),
      createElement(Carousel, {
        items: slides,
        autoPlay,
        interval: 3000,
        animation,
        onChange: (index: number) => setCurrentIndex(index),
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Without Arrows'),
      createElement(Carousel, { items: slides.slice(0, 3), showArrows: false }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Without Dots'),
      createElement(Carousel, { items: slides.slice(0, 3), showDots: false }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Non-looping'),
      createElement(Carousel, { items: slides.slice(0, 3), loop: false }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
