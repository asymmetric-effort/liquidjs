import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Tooltip } from '../../../../components/overlay/tooltip/src/index';
import type { TooltipPlacement } from '../../../../components/overlay/tooltip/src/index';

function TooltipDemo() {
  const [placement, setPlacement] = useState<TooltipPlacement>('top');

  const placements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right'];

  return createElement(
    'div',
    { className: 'demo' },

    createElement('h1', null, 'Tooltip Component Demo'),

    // Basic tooltip
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Basic Tooltip'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
        createElement(
          Tooltip,
          { text: 'This is a helpful tooltip' },
          createElement('button', { className: 'btn' }, 'Hover me'),
        ),
        createElement(
          Tooltip,
          { text: 'Another tooltip on a different element' },
          createElement('span', { className: 'badge' }, 'Info'),
        ),
      ),
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
        createElement(
          Tooltip,
          { text: `Placement: ${placement}`, placement },
          createElement('button', { className: 'btn btn-primary' }, 'Hover for Tooltip'),
        ),
      ),
    ),

    // Custom delay
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Custom Delay'),
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px' } },
        createElement(
          Tooltip,
          { text: 'Instant tooltip', delay: 0 },
          createElement('button', { className: 'btn' }, 'No Delay'),
        ),
        createElement(
          Tooltip,
          { text: 'Default 200ms delay' },
          createElement('button', { className: 'btn' }, 'Default Delay'),
        ),
        createElement(
          Tooltip,
          { text: 'Slow tooltip', delay: 800 },
          createElement('button', { className: 'btn' }, '800ms Delay'),
        ),
      ),
    ),

    // Long text / max width
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Long Text with Max Width'),
      createElement(
        Tooltip,
        {
          text: 'This is a much longer tooltip message that demonstrates how the component handles wrapping with a constrained max width.',
          maxWidth: '200px',
        },
        createElement('button', { className: 'btn' }, 'Hover for Long Tooltip'),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(TooltipDemo, null));
