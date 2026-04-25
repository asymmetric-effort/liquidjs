import { createElement } from 'liquidjs';

export function HomeScreen() {
  return createElement('div', null,
    // Hero
    createElement('div', { className: 'hero' },
      createElement('h1', null,
        createElement('span', null, 'Liquid'),
        'JS',
      ),
      createElement('p', null,
        'A declarative TypeScript UI framework built for performance, browser compatibility, and developer simplicity.',
      ),
      createElement('div', { className: 'hero-stats' },
        statItem('4KB', 'Core (gzipped)'),
        statItem('0', 'Dependencies'),
        statItem('98%+', 'Test Coverage'),
        statItem('15+', 'Hooks'),
      ),
    ),

    // Features
    createElement('div', { className: 'section' },
      createElement('h2', null, 'Features'),
      createElement('div', { className: 'features-grid' },
        featureCard('Concurrent Rendering',
          'Lane-based priority system with time-slicing. useTransition and useDeferredValue for responsive UIs.'),
        featureCard('Full Hooks API',
          'useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, and more.'),
        featureCard('Build-Time Pre-rendering',
          'Generate static HTML during builds with renderToString. LiquidJS is a browser-side SPA framework — dynamic content is fetched client-side via HTTPS.'),
        featureCard('Hash-Based Router',
          'Built-in SPA routing with Router, Route, Link, useParams, and useNavigate. No server configuration required.'),
        featureCard('Hydration',
          'hydrateRoot reuses existing pre-rendered DOM nodes — no flash of re-rendered content.'),
        featureCard('Zero Dependencies',
          'Every algorithm implemented from scratch. No runtime dependencies. 4KB gzipped core.'),
      ),
    ),

    // Getting Started
    createElement('div', { className: 'section' },
      createElement('h2', null, 'Getting Started'),
      createElement('pre', { className: 'code-block' },
        `import { createElement, useState } from 'liquidjs';
import { createRoot } from 'liquidjs/dom';

function Counter() {
  const [count, setCount] = useState(0);
  return createElement('button',
    { onClick: () => setCount(c => c + 1) },
    \`Clicks: \${count}\`
  );
}

createRoot(document.getElementById('root'))
  .render(createElement(Counter, null));`,
      ),
    ),
  );
}

function statItem(value: string, label: string) {
  return createElement('div', { className: 'hero-stat' },
    createElement('div', { className: 'hero-stat-value' }, value),
    createElement('div', { className: 'hero-stat-label' }, label),
  );
}

function featureCard(title: string, description: string) {
  return createElement('div', { className: 'feature-card' },
    createElement('h3', null, title),
    createElement('p', null, description),
  );
}
