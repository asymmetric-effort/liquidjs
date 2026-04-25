import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Tag } from '../../../../components/data/tag/src/index';

// ── Demo App ───────────────────────────────────────────────────────────

interface TagItem {
  id: string;
  label: string;
  color: string;
}

const initialTags: TagItem[] = [
  { id: '1', label: 'JavaScript', color: '#f59e0b' },
  { id: '2', label: 'TypeScript', color: '#3b82f6' },
  { id: '3', label: 'React', color: '#06b6d4' },
  { id: '4', label: 'SpecifyJS', color: '#8b5cf6' },
  { id: '5', label: 'Node.js', color: '#22c55e' },
  { id: '6', label: 'Python', color: '#3b82f6' },
  { id: '7', label: 'Go', color: '#06b6d4' },
  { id: '8', label: 'Rust', color: '#ef4444' },
];

function TagDemo() {
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [variant, setVariant] = useState<'solid' | 'outline' | 'subtle'>('subtle');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [removable, setRemovable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [clickLog, setClickLog] = useState<string[]>([]);

  const handleRemove = useCallback((id: string) => {
    setTags((prev: TagItem[]) => prev.filter((t) => t.id !== id));
  }, []);

  const handleClick = useCallback((label: string) => {
    setClickLog((prev: string[]) => [...prev.slice(-4), `Clicked: ${label}`]);
  }, []);

  const handleAddTag = useCallback(() => {
    if (!newTagText.trim()) return;
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)]!;
    setTags((prev: TagItem[]) => [
      ...prev,
      { id: String(Date.now()), label: newTagText.trim(), color },
    ]);
    setNewTagText('');
  }, [newTagText]);

  const resetTags = useCallback(() => {
    setTags(initialTags);
    setClickLog([]);
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
    style: { maxWidth: '700px', margin: '0 auto', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  },
    createElement('h1', { style: { fontSize: '24px', marginBottom: '8px' } }, 'Tag Demo'),
    createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
      'Pill/chip elements with variants, sizes, remove buttons, and click interactions.',
    ),

    // Controls
    createElement('div', { style: { marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
      createElement('label', { style: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
        'Variant:',
        createElement('select', {
          value: variant,
          onChange: (e: Event) => setVariant((e.target as HTMLSelectElement).value as any),
          style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' },
        },
          createElement('option', { value: 'subtle' }, 'Subtle'),
          createElement('option', { value: 'solid' }, 'Solid'),
          createElement('option', { value: 'outline' }, 'Outline'),
        ),
      ),
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
      createElement('button', {
        style: removable ? activeToggleStyle : toggleStyle,
        onClick: () => setRemovable((r: boolean) => !r),
      }, 'Removable'),
      createElement('button', {
        style: disabled ? activeToggleStyle : toggleStyle,
        onClick: () => setDisabled((d: boolean) => !d),
      }, 'Disabled'),
      createElement('button', { style: toggleStyle, onClick: resetTags }, 'Reset'),
    ),

    // Add tag input
    createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px' } },
      createElement('input', {
        type: 'text',
        placeholder: 'Add a new tag...',
        value: newTagText,
        onInput: (e: Event) => setNewTagText((e.target as HTMLInputElement).value),
        onKeyDown: (e: Event) => { if ((e as KeyboardEvent).key === 'Enter') handleAddTag(); },
        style: {
          flex: '1', padding: '8px 12px', border: '1px solid #d1d5db',
          borderRadius: '6px', fontSize: '14px',
        },
      }),
      createElement('button', {
        onClick: handleAddTag,
        style: { ...activeToggleStyle, padding: '8px 16px' },
      }, 'Add'),
    ),

    // Tags display
    createElement('div', {
      style: {
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px',
        minHeight: '60px', backgroundColor: '#fafafa',
      },
    },
      ...tags.map((tag) =>
        createElement(Tag, {
          key: tag.id,
          label: tag.label,
          color: tag.color,
          variant,
          size,
          removable,
          disabled,
          onRemove: () => handleRemove(tag.id),
          onClick: () => handleClick(tag.label),
        }),
      ),
      tags.length === 0
        ? createElement('span', { style: { color: '#9ca3af', fontSize: '14px' } }, 'No tags. Add one above!')
        : null,
    ),

    // Click log
    clickLog.length > 0
      ? createElement('div', { style: { marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' } },
          createElement('div', { style: { fontWeight: '600', marginBottom: '4px' } }, 'Click Log:'),
          ...clickLog.map((msg, i) => createElement('div', { key: String(i), style: { color: '#6b7280' } }, msg)),
        )
      : null,
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(TagDemo, null));
