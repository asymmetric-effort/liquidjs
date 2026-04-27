// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'specifyjs';
import { useHead } from 'specifyjs/hooks';

export function GettingStarted() {
  useHead({
    title: 'Getting Started — SpecifyJS',
    description: 'Get up and running with SpecifyJS in minutes. Install, Hello World, routing, data fetching, meta tags, and production builds.',
    keywords: 'specifyjs, getting started, tutorial, install, hello world, routing',
    author: 'Asymmetric Effort, LLC',
  });

  return createElement(
    'div',
    null,
    createElement(
      'p',
      { style: { fontSize: '16px', color: '#64748b', marginBottom: '24px', lineHeight: '1.7' } },
      'Get up and running with SpecifyJS in minutes. No build tools required for basic usage — just import and render.',
    ),

    section('Install', createElement('pre', { className: 'code-block' }, 'npm install @asymmetric-effort/specifyjs')),

    section(
      'Hello World',
      createElement(
        'pre',
        { className: 'code-block' },
        `import { createElement, useState } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';

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

    section(
      'Add Routing',
      createElement(
        'pre',
        { className: 'code-block' },
        `import { Router, Route, Link } from 'specifyjs';

function App() {
  return createElement(Router, null,
    createElement('nav', null,
      createElement(Link, { to: '/' }, 'Home'),
      createElement(Link, { to: '/about' }, 'About'),
    ),
    createElement(Route, { path: '/', component: Home, exact: true }),
    createElement(Route, { path: '/about', component: About }),
  );
}`,
      ),
    ),

    section(
      'Fetch Data',
      createElement(
        'pre',
        { className: 'code-block' },
        `import { useState, useEffect } from 'specifyjs';
import { secureFetch } from 'specifyjs';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    secureFetch('https://api.example.com/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return createElement('ul', null,
    ...users.map(u =>
      createElement('li', { key: u.id }, u.name)
    ),
  );
}`,
      ),
    ),

    section(
      'Set Meta Tags',
      createElement(
        'pre',
        { className: 'code-block' },
        `import { useHead } from 'specifyjs';

function MyPage() {
  useHead({
    title: 'My Page',
    description: 'Page description for SEO',
    keywords: 'specifyjs, spa',
    author: 'Your Name',
    httpEquiv: {
      csp: "default-src 'self'; script-src 'self'",
      referrer: 'strict-origin-when-cross-origin',
    },
  });

  return createElement('div', null, 'Secure page');
}`,
      ),
    ),

    section(
      'Build for Production',
      createElement(
        'pre',
        { className: 'code-block' },
        `# Install Vite
npm install -D vite typescript

# Development server
npx vite

# Production build (minified, tree-shaken)
npx vite build

# Output: dist/index.html + dist/assets/*.js`,
      ),
    ),
  );
}

function section(title: string, content: ReturnType<typeof createElement>) {
  return createElement(
    'div',
    { style: { marginBottom: '28px' } },
    createElement(
      'h3',
      { style: { fontSize: '17px', fontWeight: '700', marginBottom: '10px' } },
      title,
    ),
    content,
  );
}
