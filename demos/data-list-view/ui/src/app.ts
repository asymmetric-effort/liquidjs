import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';
import { ListView } from '../../../../components/data/list-view/src/index';

// ── Sample Data ────────────────────────────────────────────────────────

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const contacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Engineer', avatar: 'AJ' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', avatar: 'BS' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'PM', avatar: 'CB' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Engineer', avatar: 'DP' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'QA', avatar: 'ED' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'DevOps', avatar: 'FM' },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'Designer', avatar: 'GL' },
  { id: '8', name: 'Hank Wilson', email: 'hank@example.com', role: 'Engineer', avatar: 'HW' },
];

// ── Demo App ───────────────────────────────────────────────────────────

function ListViewDemo() {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [divider, setDivider] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [filterText, setFilterText] = useState('');

  const filteredContacts = filterText
    ? contacts.filter((c) => c.name.toLowerCase().includes(filterText.toLowerCase()))
    : contacts;

  const renderItem = useCallback((item: unknown, _index: number) => {
    const c = item as Contact;
    return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
      createElement('div', {
        style: {
          width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3b82f6',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '600', flexShrink: '0',
        },
      }, c.avatar),
      createElement('div', { style: { flex: '1' } },
        createElement('div', { style: { fontWeight: '500' } }, c.name),
        createElement('div', { style: { fontSize: '12px', color: '#6b7280' } }, `${c.role} - ${c.email}`),
      ),
    );
  }, []);

  const keyExtractor = useCallback((item: unknown, _index: number) => {
    return (item as Contact).id;
  }, []);

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

  return createElement('div', {
    style: { maxWidth: '600px', margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  },
    createElement('h1', { style: { fontSize: '24px', marginBottom: '8px' } }, 'ListView Demo'),
    createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
      'Styled list with item rendering, dividers, selection, and header/footer.',
    ),

    // Filter input
    createElement('input', {
      type: 'text',
      placeholder: 'Filter contacts...',
      value: filterText,
      onInput: (e: Event) => setFilterText((e.target as HTMLInputElement).value),
      style: {
        width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
        borderRadius: '6px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box',
      },
    }),

    // Controls
    createElement('div', { style: { marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' } },
      createElement('button', {
        style: divider ? activeToggleStyle : toggleStyle,
        onClick: () => setDivider((d: boolean) => !d),
      }, 'Dividers'),
      createElement('button', {
        style: hoverable ? activeToggleStyle : toggleStyle,
        onClick: () => setHoverable((h: boolean) => !h),
      }, 'Hoverable'),
      createElement('button', {
        style: showHeader ? activeToggleStyle : toggleStyle,
        onClick: () => setShowHeader((h: boolean) => !h),
      }, 'Header'),
      createElement('button', {
        style: showFooter ? activeToggleStyle : toggleStyle,
        onClick: () => setShowFooter((f: boolean) => !f),
      }, 'Footer'),
    ),

    // Selected info
    selectedIndex != null
      ? createElement('div', { style: { padding: '8px 12px', backgroundColor: '#eff6ff', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' } },
          `Selected: ${filteredContacts[selectedIndex]?.name ?? 'unknown'} (index ${selectedIndex})`,
        )
      : null,

    // ListView
    createElement('div', { style: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' } },
      createElement(ListView, {
        items: filteredContacts,
        renderItem,
        keyExtractor,
        divider,
        hoverable,
        selectedIndex,
        onSelect: setSelectedIndex,
        emptyMessage: 'No contacts match your filter',
        header: showHeader ? `Contacts (${filteredContacts.length})` : undefined,
        footer: showFooter ? 'End of contact list' : undefined,
      }),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(ListViewDemo, null));
