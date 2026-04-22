import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Skeleton } from '../../../../components/feedback/skeleton/src/index';

function Demo() {
  const [animated, setAnimated] = useState(true);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'Skeleton Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Controls'),
      createElement('label', null,
        createElement('input', { type: 'checkbox', checked: animated, onChange: () => setAnimated((a: boolean) => !a) }),
        ' Animated',
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Text Skeleton'),
      createElement(Skeleton, { variant: 'text', lines: 1, animated }),
      createElement('div', { style: { height: '16px' } }),
      createElement(Skeleton, { variant: 'text', lines: 3, animated }),
      createElement('div', { style: { height: '16px' } }),
      createElement(Skeleton, { variant: 'text', lines: 5, animated }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Circular Skeleton'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
        createElement(Skeleton, { variant: 'circular', width: 32, animated }),
        createElement(Skeleton, { variant: 'circular', width: 48, animated }),
        createElement(Skeleton, { variant: 'circular', width: 64, animated }),
      ),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Rectangular Skeleton'),
      createElement(Skeleton, { variant: 'rectangular', width: '100%', height: 120, animated, borderRadius: '8px' }),
      createElement('div', { style: { height: '12px' } }),
      createElement(Skeleton, { variant: 'rectangular', width: '60%', height: 80, animated, borderRadius: '8px' }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Card Loading Pattern'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '12px', alignItems: 'flex-start' } },
        createElement(Skeleton, { variant: 'circular', width: 48, animated }),
        createElement(
          'div',
          { style: { flex: '1' } },
          createElement(Skeleton, { variant: 'text', lines: 1, width: '40%', animated }),
          createElement('div', { style: { height: '8px' } }),
          createElement(Skeleton, { variant: 'text', lines: 2, animated }),
        ),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
