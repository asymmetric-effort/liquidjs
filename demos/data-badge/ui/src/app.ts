import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Badge } from '../../../../components/data/badge/src/index';

// ── Demo App ───────────────────────────────────────────────────────────

function BadgeDemo() {
  const [count, setCount] = useState(5);
  const [maxVal, setMaxVal] = useState(99);
  const [dot, setDot] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [variant, setVariant] = useState<'solid' | 'outline'>('solid');
  const [color, setColor] = useState('#ef4444');

  const increment = useCallback(() => setCount((c: number) => c + 1), []);
  const decrement = useCallback(() => setCount((c: number) => Math.max(0, c - 1)), []);
  const reset = useCallback(() => setCount(0), []);

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

  const iconBoxStyle = {
    width: '40px', height: '40px', backgroundColor: '#e5e7eb',
    borderRadius: '8px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '20px',
  };

  const sectionStyle = {
    marginBottom: '32px',
  };

  const sectionTitleStyle = {
    fontSize: '16px', fontWeight: '600', marginBottom: '12px',
  };

  return createElement('div', {
    style: { maxWidth: '700px', margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  },
    createElement('h1', { style: { fontSize: '24px', marginBottom: '8px' } }, 'Badge Demo'),
    createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
      'Count or dot indicator, positioned as overlay on children or rendered inline.',
    ),

    // Controls
    createElement('div', { style: { marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
      createElement('button', { style: toggleStyle, onClick: decrement }, '- 1'),
      createElement('span', { style: { fontWeight: '600', fontSize: '16px', padding: '0 8px' } }, String(count)),
      createElement('button', { style: toggleStyle, onClick: increment }, '+ 1'),
      createElement('button', { style: toggleStyle, onClick: reset }, 'Reset'),
      createElement('button', {
        style: dot ? activeToggleStyle : toggleStyle,
        onClick: () => setDot((d: boolean) => !d),
      }, 'Dot mode'),
      createElement('label', { style: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
        'Size:',
        createElement('select', {
          value: size,
          onChange: (e: Event) => setSize((e.target as HTMLSelectElement).value as any),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: 'sm' }, 'Small'),
          createElement('option', { value: 'md' }, 'Medium'),
          createElement('option', { value: 'lg' }, 'Large'),
        ),
      ),
      createElement('label', { style: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
        'Variant:',
        createElement('select', {
          value: variant,
          onChange: (e: Event) => setVariant((e.target as HTMLSelectElement).value as any),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: 'solid' }, 'Solid'),
          createElement('option', { value: 'outline' }, 'Outline'),
        ),
      ),
      createElement('label', { style: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
        'Color:',
        createElement('input', {
          type: 'color',
          value: color,
          onInput: (e: Event) => setColor((e.target as HTMLInputElement).value),
          style: { width: '32px', height: '24px', border: 'none', cursor: 'pointer' },
        }),
      ),
    ),

    // Overlay badges section
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Overlay Badges'),
      createElement('div', { style: { display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' } },
        createElement(Badge, { count, max: maxVal, dot, size, variant, color },
          createElement('div', { style: iconBoxStyle }, '\uD83D\uDCE7'),
        ),
        createElement(Badge, { count: count * 2, max: maxVal, dot, size, variant, color },
          createElement('div', { style: iconBoxStyle }, '\uD83D\uDD14'),
        ),
        createElement(Badge, { count: Math.floor(count / 2), max: maxVal, dot, size, variant, color },
          createElement('div', { style: iconBoxStyle }, '\uD83D\uDCAC'),
        ),
        createElement(Badge, { dot: true, size, variant, color },
          createElement('div', { style: iconBoxStyle }, '\u2699\uFE0F'),
        ),
      ),
    ),

    // Inline badges section
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Inline Badges'),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' } },
        createElement(Badge, { count, max: maxVal, size: 'sm', variant, color }),
        createElement(Badge, { count, max: maxVal, size: 'md', variant, color }),
        createElement(Badge, { count, max: maxVal, size: 'lg', variant, color }),
        createElement(Badge, { dot: true, size: 'sm', color }),
        createElement(Badge, { dot: true, size: 'md', color }),
        createElement(Badge, { dot: true, size: 'lg', color }),
      ),
    ),

    // Max value demo
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Max Value'),
      createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' } },
        createElement('label', { style: { fontSize: '13px' } }, 'Max:'),
        createElement('input', {
          type: 'number',
          value: String(maxVal),
          onInput: (e: Event) => setMaxVal(parseInt((e.target as HTMLInputElement).value, 10) || 99),
          style: { width: '60px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px' },
        }),
      ),
      createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
        createElement(Badge, { count: 5, max: maxVal, size: 'md' }),
        createElement(Badge, { count: 50, max: maxVal, size: 'md' }),
        createElement(Badge, { count: 100, max: maxVal, size: 'md' }),
        createElement(Badge, { count: 999, max: maxVal, size: 'md' }),
      ),
    ),

    // Color presets
    createElement('div', { style: sectionStyle },
      createElement('h3', { style: sectionTitleStyle }, 'Color Presets'),
      createElement('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } },
        ...['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'].map((c) =>
          createElement(Badge, { key: c, count: 8, color: c, size: 'md' }),
        ),
      ),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(BadgeDemo, null));
