// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { describe, it, expect, beforeEach } from 'vitest';
import { IDE } from '../src/index';
import { createElement } from '../../../../core/src/index';
import { createRoot } from '../../../../core/src/dom/create-root';

let container: HTMLDivElement;

function render(vnode: unknown): HTMLElement {
  container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(vnode as ReturnType<typeof createElement>);
  return container;
}

beforeEach(() => {
  return () => {
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
  };
});

describe('IDE', () => {
  it('renders without error', () => {
    const el = render(createElement(IDE, null));
    expect(el.querySelector('.ide')).not.toBeNull();
  });

  it('contains title bar with "SpecifyJS IDE"', () => {
    const el = render(createElement(IDE, null));
    const titleBar = el.querySelector('.ide__title-bar');
    expect(titleBar).not.toBeNull();
    expect(titleBar?.textContent).toBe('SpecifyJS IDE');
  });

  it('contains menu bar', () => {
    const el = render(createElement(IDE, null));
    const menuBar = el.querySelector('.ide__menu-bar');
    expect(menuBar).not.toBeNull();
    expect(menuBar?.getAttribute('role')).toBe('menubar');
  });

  it('contains file explorer sidebar', () => {
    const el = render(createElement(IDE, null));
    const sidebar = el.querySelector('.ide__sidebar');
    expect(sidebar).not.toBeNull();
    expect(sidebar?.getAttribute('aria-label')).toBe('File explorer');
    expect(sidebar?.textContent).toContain('Explorer');
  });

  it('contains editor area with line numbers', () => {
    const el = render(createElement(IDE, null));
    // Line numbers are in a div with aria-hidden
    const lineNums = el.querySelector('[aria-hidden="true"]');
    expect(lineNums).not.toBeNull();
    expect(lineNums?.textContent).toContain('1');
    expect(lineNums?.textContent).toContain('5');
  });

  it('contains sample code', () => {
    const el = render(createElement(IDE, null));
    const code = el.querySelector('code');
    expect(code).not.toBeNull();
    expect(code?.textContent).toContain('import');
    expect(code?.textContent).toContain('specifyjs');
  });

  it('contains minimap', () => {
    const el = render(createElement(IDE, null));
    const minimap = el.querySelector('.ide__minimap');
    expect(minimap).not.toBeNull();
    expect(minimap?.getAttribute('aria-hidden')).toBe('true');
  });

  it('contains bottom panel', () => {
    const el = render(createElement(IDE, null));
    const bottomPanel = el.querySelector('.ide__bottom-panel');
    expect(bottomPanel).not.toBeNull();
  });

  it('contains status bar', () => {
    const el = render(createElement(IDE, null));
    const statusBar = el.querySelector('.ide__status-bar');
    expect(statusBar).not.toBeNull();
    const text = statusBar?.textContent ?? '';
    expect(text).toContain('TypeScript');
    expect(text).toContain('UTF-8');
  });

  it('has terminal output in bottom panel', () => {
    const el = render(createElement(IDE, null));
    const bottomPanel = el.querySelector('.ide__bottom-panel');
    const text = bottomPanel?.textContent ?? '';
    expect(text).toContain('npm run dev');
    expect(text).toContain('localhost:5173');
  });

  it('applies className', () => {
    const el = render(createElement(IDE, { className: 'my-ide' }));
    const root = el.querySelector('.ide');
    expect(root?.classList.contains('my-ide')).toBe(true);
  });

  it('menu bar contains expected menu items', () => {
    const el = render(createElement(IDE, null));
    const menuBar = el.querySelector('.ide__menu-bar');
    const text = menuBar?.textContent ?? '';
    expect(text).toContain('File');
    expect(text).toContain('Edit');
    expect(text).toContain('Terminal');
    expect(text).toContain('Help');
  });

  it('sidebar lists file tree entries', () => {
    const el = render(createElement(IDE, null));
    const sidebar = el.querySelector('.ide__sidebar');
    const text = sidebar?.textContent ?? '';
    expect(text).toContain('App.ts');
    expect(text).toContain('package.json');
    expect(text).toContain('src');
  });

  it('bottom panel has tab buttons', () => {
    const el = render(createElement(IDE, null));
    const bottomPanel = el.querySelector('.ide__bottom-panel');
    const tabs = bottomPanel?.querySelectorAll('[role="tab"]');
    expect(tabs?.length).toBe(3);
    const labels = Array.from(tabs ?? []).map((t) => t.getAttribute('aria-label'));
    expect(labels).toContain('Terminal');
    expect(labels).toContain('Problems');
    expect(labels).toContain('Output');
  });
});
