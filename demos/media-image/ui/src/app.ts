import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Image } from '../../../../components/media/image/src/index';

function Demo() {
  const [useBroken, setUseBroken] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Image Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Basic Image'),
      createElement(Image, {
        src: 'https://picsum.photos/400/250',
        alt: 'Random photo',
        width: 400,
        height: 250,
        borderRadius: '8px',
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'With Caption'),
      createElement(Image, {
        src: 'https://picsum.photos/seed/landscape/500/300',
        alt: 'Landscape',
        width: 500,
        height: 300,
        objectFit: 'cover',
        borderRadius: '12px',
        caption: 'A beautiful landscape photograph',
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Placeholder Types'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px', flexWrap: 'wrap' } },
        createElement(
          'div',
          null,
          createElement('h3', null, 'Skeleton'),
          createElement(Image, { src: 'https://picsum.photos/seed/a/200/150', alt: 'Skeleton placeholder', width: 200, height: 150, placeholder: 'skeleton', borderRadius: '8px' }),
        ),
        createElement(
          'div',
          null,
          createElement('h3', null, 'Blur'),
          createElement(Image, { src: 'https://picsum.photos/seed/b/200/150', alt: 'Blur placeholder', width: 200, height: 150, placeholder: 'blur', borderRadius: '8px' }),
        ),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Fallback on Error'),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: useBroken, onChange: () => setUseBroken((b: boolean) => !b) }),
        ' Use broken URL',
      ),
      createElement('div', { style: { marginTop: '12px' } }),
      createElement(Image, {
        src: useBroken ? 'https://invalid-url-that-will-fail.example/img.jpg' : 'https://picsum.photos/seed/fallback/300/200',
        alt: 'Fallback test',
        width: 300,
        height: 200,
        fallback: 'https://picsum.photos/seed/fallback-alt/300/200',
        borderRadius: '8px',
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Lazy Loading (default)'),
      createElement(Image, {
        src: 'https://picsum.photos/seed/lazy/600/400',
        alt: 'Lazy loaded image',
        width: '100%',
        height: 300,
        objectFit: 'cover',
        borderRadius: '8px',
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
