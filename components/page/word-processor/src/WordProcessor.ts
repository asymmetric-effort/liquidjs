// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * WordProcessor -- Full-screen layout resembling a word processor application.
 *
 * Features a menu bar, formatting toolbar, ruler bar, centered document page
 * on a gray background, and a status bar with page/word count and zoom.
 */

import { createElement } from '../../../../core/src/index';
import { useMemo } from '../../../../core/src/hooks/index';

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

const TOOLBAR_GROUPS: Array<Array<{ label: string; text: string; style?: Record<string, string> }>> = [
  [
    { label: 'Bold', text: 'B', style: { fontWeight: '700' } },
    { label: 'Italic', text: 'I', style: { fontStyle: 'italic' } },
    { label: 'Underline', text: 'U', style: { textDecoration: 'underline' } },
  ],
  [
    { label: 'Font size', text: '11' },
  ],
  [
    { label: 'Align left', text: '\u2261' },
    { label: 'Align center', text: '\u2263' },
    { label: 'Align right', text: '\u2262' },
  ],
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WordProcessor(props: WordProcessorProps) {
  const containerStyle = useMemo<Record<string, string>>(() => ({
    width: '100%',
    height: '100%',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    fontSize: '13px',
    color: '#333',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  }), []);

  const menuBarStyle: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d0d0d0',
    padding: '0 8px',
    gap: '2px',
    flexShrink: '0',
  };

  const menuItemStyle: Record<string, string> = {
    padding: '4px 10px',
    cursor: 'pointer',
    borderRadius: '3px',
    fontSize: '13px',
    color: '#333',
    backgroundColor: 'transparent',
    border: 'none',
    lineHeight: '1',
  };

  const toolbarStyle: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    height: '36px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #d0d0d0',
    padding: '0 12px',
    gap: '12px',
    flexShrink: '0',
  };

  const toolBtnStyle: Record<string, string> = {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
    backgroundColor: 'transparent',
    color: '#444',
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
  };

  const pageStyle: Record<string, string> = {
    width: '680px',
    minHeight: '880px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    padding: '72px 72px 96px 72px',
    boxSizing: 'border-box',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#222',
    fontFamily: '"Times New Roman", Georgia, serif',
  };

  const statusBarStyle: Record<string, string> = {
    height: '24px',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #ccc',
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
  const wordCount = displayContent.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

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
            style: menuItemStyle,
            role: 'menuitem',
            'aria-label': menu,
          },
          menu,
        ),
      ),
    ),
    // Toolbar
    createElement(
      'div',
      { className: 'word-processor__toolbar', style: toolbarStyle, role: 'toolbar', 'aria-label': 'Formatting toolbar' },
      ...TOOLBAR_GROUPS.map((group, gi) =>
        createElement(
          'div',
          {
            key: String(gi),
            style: {
              display: 'flex',
              gap: '2px',
              ...(gi > 0 ? { borderLeft: '1px solid #ccc', paddingLeft: '10px' } : {}),
            },
          },
          ...group.map((btn, bi) =>
            createElement(
              'button',
              {
                key: String(bi),
                style: { ...toolBtnStyle, ...(btn.style ?? {}) },
                title: btn.label,
                'aria-label': btn.label,
              },
              btn.text,
            ),
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
