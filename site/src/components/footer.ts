// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'specifyjs';

const VERSION = '0.0.12';

export function Footer() {
  const year = new Date().getFullYear();
  return createElement(
    'footer',
    {
      style: {
        borderTop: '1px solid #e2e8f0',
        padding: '24px',
        marginTop: '48px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b',
      },
    },
    createElement(
      'div',
      { style: { maxWidth: '1200px', margin: '0 auto' } },
      createElement(
        'p',
        null,
        `SpecifyJS v${VERSION}`,
      ),
      createElement(
        'p',
        { style: { marginTop: '6px' } },
        `\u00a9 2025-${year} `,
        createElement(
          'a',
          {
            href: 'https://asymmetric-effort.com',
            style: { color: '#3b82f6', textDecoration: 'none' },
          },
          'Asymmetric Effort, LLC',
        ),
        '. MIT License.',
      ),
      createElement(
        'p',
        { style: { marginTop: '6px' } },
        createElement(
          'a',
          {
            href: 'https://github.com/asymmetric-effort/specifyjs',
            style: { color: '#3b82f6', textDecoration: 'none' },
          },
          'GitHub Repository',
        ),
      ),
    ),
  );
}
