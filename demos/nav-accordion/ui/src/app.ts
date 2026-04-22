import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { Accordion } from '../../../../components/nav/accordion/src/index';
import type { AccordionSection } from '../../../../components/nav/accordion/src/index';

function App() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const sections: AccordionSection[] = [
    {
      id: 'getting-started',
      header: 'Getting Started',
      icon: 'R',
      content: createElement('div', null,
        createElement('p', null, 'Welcome to LiquidJS! Follow these steps to set up your project.'),
        createElement('ol', { style: { paddingLeft: '20px', marginTop: '8px' } },
          createElement('li', null, 'Install dependencies'),
          createElement('li', null, 'Create your first component'),
          createElement('li', null, 'Run the development server'),
        ),
      ),
    },
    {
      id: 'api',
      header: 'API Reference',
      icon: 'A',
      content: createElement('p', null, 'Comprehensive API documentation for all hooks, components, and utilities.'),
    },
    {
      id: 'examples',
      header: 'Examples',
      icon: 'E',
      content: createElement('p', null, 'Browse through interactive examples showing common patterns and best practices.'),
    },
    {
      id: 'disabled',
      header: 'Coming Soon (disabled)',
      disabled: true,
      content: createElement('p', null, 'This section is not yet available.'),
    },
  ];

  const handleChange = useCallback((ids: string[]) => {
    setExpandedIds(ids);
  }, []);

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'Accordion Demo'),
    createElement(
      'label',
      { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' } },
      createElement('input', {
        type: 'checkbox',
        checked: allowMultiple,
        onChange: () => setAllowMultiple((prev: boolean) => !prev),
      }),
      'Allow multiple open',
    ),
    createElement(Accordion, {
      sections,
      allowMultiple,
      onChange: handleChange,
      wrapperStyle: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    }),
    createElement(
      'div',
      { style: { marginTop: '16px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' } },
      createElement('strong', null, 'Expanded: '),
      createElement('span', null, expandedIds.length > 0 ? expandedIds.join(', ') : 'None'),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
