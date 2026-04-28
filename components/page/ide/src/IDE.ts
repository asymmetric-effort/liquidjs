// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * IDE -- Full-screen layout resembling a programmer's IDE (VS Code style).
 *
 * Features a title bar, menu bar, left sidebar file explorer, main editor
 * area with line numbers and syntax-highlighted TypeScript, a right minimap
 * strip, a bottom terminal panel, and a status bar.
 */

import { createElement } from '../../../../core/src/index';
import { useState, useEffect, useMemo, useCallback } from '../../../../core/src/hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IDEProps {
  /** Extra class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MENUS = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

const FILE_TREE: Array<{ name: string; indent: number; isFolder: boolean }> = [
  { name: 'src', indent: 0, isFolder: true },
  { name: 'components', indent: 1, isFolder: true },
  { name: 'App.ts', indent: 2, isFolder: false },
  { name: 'Header.ts', indent: 2, isFolder: false },
  { name: 'hooks', indent: 1, isFolder: true },
  { name: 'useAuth.ts', indent: 2, isFolder: false },
  { name: 'index.ts', indent: 1, isFolder: false },
  { name: 'main.ts', indent: 1, isFolder: false },
  { name: 'types.ts', indent: 1, isFolder: false },
  { name: 'package.json', indent: 0, isFolder: false },
  { name: 'tsconfig.json', indent: 0, isFolder: false },
];

const SAMPLE_CODE = [
  'import { createElement, useState } from "specifyjs";',
  '',
  'interface AppProps {',
  '  title: string;',
  '  version?: number;',
  '}',
  '',
  'export function App(props: AppProps) {',
  '  const [count, setCount] = useState(0);',
  '',
  '  const increment = () => {',
  '    setCount((prev: number) => prev + 1);',
  '  };',
  '',
  '  return createElement(',
  '    "div",',
  '    { className: "app" },',
  '    createElement("h1", null, props.title),',
  '    createElement("p", null, `Count: ${count}`),',
  '    createElement(',
  '      "button",',
  '      { onClick: increment },',
  '      "Increment",',
  '    ),',
  '  );',
  '}',
];

const TERMINAL_LINES = [
  '$ npm run dev',
  '',
  '> specifyjs-app@1.0.0 dev',
  '> vite',
  '',
  '  VITE v5.4.0  ready in 234ms',
  '',
  '  \u27A4  Local:   http://localhost:5173/',
  '  \u27A4  Network: http://192.168.1.42:5173/',
  '  \u27A4  press h + enter to show help',
];

const PROBLEMS_LINES = [
  'No problems detected in workspace.',
];

const OUTPUT_LINES = [
  '[Info] TypeScript compiler watching for changes...',
  '[Info] Build completed successfully.',
];

const BOTTOM_TABS = ['Terminal', 'Problems', 'Output'];

const BOTTOM_TAB_CONTENT: Record<string, Array<string>> = {
  Terminal: TERMINAL_LINES,
  Problems: PROBLEMS_LINES,
  Output: OUTPUT_LINES,
};

// Current line highlight index (0-based)
const CURRENT_LINE = 8;

// Cursor position: line index and character offset
const CURSOR_LINE = 8;

// ---------------------------------------------------------------------------
// Syntax Highlighting
// ---------------------------------------------------------------------------

interface Token {
  text: string;
  color: string;
}

const KEYWORDS = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'for', 'while', 'class', 'new', 'throw', 'try', 'catch',
  'finally', 'typeof', 'instanceof', 'in', 'of', 'default', 'switch', 'case',
  'break', 'continue', 'do', 'void', 'delete', 'yield', 'async', 'await',
]);

const TYPES = new Set([
  'string', 'number', 'boolean', 'void', 'null', 'undefined', 'any', 'never',
  'unknown', 'object', 'interface', 'type', 'enum',
]);

const COL_KEYWORD = '#569cd6';
const COL_STRING = '#ce9178';
const COL_TYPE = '#4ec9b0';
const COL_COMMENT = '#6a9955';
const COL_FUNCTION = '#dcdcaa';
const COL_DEFAULT = '#d4d4d4';
const COL_PUNCTUATION = '#d4d4d4';
const COL_NUMBER = '#b5cea8';

function tokenizeLine(line: string): Array<Token> {
  if (!line.trim()) return [{ text: '\u00A0', color: COL_DEFAULT }];

  const tokens: Array<Token> = [];
  let i = 0;

  while (i < line.length) {
    // Comments
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), color: COL_COMMENT });
      break;
    }

    // Strings (double or single quoted)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === '\\') j++; // skip escaped
        j++;
      }
      j = Math.min(j + 1, line.length);
      tokens.push({ text: line.slice(i, j), color: COL_STRING });
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(line[i]) && (i === 0 || /[\s(,=:[\]{}+\-*/]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: COL_NUMBER });
      i = j;
      continue;
    }

    // Identifiers / keywords
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);

      // Check if followed by '(' to detect function calls
      let nextNonSpace = j;
      while (nextNonSpace < line.length && line[nextNonSpace] === ' ') nextNonSpace++;
      const isCall = nextNonSpace < line.length && line[nextNonSpace] === '(';

      let color = COL_DEFAULT;
      if (KEYWORDS.has(word)) {
        color = COL_KEYWORD;
      } else if (TYPES.has(word)) {
        color = COL_TYPE;
      } else if (isCall) {
        color = COL_FUNCTION;
      } else if (word === 'true' || word === 'false') {
        color = COL_KEYWORD;
      }
      tokens.push({ text: word, color });
      i = j;
      continue;
    }

    // Whitespace
    if (line[i] === ' ' || line[i] === '\t') {
      let j = i;
      while (j < line.length && (line[j] === ' ' || line[j] === '\t')) j++;
      tokens.push({ text: line.slice(i, j), color: COL_DEFAULT });
      i = j;
      continue;
    }

    // Punctuation / operators
    tokens.push({ text: line[i], color: COL_PUNCTUATION });
    i++;
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IDE(props: IDEProps) {
  const [activeBottomTab, setActiveBottomTab] = useState('Terminal');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev: boolean) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleBottomTabClick = useCallback((tab: string) => {
    setActiveBottomTab(tab);
  }, []);

  const containerStyle = useMemo<Record<string, string>>(() => ({
    width: '100%',
    height: '100%',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    fontSize: '13px',
    color: '#cccccc',
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  }), []);

  const titleBarStyle: Record<string, string> = {
    height: '30px',
    backgroundColor: '#323233',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#999',
    flexShrink: '0',
    borderBottom: '1px solid var(--color-border, #252526)',
  };

  const menuBarStyle: Record<string, string> = {
    height: '28px',
    backgroundColor: '#3c3c3c',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    gap: '2px',
    flexShrink: '0',
  };

  const menuItemStyle: Record<string, string> = {
    padding: '3px 8px',
    fontSize: '12px',
    color: '#cccccc',
    cursor: 'pointer',
    borderRadius: '3px',
    backgroundColor: 'transparent',
    border: 'none',
  };

  const mainAreaStyle: Record<string, string> = {
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
  };

  const sidebarStyle: Record<string, string> = {
    width: '220px',
    backgroundColor: '#252526',
    borderRight: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: '0',
    overflowY: 'auto',
  };

  const sidebarResizeHandleStyle: Record<string, string> = {
    width: '1px',
    backgroundColor: '#007acc',
    cursor: 'col-resize',
    flexShrink: '0',
    opacity: '0.4',
    transition: 'opacity 0.2s',
  };

  const sidebarHeaderStyle: Record<string, string> = {
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#bbbbbb',
  };

  const fileItemStyle = (indent: number, isFolder: boolean): Record<string, string> => ({
    padding: '3px 8px',
    paddingLeft: `${12 + indent * 16}px`,
    fontSize: '13px',
    cursor: 'pointer',
    color: isFolder ? '#cccccc' : '#d4d4d4',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    borderRadius: '3px',
    margin: '0 4px',
    transition: 'background-color 0.1s',
  });

  const editorAreaStyle: Record<string, string> = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const editorTabBarStyle: Record<string, string> = {
    height: '35px',
    backgroundColor: '#252526',
    display: 'flex',
    alignItems: 'center',
    flexShrink: '0',
  };

  const activeTabStyle: Record<string, string> = {
    padding: '0 16px',
    height: '35px',
    lineHeight: '35px',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    borderBottom: '2px solid #007acc',
    boxSizing: 'border-box',
  };

  const editorContentStyle: Record<string, string> = {
    flex: '1',
    display: 'flex',
    overflow: 'auto',
    backgroundColor: '#1e1e1e',
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    fontSize: '13px',
    lineHeight: '20px',
  };

  const lineNumbersStyle: Record<string, string> = {
    padding: '8px 0',
    textAlign: 'right',
    color: '#858585',
    userSelect: 'none',
    minWidth: '48px',
    paddingRight: '12px',
    paddingLeft: '12px',
    flexShrink: '0',
  };

  const codeAreaStyle: Record<string, string> = {
    padding: '8px 0',
    flex: '1',
    whiteSpace: 'pre',
    overflowX: 'auto',
  };

  const minimapStyle: Record<string, string> = {
    width: '60px',
    backgroundColor: '#1e1e1e',
    borderLeft: '1px solid var(--color-border, #252526)',
    flexShrink: '0',
    padding: '8px 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    position: 'relative',
  };

  const bottomPanelStyle: Record<string, string> = {
    height: '120px',
    backgroundColor: '#1e1e1e',
    borderTop: '1px solid var(--color-border, #007acc)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: '0',
  };

  const bottomTabBarStyle: Record<string, string> = {
    height: '28px',
    backgroundColor: '#252526',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    flexShrink: '0',
  };

  const bottomTabStyleFn = (active: boolean): Record<string, string> => ({
    padding: '0 12px',
    height: '28px',
    lineHeight: '28px',
    fontSize: '12px',
    color: active ? '#ffffff' : '#999999',
    cursor: 'pointer',
    borderBottom: active ? '1px solid #007acc' : '1px solid transparent',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'color 0.15s',
  });

  const terminalContentStyle: Record<string, string> = {
    flex: '1',
    padding: '4px 12px',
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    fontSize: '12px',
    lineHeight: '18px',
    color: '#cccccc',
    overflowY: 'auto',
    whiteSpace: 'pre',
  };

  const statusBarStyle: Record<string, string> = {
    height: '22px',
    backgroundColor: '#007acc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    fontSize: '12px',
    color: '#ffffff',
    flexShrink: '0',
  };

  const statusItemStyle: Record<string, string> = {
    cursor: 'pointer',
    padding: '0 6px',
    borderRadius: '3px',
    transition: 'background-color 0.15s',
  };

  // Minimap viewport indicator position (approx lines 1-15 visible out of 25)
  const viewportTop = 8;
  const viewportHeight = 30;

  // Get the content lines for the active bottom tab
  const activeContent = BOTTOM_TAB_CONTENT[activeBottomTab] ?? TERMINAL_LINES;

  // Build code lines with syntax highlighting and cursor
  const codeLines = SAMPLE_CODE.map((line, i) => {
    const tokens = tokenizeLine(line);
    const spans: Array<unknown> = [];
    let spanIdx = 0;
    for (const token of tokens) {
      spans.push(
        createElement('span', {
          key: String(spanIdx++),
          style: { color: token.color },
        }, token.text),
      );
    }

    // Add blinking cursor at end of cursor line
    if (i === CURSOR_LINE) {
      spans.push(
        createElement('span', {
          key: 'cursor',
          style: {
            borderLeft: '2px solid #aeafad',
            marginLeft: '1px',
            visibility: cursorVisible ? 'visible' : 'hidden',
          },
        }, ''),
      );
    }

    const isCurrentLine = i === CURRENT_LINE;
    return createElement(
      'div',
      {
        key: String(i),
        style: {
          backgroundColor: isCurrentLine ? 'rgba(255,255,255,0.04)' : 'transparent',
          minHeight: '20px',
        },
      },
      ...spans,
    );
  });

  // Build line number elements with current line highlight
  const lineNumbers = SAMPLE_CODE.map((_, i) => {
    const isCurrentLine = i === CURRENT_LINE;
    return createElement('div', {
      key: String(i),
      style: {
        color: isCurrentLine ? '#c6c6c6' : '#858585',
        backgroundColor: isCurrentLine ? 'rgba(255,255,255,0.04)' : 'transparent',
      },
    }, String(i + 1));
  });

  return createElement(
    'div',
    {
      className: `ide ${props.className ?? ''}`.trim(),
      style: containerStyle,
    },
    // Title Bar
    createElement(
      'div',
      { className: 'ide__title-bar', style: titleBarStyle },
      'SpecifyJS IDE',
    ),
    // Menu Bar
    createElement(
      'div',
      { className: 'ide__menu-bar', style: menuBarStyle, role: 'menubar' },
      ...MENUS.map((menu, i) =>
        createElement(
          'button',
          { key: String(i), style: menuItemStyle, role: 'menuitem', 'aria-label': menu },
          menu,
        ),
      ),
    ),
    // Main Area
    createElement(
      'div',
      { style: mainAreaStyle },
      // Sidebar
      createElement(
        'nav',
        { className: 'ide__sidebar', style: sidebarStyle, 'aria-label': 'File explorer' },
        createElement('div', { style: sidebarHeaderStyle }, 'Explorer'),
        ...FILE_TREE.map((item, i) =>
          createElement(
            'div',
            { key: String(i), style: fileItemStyle(item.indent, item.isFolder) },
            item.isFolder ? '\u{1F4C1} ' : '\u{1F4C4} ',
            item.name,
          ),
        ),
      ),
      // Resize handle between sidebar and editor
      createElement('div', { style: sidebarResizeHandleStyle }),
      // Editor Area
      createElement(
        'div',
        { style: editorAreaStyle },
        // Tab Bar
        createElement(
          'div',
          { style: editorTabBarStyle },
          createElement('button', { style: activeTabStyle, 'aria-label': 'App.ts' }, 'App.ts'),
        ),
        // Editor Content
        createElement(
          'div',
          { style: editorContentStyle },
          // Line Numbers
          createElement(
            'div',
            { style: lineNumbersStyle, 'aria-hidden': 'true' },
            ...lineNumbers,
          ),
          // Code
          createElement(
            'code',
            { style: codeAreaStyle },
            ...codeLines,
          ),
        ),
      ),
      // Minimap
      createElement(
        'div',
        { className: 'ide__minimap', style: minimapStyle, 'aria-hidden': 'true' },
        // Viewport indicator
        createElement('div', {
          style: {
            position: 'absolute',
            top: `${viewportTop}px`,
            left: '0',
            right: '0',
            height: `${viewportHeight}px`,
            backgroundColor: 'rgba(100, 100, 200, 0.15)',
            border: '1px solid rgba(100, 100, 200, 0.3)',
            borderRadius: '2px',
            pointerEvents: 'none',
          },
        }),
        ...SAMPLE_CODE.map((line, i) =>
          createElement('div', {
            key: String(i),
            style: {
              height: '2px',
              backgroundColor: line.trim() ? '#555555' : 'transparent',
              borderRadius: '1px',
              width: `${Math.min(100, line.length * 2)}%`,
            },
          }),
        ),
      ),
    ),
    // Bottom Panel
    createElement(
      'div',
      { className: 'ide__bottom-panel', style: bottomPanelStyle },
      createElement(
        'div',
        { style: bottomTabBarStyle, role: 'tablist' },
        ...BOTTOM_TABS.map((tab, i) =>
          createElement(
            'button',
            {
              key: String(i),
              style: bottomTabStyleFn(tab === activeBottomTab),
              role: 'tab',
              'aria-selected': tab === activeBottomTab ? 'true' : 'false',
              'aria-label': tab,
              onClick: () => handleBottomTabClick(tab),
            },
            tab,
          ),
        ),
      ),
      createElement(
        'div',
        { style: terminalContentStyle, role: 'log' },
        ...activeContent.map((line, i) =>
          createElement('div', { key: String(i) }, line || '\u00A0'),
        ),
      ),
    ),
    // Status Bar
    createElement(
      'div',
      { className: 'ide__status-bar', style: statusBarStyle },
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px' } },
        createElement('span', { style: statusItemStyle }, '\u{2387} main'),
        createElement('span', { style: statusItemStyle }, '0 errors'),
        createElement('span', { style: statusItemStyle }, '0 warnings'),
      ),
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px' } },
        createElement('span', { style: statusItemStyle }, 'Ln 1, Col 1'),
        createElement('span', { style: statusItemStyle }, 'UTF-8'),
        createElement('span', { style: statusItemStyle }, 'TypeScript'),
      ),
    ),
  );
}
