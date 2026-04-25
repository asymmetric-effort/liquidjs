import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Drawer } from '../../../../components/overlay/drawer/src/index';
import type { DrawerPosition } from '../../../../components/overlay/drawer/src/index';

function DrawerDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [posOpen, setPosOpen] = useState(false);
  const [noOverlayOpen, setNoOverlayOpen] = useState(false);
  const [currentPos, setCurrentPos] = useState<DrawerPosition>('right');

  const positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom'];

  return createElement(
    'div',
    { className: 'demo' },

    createElement('h1', null, 'Drawer Component Demo'),

    // Basic drawer
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Basic Drawer'),
      createElement(
        'button',
        { className: 'btn', onClick: () => setBasicOpen(true) },
        'Open Drawer',
      ),
      createElement(Drawer, {
        open: basicOpen,
        onClose: () => setBasicOpen(false),
        title: 'Settings',
        children: createElement(
          'div',
          null,
          createElement('p', null, 'This is a slide-in drawer panel.'),
          createElement('p', { style: { marginTop: '12px' } }, 'Click overlay, press Escape, or use the X to close.'),
        ),
      }),
    ),

    // Position variants
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Position Variants'),
      createElement(
        'div',
        { className: 'btn-group' },
        ...positions.map((pos) =>
          createElement(
            'button',
            {
              key: pos,
              className: `btn ${currentPos === pos ? 'btn-active' : ''}`,
              onClick: () => {
                setCurrentPos(pos);
                setPosOpen(true);
              },
            },
            pos.charAt(0).toUpperCase() + pos.slice(1),
          ),
        ),
      ),
      createElement(Drawer, {
        open: posOpen,
        onClose: () => setPosOpen(false),
        title: `${currentPos.charAt(0).toUpperCase() + currentPos.slice(1)} Drawer`,
        position: currentPos,
        size: currentPos === 'top' || currentPos === 'bottom' ? '250px' : '320px',
        children: createElement('p', null, `This drawer slides in from the ${currentPos}.`),
      }),
    ),

    // No overlay
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Without Overlay'),
      createElement(
        'button',
        { className: 'btn', onClick: () => setNoOverlayOpen(true) },
        'Open (No Overlay)',
      ),
      createElement(Drawer, {
        open: noOverlayOpen,
        onClose: () => setNoOverlayOpen(false),
        title: 'No Overlay Drawer',
        overlay: false,
        children: createElement('p', null, 'This drawer has no backdrop overlay. Press Escape or click the X to close.'),
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(DrawerDemo, null));
