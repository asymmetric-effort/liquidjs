// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'liquidjs';

const VERSION = '0.2.1';

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
        `LiquidJS v${VERSION}`,
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
            href: 'https://github.com/asymmetric-effort/liquidjs',
            style: { color: '#3b82f6', textDecoration: 'none' },
          },
          'GitHub Repository',
        ),
      ),
      createElement(
        'div',
        { style: { marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' } },
        createElement(
          'a',
          {
            href: 'https://app.fossa.com/projects/custom%2B61980%2Fgit%40github.com%3Aasymmetric-effort%2Fliquidjs.git?ref=badge_shield&issueType=license',
          },
          createElement('img', {
            src: 'https://app.fossa.com/api/projects/custom%2B61980%2Fgit%40github.com%3Aasymmetric-effort%2Fliquidjs.git.svg?type=shield&issueType=license',
            alt: 'FOSSA Status',
          }),
        ),
        createElement(
          'a',
          {
            href: 'https://app.fossa.com/projects/custom%2B61980%2Fgit%40github.com%3Aasymmetric-effort%2Fliquidjs.git?ref=badge_shield&issueType=security',
          },
          createElement('img', {
            src: 'https://app.fossa.com/api/projects/custom%2B61980%2Fgit%40github.com%3Aasymmetric-effort%2Fliquidjs.git.svg?type=shield&issueType=security',
            alt: 'FOSSA Status',
          }),
        ),
      ),
    ),
  );
}
