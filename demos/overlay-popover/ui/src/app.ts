import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Popover } from '../../../../components/overlay/popover/src/index';
import type { PopoverPlacement } from '../../../../components/overlay/popover/src/index';

function PopoverDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [placement, setPlacement] = useState<PopoverPlacement>('bottom');

  const placements: PopoverPlacement[] = ['top', 'bottom', 'left', 'right'];

  return createElement(
    'div',
    { className: 'demo' },

    createElement('h1', null, 'Popover Component Demo'),

    // Basic uncontrolled popover
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Basic Popover (Uncontrolled)'),
      createElement(Popover, {
        trigger: createElement('button', { className: 'btn' }, 'Click to Toggle'),
        content: createElement(
          'div',
          null,
          createElement('strong', null, 'Popover Title'),
          createElement('p', { style: { marginTop: '4px', fontSize: '13px', color: '#6b7280' } }, 'This popover toggles on click.'),
        ),
      }),
    ),

    // Controlled popover
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Controlled Popover'),
      createElement(
        'div',
        { className: 'btn-group', style: { marginBottom: '16px' } },
        createElement(
          'button',
          { className: 'btn', onClick: () => setControlledOpen(true) },
          'Open',
        ),
        createElement(
          'button',
          { className: 'btn', onClick: () => setControlledOpen(false) },
          'Close',
        ),
      ),
      createElement(Popover, {
        trigger: createElement('button', { className: 'btn btn-primary' }, 'Controlled Target'),
        content: createElement('p', null, 'This popover is externally controlled.'),
        open: controlledOpen,
        onOpenChange: (open: boolean) => setControlledOpen(open),
      }),
    ),

    // Placement variants
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Placement Variants'),
      createElement(
        'div',
        { className: 'btn-group', style: { marginBottom: '16px' } },
        ...placements.map((p) =>
          createElement(
            'button',
            {
              key: p,
              className: `btn ${placement === p ? 'btn-active' : ''}`,
              onClick: () => setPlacement(p),
            },
            p.charAt(0).toUpperCase() + p.slice(1),
          ),
        ),
      ),
      createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center', padding: '60px 0' } },
        createElement(Popover, {
          trigger: createElement('button', { className: 'btn' }, 'Hover Target'),
          content: createElement('span', null, `Placement: ${placement}`),
          placement,
          open: true,
          arrow: true,
        }),
      ),
    ),

    // With arrow
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'With Arrow'),
      createElement(Popover, {
        trigger: createElement('button', { className: 'btn' }, 'Click Me'),
        content: createElement('span', null, 'Arrow points to the trigger'),
        arrow: true,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(PopoverDemo, null));
