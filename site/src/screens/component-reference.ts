import { createElement } from 'liquidjs';
import { useState } from 'liquidjs/hooks';

interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  api: string[];
}

const COMPONENTS: ComponentInfo[] = [
  // Core
  { name: 'createElement', category: 'Core', description: 'Creates a virtual DOM element.', api: ['type', 'props', '...children'] },
  { name: 'Fragment', category: 'Core', description: 'Groups children without adding a DOM node.', api: ['children'] },
  { name: 'Component', category: 'Core', description: 'Base class for class components.', api: ['render()', 'setState()', 'componentDidMount()'] },
  { name: 'ErrorBoundary', category: 'Core', description: 'Catches render errors in child tree.', api: ['fallback', 'onError', 'children'] },
  { name: 'memo', category: 'Core', description: 'Memoizes a component — skips re-render if props are shallow-equal.', api: ['component', 'compare?'] },
  { name: 'forwardRef', category: 'Core', description: 'Forwards ref through a component.', api: ['render(props, ref)'] },
  { name: 'lazy', category: 'Core', description: 'Code-splitting via dynamic import.', api: ['() => import(...)'] },

  // Hooks
  { name: 'useState', category: 'Hooks', description: 'Adds local state to function components.', api: ['initialState → [state, setState]'] },
  { name: 'useEffect', category: 'Hooks', description: 'Runs side effects after render.', api: ['effect, deps?'] },
  { name: 'useContext', category: 'Hooks', description: 'Reads a context value.', api: ['context → value'] },
  { name: 'useReducer', category: 'Hooks', description: 'State management with a reducer function.', api: ['reducer, initialArg, init?'] },
  { name: 'useMemo', category: 'Hooks', description: 'Memoizes a computed value.', api: ['factory, deps'] },
  { name: 'useCallback', category: 'Hooks', description: 'Memoizes a function reference.', api: ['callback, deps'] },
  { name: 'useRef', category: 'Hooks', description: 'Holds a mutable value across renders.', api: ['initialValue? → { current }'] },
  { name: 'useTransition', category: 'Hooks', description: 'Marks state updates as non-urgent transitions.', api: ['→ [isPending, startTransition]'] },
  { name: 'useDeferredValue', category: 'Hooks', description: 'Returns a deferred copy of a value.', api: ['value → deferredValue'] },
  { name: 'useId', category: 'Hooks', description: 'Generates a unique ID stable across renders.', api: ['→ id'] },

  // Router
  { name: 'Router', category: 'Router', description: 'Top-level routing provider. Subscribes to hash changes.', api: ['children'] },
  { name: 'Route', category: 'Router', description: 'Renders children when path matches.', api: ['path', 'component?', 'exact?', 'children?'] },
  { name: 'Link', category: 'Router', description: 'Navigation anchor with hash-based routing.', api: ['to', 'className?', 'activeClassName?'] },
  { name: 'useRouter', category: 'Router', description: 'Returns full router context.', api: ['→ { pathname, params, navigate }'] },
  { name: 'useParams', category: 'Router', description: 'Returns matched route parameters.', api: ['→ Record<string, string>'] },
  { name: 'useNavigate', category: 'Router', description: 'Returns the navigate function.', api: ['→ (to, options?) => void'] },

  // DOM
  { name: 'createRoot', category: 'DOM', description: 'Creates a concurrent rendering root.', api: ['container → { render, unmount }'] },
  { name: 'hydrateRoot', category: 'DOM', description: 'Hydrates server-rendered HTML — reuses existing DOM.', api: ['container, element'] },
  { name: 'flushSync', category: 'DOM', description: 'Forces synchronous rendering.', api: ['callback → result'] },
  { name: 'createPortal', category: 'DOM', description: 'Renders children into a different DOM node.', api: ['children, container'] },

  // Server
  { name: 'renderToString', category: 'Server', description: 'Renders to an HTML string.', api: ['element → string'] },
  { name: 'renderToPipeableStream', category: 'Server', description: 'Renders to a Node.js pipeable stream with chunked output.', api: ['element, options? → { pipe, abort }'] },
  { name: 'renderToReadableStream', category: 'Server', description: 'Renders to a Web ReadableStream.', api: ['element, options? → Promise<ReadableStream>'] },
];

export function ComponentReference() {
  const categories = [...new Set(COMPONENTS.map(c => c.category))];
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = COMPONENTS.filter(c => {
    const matchesFilter = !filter || c.name.toLowerCase().includes(filter.toLowerCase()) || c.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesFilter && matchesCategory;
  });

  const tabStyle = (isActive: boolean) => ({
    padding: '6px 12px',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '400',
    backgroundColor: isActive ? '#3b82f6' : '#f1f5f9',
    color: isActive ? 'white' : '#64748b',
    transition: 'background 0.15s',
  });

  return createElement('div', null,
    createElement('div', { className: 'section' },
      createElement('h2', null, 'Component Reference'),
      createElement('p', { style: { color: '#64748b', marginBottom: '24px' } },
        `${COMPONENTS.length} APIs across ${categories.length} categories.`,
      ),

      // Search
      createElement('input', {
        type: 'text', value: filter, placeholder: 'Search APIs...',
        onInput: (e: Event) => setFilter((e.target as HTMLInputElement).value),
        style: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '100%', marginBottom: '16px', outline: 'none' },
      }),

      // Category pills
      createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' } },
        createElement('button', { style: tabStyle(activeCategory === 'All'), onClick: () => setActiveCategory('All') }, `All (${COMPONENTS.length})`),
        ...categories.map(cat =>
          createElement('button', {
            key: cat,
            style: tabStyle(activeCategory === cat),
            onClick: () => setActiveCategory(cat),
          }, `${cat} (${COMPONENTS.filter(c => c.category === cat).length})`),
        ),
      ),

      // Results
      createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        ...filtered.map(comp =>
          createElement('div', {
            key: comp.name,
            style: {
              padding: '14px 18px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              transition: 'box-shadow 0.15s',
            },
          },
            createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' } },
              createElement('span', { style: { fontWeight: '600', fontSize: '15px', fontFamily: 'monospace' } }, comp.name),
              createElement('span', {
                style: {
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: categoryColor(comp.category),
                  color: 'white',
                },
              }, comp.category),
            ),
            createElement('p', { style: { fontSize: '13px', color: '#64748b', marginBottom: '6px' } }, comp.description),
            createElement('code', { style: { fontSize: '12px', color: '#6366f1', background: '#f5f3ff', padding: '2px 6px', borderRadius: '4px' } },
              comp.api.join(', '),
            ),
          ),
        ),
        filtered.length === 0
          ? createElement('p', { style: { textAlign: 'center', color: '#94a3b8', padding: '24px' } }, 'No matching APIs found.')
          : null,
      ),
    ),
  );
}

function categoryColor(cat: string): string {
  switch (cat) {
    case 'Core': return '#6366f1';
    case 'Hooks': return '#3b82f6';
    case 'Router': return '#8b5cf6';
    case 'DOM': return '#f59e0b';
    case 'Server': return '#10b981';
    default: return '#94a3b8';
  }
}
