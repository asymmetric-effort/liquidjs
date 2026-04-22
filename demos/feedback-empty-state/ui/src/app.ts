import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { EmptyState } from '../../../../components/feedback/empty-state/src/index';

function Demo() {
  const [showItems, setShowItems] = useState(false);

  return createElement(
    'div',
    { className: 'app' },
    createElement('h1', null, 'EmptyState Demo'),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Basic Empty State'),
      createElement(EmptyState, {
        icon: '\uD83D\uDCED',
        title: 'No messages',
        description: 'Your inbox is empty. New messages will appear here.',
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'With Action Button'),
      createElement(EmptyState, {
        icon: '\uD83D\uDD0D',
        title: 'No results found',
        description: 'Try adjusting your search or filter criteria.',
        action: { label: 'Clear Filters', onClick: () => alert('Filters cleared!') },
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'With Image'),
      createElement(EmptyState, {
        image: 'https://illustrations.popsy.co/gray/falling-rocket.svg',
        title: 'Something went wrong',
        description: 'We encountered an unexpected error. Please try again later.',
        action: { label: 'Retry', onClick: () => location.reload() },
      }),
    ),

    createElement(
      'section',
      { className: 'card' },
      createElement('h2', null, 'Interactive Toggle'),
      createElement('button', {
        onClick: () => setShowItems((s: boolean) => !s),
        style: { marginBottom: '16px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' },
      }, showItems ? 'Clear items' : 'Add items'),
      showItems
        ? createElement('ul', { style: { padding: '16px' } },
            createElement('li', null, 'Item 1'),
            createElement('li', null, 'Item 2'),
            createElement('li', null, 'Item 3'),
          )
        : createElement(EmptyState, {
            icon: '\uD83D\uDCCB',
            title: 'No items yet',
            description: 'Click the button above to add some items.',
          }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(Demo, null));
