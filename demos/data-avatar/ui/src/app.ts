import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Avatar } from '../../../../components/data/avatar/src/index';

// ── Demo App ───────────────────────────────────────────────────────────

function AvatarDemo() {
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  const [showStatus, setShowStatus] = useState(true);
  const [statusPos, setStatusPos] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('bottom-right');

  const toggleStyle = {
    padding: '6px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  };

  const activeToggleStyle = {
    ...toggleStyle,
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6',
  };

  const sectionStyle = { marginBottom: '32px' };
  const sectionTitleStyle = { fontSize: '16px', fontWeight: '600', marginBottom: '12px' };

  const people = [
    { name: 'Alice Johnson', status: 'online' as const },
    { name: 'Bob Smith', status: 'away' as const },
    { name: 'Charlie Brown', status: 'busy' as const },
    { name: 'Diana Prince', status: 'offline' as const },
    { name: 'Eve Davis', status: 'online' as const },
  ];

  return createElement('div', {
    style: { maxWidth: '700px', margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  },
    createElement('h1', { style: { fontSize: '24px', marginBottom: '8px' } }, 'Avatar Demo'),
    createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
      'User avatars with image, initials fallback, status indicators, and various sizes.',
    ),

    // Controls
    createElement('div', { style: { marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
      createElement('label', { style: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
        'Size:',
        createElement('select', {
          value: size,
          onChange: (e: Event) => setSize((e.target as HTMLSelectElement).value as any),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: 'xs' }, 'XS (24px)'),
          createElement('option', { value: 'sm' }, 'SM (32px)'),
          createElement('option', { value: 'md' }, 'MD (40px)'),
          createElement('option', { value: 'lg' }, 'LG (56px)'),
          createElement('option', { value: 'xl' }, 'XL (80px)'),
        ),
      ),
      createElement('button', {
        style: shape === 'circle' ? activeToggleStyle : toggleStyle,
        onClick: () => setShape('circle'),
      }, 'Circle'),
      createElement('button', {
        style: shape === 'square' ? activeToggleStyle : toggleStyle,
        onClick: () => setShape('square'),
      }, 'Square'),
      createElement('button', {
        style: showStatus ? activeToggleStyle : toggleStyle,
        onClick: () => setShowStatus((s: boolean) => !s),
      }, 'Status'),
      createElement('label', { style: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
        'Status position:',
        createElement('select', {
          value: statusPos,
          onChange: (e: Event) => setStatusPos((e.target as HTMLSelectElement).value as any),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: 'top-right' }, 'Top Right'),
          createElement('option', { value: 'top-left' }, 'Top Left'),
          createElement('option', { value: 'bottom-right' }, 'Bottom Right'),
          createElement('option', { value: 'bottom-left' }, 'Bottom Left'),
        ),
      ),
    ),

    // Initials Avatars
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Initials Fallback'),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' } },
        ...people.map((p) =>
          createElement('div', { key: p.name, style: { textAlign: 'center' } },
            createElement(Avatar, {
              name: p.name,
              size,
              shape,
              status: showStatus ? p.status : undefined,
              statusPosition: statusPos,
            }),
            createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px' } }, p.name.split(' ')[0]),
          ),
        ),
      ),
    ),

    // Size comparison
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Size Comparison'),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'end', flexWrap: 'wrap' } },
        ...(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) =>
          createElement('div', { key: s, style: { textAlign: 'center' } },
            createElement(Avatar, { name: 'Test User', size: s, shape }),
            createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px' } }, s.toUpperCase()),
          ),
        ),
      ),
    ),

    // Custom numeric sizes
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Custom Pixel Sizes'),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'end', flexWrap: 'wrap' } },
        ...[20, 48, 72, 100, 128].map((px) =>
          createElement('div', { key: String(px), style: { textAlign: 'center' } },
            createElement(Avatar, { name: 'Custom Size', size: px, shape }),
            createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px' } }, `${px}px`),
          ),
        ),
      ),
    ),

    // Status indicators
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Status Indicators'),
      createElement('div', { style: { display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' } },
        ...(['online', 'away', 'busy', 'offline'] as const).map((status) =>
          createElement('div', { key: status, style: { textAlign: 'center' } },
            createElement(Avatar, { name: status, size: 'lg', status, statusPosition: statusPos }),
            createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px', textTransform: 'capitalize' } }, status),
          ),
        ),
      ),
    ),

    // Image avatar with fallback
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Image & Fallback'),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' } },
        createElement('div', { style: { textAlign: 'center' } },
          createElement(Avatar, {
            src: 'https://i.pravatar.cc/150?img=1',
            name: 'Real Photo',
            size: 'lg',
            shape,
            status: showStatus ? 'online' : undefined,
          }),
          createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px' } }, 'With image'),
        ),
        createElement('div', { style: { textAlign: 'center' } },
          createElement(Avatar, {
            src: 'https://broken-url.invalid/404.jpg',
            name: 'Broken URL',
            size: 'lg',
            shape,
          }),
          createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px' } }, 'Broken image'),
        ),
        createElement('div', { style: { textAlign: 'center' } },
          createElement(Avatar, { size: 'lg', shape }),
          createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '6px' } }, 'No name'),
        ),
      ),
    ),

    // Custom fallback color
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Custom Colors'),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' } },
        ...['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map((c, i) =>
          createElement(Avatar, {
            key: c,
            name: `User ${i + 1}`,
            size: 'lg',
            shape,
            fallbackColor: c,
          }),
        ),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(AvatarDemo, null));
