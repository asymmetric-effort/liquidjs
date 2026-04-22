/**
 * ListView — Styled list with configurable item rendering, dividers,
 * selection, hover effects, and optional header/footer.
 */

import { createElement } from '../../../../core/src/index';
import { useState, useCallback } from '../../../../core/src/hooks/index';

export interface ListViewProps {
  /** Array of items to render */
  items: unknown[];
  /** Render function for each item */
  renderItem: (item: unknown, index: number) => unknown;
  /** Unique key extractor per item */
  keyExtractor: (item: unknown, index: number) => string;
  /** Show divider between items */
  divider?: boolean;
  /** Highlight items on hover */
  hoverable?: boolean;
  /** Currently selected item index */
  selectedIndex?: number;
  /** Selection handler */
  onSelect?: (index: number) => void;
  /** Message shown when items is empty */
  emptyMessage?: string;
  /** Optional header element */
  header?: unknown;
  /** Optional footer element */
  footer?: unknown;
}

const listStyle: Record<string, string> = {
  listStyle: 'none',
  margin: '0',
  padding: '0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
};

const itemBaseStyle: Record<string, string> = {
  padding: '10px 14px',
  color: '#1f2937',
};

const dividerStyle: Record<string, string> = {
  borderBottom: '1px solid #e5e7eb',
};

const hoverableStyle: Record<string, string> = {
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

const selectedStyle: Record<string, string> = {
  backgroundColor: '#eff6ff',
};

const emptyStyle: Record<string, string> = {
  padding: '24px',
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: '14px',
};

const sectionStyle: Record<string, string> = {
  padding: '10px 14px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  fontWeight: '600',
  fontSize: '13px',
  color: '#6b7280',
};

export function ListView(props: ListViewProps) {
  const {
    items,
    renderItem,
    keyExtractor,
    divider = false,
    hoverable = false,
    selectedIndex,
    onSelect,
    emptyMessage = 'No items',
    header,
    footer,
  } = props;

  // Empty state
  if (items.length === 0) {
    return createElement('div', null,
      header ? createElement('div', { style: sectionStyle }, header) : null,
      createElement('div', { style: emptyStyle }, emptyMessage),
      footer ? createElement('div', { style: { ...sectionStyle, borderBottom: 'none', borderTop: '1px solid #e5e7eb' } }, footer) : null,
    );
  }

  const listItems: unknown[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = keyExtractor(item, i);
    const isSelected = selectedIndex === i;
    const isLast = i === items.length - 1;

    const style: Record<string, string> = {
      ...itemBaseStyle,
      ...(hoverable ? hoverableStyle : {}),
      ...(isSelected ? selectedStyle : {}),
      ...(divider && !isLast ? dividerStyle : {}),
    };

    listItems.push(
      createElement('li', {
        key,
        style,
        onClick: onSelect ? () => onSelect(i) : undefined,
        role: onSelect ? 'option' : undefined,
        'aria-selected': onSelect ? String(isSelected) : undefined,
      }, renderItem(item, i)),
    );
  }

  return createElement('div', null,
    header ? createElement('div', { style: sectionStyle }, header) : null,
    createElement('ul', {
      style: listStyle,
      role: onSelect ? 'listbox' : 'list',
    }, ...listItems),
    footer ? createElement('div', { style: { ...sectionStyle, borderBottom: 'none', borderTop: '1px solid #e5e7eb' } }, footer) : null,
  );
}
