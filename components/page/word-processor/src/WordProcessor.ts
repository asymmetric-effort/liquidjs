// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * WordProcessor -- Full-screen layout resembling a word processor application.
 *
 * Features a menu bar, formatting toolbar with toggle states, ruler bar,
 * centered document page on a gray background with drop shadow, and a
 * status bar with live word count and zoom display. Supports dark mode
 * via CSS variables and provides hover/transition polish on interactive
 * elements.
 */

import { createElement } from '../../../../core/src/index';
import { useMemo, useState, useCallback } from '../../../../core/src/hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WordProcessorProps {
  /** Document content rendered in the page area */
  content?: string;
  /** Extra class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MENUS = ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'];

const FORMAT_BUTTONS: Array<{ id: string; label: string; text: string; shortcut?: string; style?: Record<string, string> }> = [
  { id: 'bold', label: 'Bold', text: 'B', shortcut: 'Ctrl+B', style: { fontWeight: '700' } },
  { id: 'italic', label: 'Italic', text: 'I', shortcut: 'Ctrl+I', style: { fontStyle: 'italic' } },
  { id: 'underline', label: 'Underline', text: 'U', shortcut: 'Ctrl+U', style: { textDecoration: 'underline' } },
];

const ALIGN_BUTTONS: Array<{ label: string; text: string }> = [
  { label: 'Align left', text: '\u2261' },
  { label: 'Align center', text: '\u2263' },
  { label: 'Align right', text: '\u2262' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildRulerTicks(): Array<unknown> {
  const ticks: Array<unknown> = [];
  for (let i = 0; i <= 20; i++) {
    const isMajor = i % 2 === 0;
    ticks.push(
      createElement('div', {
        key: String(i),
        style: {
          position: 'absolute',
          left: `${(i / 20) * 100}%`,
          bottom: '0',
          width: '1px',
          height: isMajor ? '10px' : '5px',
          backgroundColor: '#999',
        },
      }),
    );
    if (isMajor) {
      ticks.push(
        createElement('span', {
          key: `l${i}`,
          style: {
            position: 'absolute',
            left: `${(i / 20) * 100}%`,
            top: '1px',
            fontSize: '8px',
            color: '#666',
            transform: 'translateX(-50%)',
          },
        }, String(i / 2)),
      );
    }
  }
  return ticks;
}

function computeWordCount(text: string): number {
  return text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WordProcessor(props: WordProcessorProps) {
  const [boldActive, setBoldActive] = useState<boolean>(false);
  const [italicActive, setItalicActive] = useState<boolean>(false);
  const [underlineActive, setUnderlineActive] = useState<boolean>(false);
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number>(-1);
  const [hoveredToolBtn, setHoveredToolBtn] = useState<string>('');

  const togglers: Record<string, () => void> = {
    bold: useCallback(() => setBoldActive((prev: boolean) => !prev), []),
    italic: useCallback(() => setItalicActive((prev: boolean) => !prev), []),
    underline: useCallback(() => setUnderlineActive((prev: boolean) => !prev), []),
  };

  const activeStates: Record<string, boolean> = {
    bold: boldActive,
    italic: italicActive,
    underline: underlineActive,
  };

  const containerStyle = useMemo<Record<string, string>>(() => ({
    width: '100%',
    height: '100%',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    fontSize: '13px',
    color: 'var(--color-text, #333)',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  }), []);

  const menuBarStyle: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    backgroundColor: 'var(--color-bg-subtle, #ffffff)',
    borderBottom: '1px solid var(--color-border, #d0d0d0)',
    padding: '0 8px',
    gap: '2px',
    flexShrink: '0',
  };

  const toolbarStyle: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    height: '36px',
    backgroundColor: 'var(--color-bg-subtle, #f8f9fa)',
    borderBottom: '1px solid var(--color-border, #d0d0d0)',
    padding: '0 12px',
    gap: '12px',
    flexShrink: '0',
  };

  const rulerStyle: Record<string, string> = {
    height: '20px',
    backgroundColor: '#e8e8e8',
    borderBottom: '1px solid #ccc',
    position: 'relative',
    flexShrink: '0',
    margin: '0 60px',
  };

  const documentAreaStyle: Record<string, string> = {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '30px 40px',
    overflow: 'auto',
    backgroundColor: '#e0e0e0',
    cursor: 'text',
  };

  const pageStyle: Record<string, string> = {
    width: '680px',
    minHeight: '880px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.18), 0 0 1px rgba(0,0,0,0.1)',
    padding: '72px 72px 96px 72px',
    boxSizing: 'border-box',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#222',
    fontFamily: '"Times New Roman", Georgia, serif',
    cursor: 'text',
  };

  const statusBarStyle: Record<string, string> = {
    height: '24px',
    backgroundColor: 'var(--color-bg-subtle, #f0f0f0)',
    borderTop: '1px solid var(--color-border, #ccc)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    fontSize: '11px',
    color: '#666',
    flexShrink: '0',
  };

  const rulerTicks = useMemo(() => buildRulerTicks(), []);

  const displayContent = props.content ?? 'Start typing...';
  const wordCount = computeWordCount(displayContent);

  function makeMenuItemStyle(index: number): Record<string, string> {
    const isHovered = hoveredMenuIndex === index;
    return {
      padding: '4px 10px',
      cursor: 'pointer',
      borderRadius: '3px',
      fontSize: '13px',
      color: 'var(--color-text, #333)',
      backgroundColor: isHovered ? 'rgba(0,0,0,0.08)' : 'transparent',
      border: 'none',
      lineHeight: '1',
      transition: 'background 0.15s',
    };
  }

  function makeToolBtnStyle(id: string, extraStyle?: Record<string, string>): Record<string, string> {
    const isActive = activeStates[id] ?? false;
    const isHovered = hoveredToolBtn === id;
    return {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid transparent',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '13px',
      backgroundColor: isActive ? 'rgba(0,0,0,0.12)' : (isHovered ? 'rgba(0,0,0,0.06)' : 'transparent'),
      color: 'var(--color-text, #444)',
      transition: 'background 0.15s',
      ...(extraStyle ?? {}),
    };
  }

  const fontDropdownStyle: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    padding: '2px 8px',
    border: '1px solid var(--color-border, #ccc)',
    borderRadius: '3px',
    fontSize: '12px',
    color: 'var(--color-text, #444)',
    backgroundColor: 'transparent',
    cursor: 'default',
    height: '24px',
    gap: '4px',
  };

  return createElement(
    'div',
    {
      className: `word-processor ${props.className ?? ''}`.trim(),
      style: containerStyle,
    },
    // Menu Bar
    createElement(
      'div',
      { className: 'word-processor__menu-bar', style: menuBarStyle, role: 'menubar' },
      ...MENUS.map((menu, i) =>
        createElement(
          'button',
          {
            key: String(i),
            style: makeMenuItemStyle(i),
            role: 'menuitem',
            'aria-label': menu,
            onMouseEnter: () => setHoveredMenuIndex(i),
            onMouseLeave: () => setHoveredMenuIndex(-1),
          },
          menu,
        ),
      ),
    ),
    // Toolbar
    createElement(
      'div',
      { className: 'word-processor__toolbar', style: toolbarStyle, role: 'toolbar', 'aria-label': 'Formatting toolbar' },
      // Font family mock dropdown
      createElement(
        'div',
        {
          style: fontDropdownStyle,
          'aria-label': 'Font family',
        },
        createElement('span', null, 'Arial'),
        createElement('span', { style: { fontSize: '10px', color: '#999' } }, '\u25BC'),
      ),
      // Format buttons group (Bold, Italic, Underline)
      createElement(
        'div',
        {
          key: '0',
          style: {
            display: 'flex',
            gap: '2px',
            borderLeft: '1px solid var(--color-border, #ccc)',
            paddingLeft: '10px',
          },
        },
        ...FORMAT_BUTTONS.map((btn) =>
          createElement(
            'button',
            {
              key: btn.id,
              style: makeToolBtnStyle(btn.id, btn.style),
              title: btn.shortcut ? `${btn.label} (${btn.shortcut})` : btn.label,
              'aria-label': btn.label,
              'aria-pressed': String(activeStates[btn.id] ?? false),
              onClick: togglers[btn.id],
              onMouseEnter: () => setHoveredToolBtn(btn.id),
              onMouseLeave: () => setHoveredToolBtn(''),
            },
            btn.text,
          ),
        ),
      ),
      // Font size
      createElement(
        'div',
        {
          key: '1',
          style: {
            display: 'flex',
            gap: '2px',
            borderLeft: '1px solid var(--color-border, #ccc)',
            paddingLeft: '10px',
          },
        },
        createElement(
          'button',
          {
            key: '0',
            style: makeToolBtnStyle('fontsize'),
            title: 'Font size',
            'aria-label': 'Font size',
            onMouseEnter: () => setHoveredToolBtn('fontsize'),
            onMouseLeave: () => setHoveredToolBtn(''),
          },
          '11',
        ),
      ),
      // Align buttons
      createElement(
        'div',
        {
          key: '2',
          style: {
            display: 'flex',
            gap: '2px',
            borderLeft: '1px solid var(--color-border, #ccc)',
            paddingLeft: '10px',
          },
        },
        ...ALIGN_BUTTONS.map((btn, bi) =>
          createElement(
            'button',
            {
              key: String(bi),
              style: makeToolBtnStyle(`align-${bi}`),
              title: btn.label,
              'aria-label': btn.label,
              onMouseEnter: () => setHoveredToolBtn(`align-${bi}`),
              onMouseLeave: () => setHoveredToolBtn(''),
            },
            btn.text,
          ),
        ),
      ),
    ),
    // Ruler
    createElement(
      'div',
      { className: 'word-processor__ruler', style: rulerStyle, 'aria-hidden': 'true' },
      ...rulerTicks,
    ),
    // Document Area
    createElement(
      'main',
      { className: 'word-processor__document-area', style: documentAreaStyle },
      createElement(
        'div',
        { className: 'word-processor__page', style: pageStyle },
        displayContent,
      ),
    ),
    // Status Bar
    createElement(
      'div',
      { className: 'word-processor__status-bar', style: statusBarStyle },
      createElement('span', null, 'Page 1 of 1'),
      createElement('span', null, `${wordCount} words`),
      createElement('span', null, '100%'),
    ),
  );
}
