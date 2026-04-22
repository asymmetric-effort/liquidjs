import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Modal } from '../../../../components/overlay/modal/src/index';
import type { ModalSize } from '../../../../components/overlay/modal/src/index';

function ModalDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [noCloseOpen, setNoCloseOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState<ModalSize>('md');

  const sizes: ModalSize[] = ['sm', 'md', 'lg', 'full'];

  return createElement(
    'div',
    { className: 'demo' },

    createElement('h1', null, 'Modal Component Demo'),

    // Basic modal
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Basic Modal'),
      createElement(
        'button',
        { className: 'btn', onClick: () => setBasicOpen(true) },
        'Open Basic Modal',
      ),
      createElement(Modal, {
        open: basicOpen,
        onClose: () => setBasicOpen(false),
        title: 'Basic Modal',
        children: createElement(
          'div',
          null,
          createElement('p', null, 'This is a basic modal with a title and close button.'),
          createElement('p', null, 'Click the X, press Escape, or click outside to close.'),
        ),
      }),
    ),

    // Size variants
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Size Variants'),
      createElement(
        'div',
        { className: 'btn-group' },
        ...sizes.map((size) =>
          createElement(
            'button',
            {
              key: size,
              className: `btn ${currentSize === size ? 'btn-active' : ''}`,
              onClick: () => {
                setCurrentSize(size);
                setSizeOpen(true);
              },
            },
            size.toUpperCase(),
          ),
        ),
      ),
      createElement(Modal, {
        open: sizeOpen,
        onClose: () => setSizeOpen(false),
        title: `${currentSize.toUpperCase()} Modal`,
        size: currentSize,
        children: createElement('p', null, `This modal uses the "${currentSize}" size preset.`),
      }),
    ),

    // No overlay close / no escape
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Restricted Close'),
      createElement(
        'button',
        { className: 'btn', onClick: () => setNoCloseOpen(true) },
        'Open (No Overlay/Escape Close)',
      ),
      createElement(Modal, {
        open: noCloseOpen,
        onClose: () => setNoCloseOpen(false),
        title: 'Restricted Modal',
        closeOnOverlay: false,
        closeOnEscape: false,
        children: createElement('p', null, 'You can only close this modal using the X button.'),
      }),
    ),

    // With footer
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Modal with Footer'),
      createElement(
        'button',
        { className: 'btn', onClick: () => setFooterOpen(true) },
        'Open with Footer',
      ),
      createElement(Modal, {
        open: footerOpen,
        onClose: () => setFooterOpen(false),
        title: 'Confirm Action',
        footer: createElement(
          'div',
          { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' } },
          createElement(
            'button',
            {
              className: 'btn',
              onClick: () => setFooterOpen(false),
            },
            'Cancel',
          ),
          createElement(
            'button',
            {
              className: 'btn btn-primary',
              onClick: () => setFooterOpen(false),
            },
            'Confirm',
          ),
        ),
        children: createElement('p', null, 'Are you sure you want to proceed?'),
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(ModalDemo, null));
