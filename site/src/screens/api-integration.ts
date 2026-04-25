// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'specifyjs';
import { useState, useCallback, useHead } from 'specifyjs/hooks';
import { useFetch } from '../hooks/use-fetch';

export function ApiIntegration() {
  useHead({
    title: 'API Integration — SpecifyJS',
    description: 'REST, GraphQL, and gRPC client integration patterns with SpecifyJS hooks.',
    keywords: 'specifyjs, rest api, graphql, grpc, useFetch, data fetching',
    author: 'Asymmetric Effort, LLC',
  });

  return createElement('div', null,
    createElement('div', { className: 'section' },
      createElement('h2', null, 'API Integration'),
      createElement('p', { style: { color: '#64748b', marginBottom: '24px' } },
        'SpecifyJS includes built-in REST, GraphQL, and gRPC clients. This page demonstrates data fetching patterns with custom hooks.',
      ),
    ),
    createElement('div', { className: 'preview-grid' },
      createElement('div', { className: 'preview-card' },
        createElement('div', { className: 'preview-header' }, 'useFetch Hook — Live Data'),
        createElement('div', { className: 'preview-body' }, createElement(FetchDemo, null)),
      ),
      createElement('div', { className: 'preview-card' },
        createElement('div', { className: 'preview-header' }, 'REST Client Pattern'),
        createElement('div', { className: 'preview-body' }, createElement(RestPatternDemo, null)),
      ),
      createElement('div', { className: 'preview-card' },
        createElement('div', { className: 'preview-header' }, 'GraphQL Client Pattern'),
        createElement('div', { className: 'preview-body' }, createElement(GraphQLPatternDemo, null)),
      ),
      createElement('div', { className: 'preview-card' },
        createElement('div', { className: 'preview-header' }, 'Error Handling'),
        createElement('div', { className: 'preview-body' }, createElement(ErrorHandlingDemo, null)),
      ),
    ),
  );
}

function FetchDemo() {
  const { data, loading, error } = useFetch<{ source: string; snapshot2026: Record<string, number> }>(
    './data/economic-indicators.json',
  );

  if (loading) return createElement('div', { style: { color: '#64748b' } }, 'Fetching data...');
  if (error) return createElement('div', { style: { color: '#ef4444' } }, `Error: ${error}`);

  const snap = data!.snapshot2026;
  return createElement('div', null,
    createElement('p', { style: { fontSize: '13px', color: '#64748b', marginBottom: '12px' } },
      'Data fetched via HTTPS from static JSON:',
    ),
    createElement('pre', { className: 'code-block', style: { fontSize: '12px' } },
      JSON.stringify(snap, null, 2),
    ),
  );
}

function RestPatternDemo() {
  return createElement('div', null,
    createElement('p', { style: { fontSize: '13px', color: '#64748b', marginBottom: '12px' } },
      'Built-in REST client with interceptors, timeout, and abort:',
    ),
    createElement('pre', { className: 'code-block', style: { fontSize: '12px' } },
      `import { createRestClient } from 'specifyjs/client';

const client = createRestClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { Authorization: 'Bearer token' },
});

// GET, POST, PUT, PATCH, DELETE
const { data } = await client.get('/users');
await client.post('/users', { name: 'Alice' });

// With useRest hook
function UserList() {
  const { data, loading, error } = useRest(
    client, '/users'
  );
  // ...
}`,
    ),
  );
}

function GraphQLPatternDemo() {
  return createElement('div', null,
    createElement('p', { style: { fontSize: '13px', color: '#64748b', marginBottom: '12px' } },
      'Zero-dependency GraphQL client with caching:',
    ),
    createElement('pre', { className: 'code-block', style: { fontSize: '12px' } },
      `import { createGraphQLClient, gql } from 'specifyjs/client';

const client = createGraphQLClient({
  url: '/graphql',
  cache: true,
});

const USERS = gql\`
  query { users { id name email } }
\`;

// With useQuery hook
function UserList() {
  const { data, loading } = useQuery(
    client, USERS
  );
  // ...
}`,
    ),
  );
}

function ErrorHandlingDemo() {
  const [url, setUrl] = useState('./data/economic-indicators.json');
  const { data, loading, error } = useFetch(url);

  return createElement('div', null,
    createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px' } },
      createElement('button', {
        onClick: () => setUrl('./data/economic-indicators.json'),
        style: btnStyle(url.includes('economic')),
      }, 'Valid URL'),
      createElement('button', {
        onClick: () => setUrl('./data/does-not-exist.json'),
        style: btnStyle(url.includes('does-not')),
      }, 'Invalid URL'),
    ),
    loading
      ? createElement('div', { style: { color: '#64748b', fontSize: '14px' } }, 'Loading...')
      : error
        ? createElement('div', { style: { padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '13px' } },
            `Error: ${error}`,
          )
        : createElement('div', { style: { padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#16a34a', fontSize: '13px' } },
            'Data loaded successfully!',
          ),
  );
}

function btnStyle(active: boolean) {
  return {
    padding: '6px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    backgroundColor: active ? '#3b82f6' : '#f8fafc',
    color: active ? 'white' : '#0f172a',
  };
}
