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
import { useMemo } from '../../../../core/src/hooks/index';

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

const BOTTOM_TABS = ['Terminal', 'Problems', 'Output'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function syntaxColor(line: string): string {
  if (line.startsWith('import') || line.startsWith('export')) return '#c586c0';
  if (line.includes('interface') || line.includes('function')) return '#dcdcaa';
  if (line.includes('const') || line.includes('return')) return '#569cd6';
  if (line.includes('//')) return '#6a9955';
  return '#d4d4d4';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IDE(props: IDEProps) {
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
    borderBottom: '1px solid #252526',
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
    borderRight: '1px solid #1e1e1e',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: '0',
    overflowY: 'auto',
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
    borderTop: '1px solid #007acc',
    cursor: 'pointer',
    border: 'none',
    borderBottom: 'none',
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
    borderLeft: '1px solid #252526',
    flexShrink: '0',
    padding: '8px 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const bottomPanelStyle: Record<string, string> = {
    height: '120px',
    backgroundColor: '#1e1e1e',
    borderTop: '1px solid #007acc',
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

  const bottomTabStyle = (active: boolean): Record<string, string> => ({
    padding: '0 12px',
    height: '28px',
    lineHeight: '28px',
    fontSize: '12px',
    color: active ? '#ffffff' : '#999999',
    cursor: 'pointer',
    borderBottom: active ? '1px solid #007acc' : '1px solid transparent',
    backgroundColor: 'transparent',
    border: 'none',
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
            ...SAMPLE_CODE.map((_, i) =>
              createElement('div', { key: String(i) }, String(i + 1)),
            ),
          ),
          // Code
          createElement(
            'code',
            { style: codeAreaStyle },
            ...SAMPLE_CODE.map((line, i) =>
              createElement(
                'div',
                { key: String(i), style: { color: syntaxColor(line) } },
                line || '\u00A0',
              ),
            ),
          ),
        ),
      ),
      // Minimap
      createElement(
        'div',
        { className: 'ide__minimap', style: minimapStyle, 'aria-hidden': 'true' },
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
              style: bottomTabStyle(i === 0),
              role: 'tab',
              'aria-selected': i === 0 ? 'true' : 'false',
              'aria-label': tab,
            },
            tab,
          ),
        ),
      ),
      createElement(
        'div',
        { style: terminalContentStyle, role: 'log' },
        ...TERMINAL_LINES.map((line, i) =>
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
        createElement('span', null, '\u{2387} main'),
        createElement('span', null, '0 errors'),
        createElement('span', null, '0 warnings'),
      ),
      createElement(
        'div',
        { style: { display: 'flex', gap: '16px' } },
        createElement('span', null, 'Ln 1, Col 1'),
        createElement('span', null, 'UTF-8'),
        createElement('span', null, 'TypeScript'),
      ),
    ),
  );
}
