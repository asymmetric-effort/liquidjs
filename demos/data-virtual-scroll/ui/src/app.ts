import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { VirtualScroll } from '../../../../components/data/virtual-scroll/src/index';

// ── Generate Large Dataset ─────────────────────────────────────────────

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
const sources = ['api-server', 'auth-service', 'db-proxy', 'cache-layer', 'gateway'];

function generateLogs(count: number): LogEntry[] {
  const logs: LogEntry[] = [];
  const baseTime = new Date('2026-04-21T08:00:00Z');
  for (let i = 0; i < count; i++) {
    const time = new Date(baseTime.getTime() + i * 1500);
    logs.push({
      id: i,
      timestamp: time.toISOString().replace('T', ' ').slice(0, 19),
      level: levels[i % levels.length]!,
      message: `Request processed in ${Math.floor(Math.random() * 500 + 10)}ms - endpoint /api/v${Math.floor(Math.random() * 3) + 1}/resource/${i}`,
      source: sources[i % sources.length]!,
    });
  }
  return logs;
}

// ── Demo App ───────────────────────────────────────────────────────────

function VirtualScrollDemo() {
  const [itemCount, setItemCount] = useState(10000);
  const [itemHeight, setItemHeight] = useState(48);
  const [containerHeight, setContainerHeight] = useState(500);
  const [overscan, setOverscan] = useState(5);

  const logs = generateLogs(itemCount);

  const levelColors: Record<string, string> = {
    INFO: '#3b82f6',
    WARN: '#f59e0b',
    ERROR: '#ef4444',
    DEBUG: '#6b7280',
  };

  const renderItem = useCallback((item: unknown, index: number) => {
    const log = item as LogEntry;
    return createElement('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '8px 16px', fontSize: '13px',
        backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
        borderBottom: '1px solid #f3f4f6',
        height: '100%', boxSizing: 'border-box',
      },
    },
      createElement('span', { style: { color: '#9ca3af', width: '50px', flexShrink: '0', fontFamily: 'monospace', fontSize: '11px' } }, String(log.id)),
      createElement('span', { style: { width: '140px', flexShrink: '0', fontFamily: 'monospace', fontSize: '12px' } }, log.timestamp),
      createElement('span', {
        style: {
          width: '50px', flexShrink: '0', fontWeight: '600', fontSize: '11px',
          color: levelColors[log.level] ?? '#6b7280',
        },
      }, log.level),
      createElement('span', { style: { width: '90px', flexShrink: '0', color: '#6b7280', fontSize: '12px' } }, log.source),
      createElement('span', { style: { flex: '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, log.message),
    );
  }, []);

  const controlStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
  };

  return createElement('div', {
    style: { maxWidth: '1000px', margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  },
    createElement('h1', { style: { fontSize: '24px', marginBottom: '8px' } }, 'VirtualScroll Demo'),
    createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
      `Efficiently rendering ${itemCount.toLocaleString()} log entries. Only visible items plus overscan buffer are in the DOM.`,
    ),

    // Controls
    createElement('div', { style: { marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' } },
      createElement('label', { style: controlStyle },
        'Items:',
        createElement('select', {
          value: String(itemCount),
          onChange: (e: Event) => setItemCount(parseInt((e.target as HTMLSelectElement).value, 10)),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: '1000' }, '1,000'),
          createElement('option', { value: '10000' }, '10,000'),
          createElement('option', { value: '100000' }, '100,000'),
        ),
      ),
      createElement('label', { style: controlStyle },
        'Row height:',
        createElement('select', {
          value: String(itemHeight),
          onChange: (e: Event) => setItemHeight(parseInt((e.target as HTMLSelectElement).value, 10)),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: '36' }, '36px'),
          createElement('option', { value: '48' }, '48px'),
          createElement('option', { value: '64' }, '64px'),
        ),
      ),
      createElement('label', { style: controlStyle },
        'Height:',
        createElement('select', {
          value: String(containerHeight),
          onChange: (e: Event) => setContainerHeight(parseInt((e.target as HTMLSelectElement).value, 10)),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: '300' }, '300px'),
          createElement('option', { value: '500' }, '500px'),
          createElement('option', { value: '700' }, '700px'),
        ),
      ),
      createElement('label', { style: controlStyle },
        'Overscan:',
        createElement('select', {
          value: String(overscan),
          onChange: (e: Event) => setOverscan(parseInt((e.target as HTMLSelectElement).value, 10)),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: '0' }, '0'),
          createElement('option', { value: '5' }, '5'),
          createElement('option', { value: '10' }, '10'),
          createElement('option', { value: '20' }, '20'),
        ),
      ),
    ),

    // VirtualScroll
    createElement('div', { style: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' } },
      createElement(VirtualScroll, {
        items: logs,
        renderItem,
        itemHeight,
        height: `${containerHeight}px`,
        overscan,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(VirtualScrollDemo, null));
