import { createElement } from 'liquidjs';

const VERSION = '0.1.1';

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
    ),
  );
}
