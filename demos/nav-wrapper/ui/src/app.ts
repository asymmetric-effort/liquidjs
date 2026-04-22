import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { NavWrapper, buildNavItemStyle, useHover } from '../../../../components/nav/wrapper/src/index';
import type { NavOrientation } from '../../../../components/nav/wrapper/src/index';

function NavItem(props: { label: string; active: boolean; onClick: () => void }) {
  const { hover, onMouseEnter, onMouseLeave } = useHover();
  const style = buildNavItemStyle({}, { hover, active: props.active });

  return createElement(
    'button',
    {
      type: 'button',
      style,
      onClick: props.onClick,
      onMouseEnter,
      onMouseLeave,
    },
    props.label,
  );
}

function App() {
  const [orientation, setOrientation] = useState<NavOrientation>('vertical');
  const [activeItem, setActiveItem] = useState('home');

  const items = ['Home', 'About', 'Services', 'Contact'];

  const toggleOrientation = useCallback(() => {
    setOrientation((prev: NavOrientation) =>
      prev === 'vertical' ? 'horizontal' : 'vertical',
    );
  }, []);

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'NavWrapper Demo'),
    createElement(
      'button',
      {
        onClick: toggleOrientation,
        style: {
          marginBottom: '20px',
          padding: '8px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: '#f9fafb',
        },
      },
      `Orientation: ${orientation}`,
    ),
    createElement(
      NavWrapper,
      {
        orientation,
        ariaLabel: 'Main navigation',
        styling: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: orientation === 'vertical' ? '240px' : 'auto',
        },
      },
      ...items.map((label) =>
        createElement(NavItem, {
          key: label.toLowerCase(),
          label,
          active: activeItem === label.toLowerCase(),
          onClick: () => setActiveItem(label.toLowerCase()),
        }),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
