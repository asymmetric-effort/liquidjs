// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { describe, it, expect, beforeEach } from 'vitest';
import { UnityDesktop } from '../src/index';
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

describe('UnityDesktop', () => {
  it('renders without error', () => {
    const el = render(createElement(UnityDesktop, null));
    expect(el.querySelector('.unity-desktop')).not.toBeNull();
  });

  it('contains left launcher sidebar', () => {
    const el = render(createElement(UnityDesktop, null));
    const launcher = el.querySelector('.unity-desktop__launcher');
    expect(launcher).not.toBeNull();
    expect(launcher?.tagName).toBe('NAV');
  });

  it('contains top panel bar', () => {
    const el = render(createElement(UnityDesktop, null));
    const topPanel = el.querySelector('.unity-desktop__top-panel');
    expect(topPanel).not.toBeNull();
  });

  it('contains desktop area', () => {
    const el = render(createElement(UnityDesktop, null));
    const desktop = el.querySelector('.unity-desktop__desktop');
    expect(desktop).not.toBeNull();
    expect(desktop?.tagName).toBe('MAIN');
  });

  it('renders children in desktop area', () => {
    const el = render(
      createElement(UnityDesktop, null,
        createElement('span', { className: 'test-child' }, 'Hello Desktop'),
      ),
    );
    const child = el.querySelector('.unity-desktop__desktop .test-child');
    expect(child).not.toBeNull();
    expect(child?.textContent).toBe('Hello Desktop');
  });

  it('has Activities text in top panel', () => {
    const el = render(createElement(UnityDesktop, null));
    const topPanel = el.querySelector('.unity-desktop__top-panel');
    expect(topPanel?.textContent).toContain('Activities');
  });

  it('has clock display in top panel', () => {
    const el = render(createElement(UnityDesktop, null));
    const topPanel = el.querySelector('.unity-desktop__top-panel');
    const text = topPanel?.textContent ?? '';
    // Clock should contain a time pattern like HH:MM
    expect(text).toMatch(/\d{2}:\d{2}/);
  });

  it('has launcher icon buttons', () => {
    const el = render(createElement(UnityDesktop, null));
    const launcher = el.querySelector('.unity-desktop__launcher');
    const buttons = launcher?.querySelectorAll('button');
    // 8 app icons + 1 Show Applications = 9 buttons
    expect(buttons?.length).toBe(9);
  });

  it('has Show Applications button', () => {
    const el = render(createElement(UnityDesktop, null));
    const launcher = el.querySelector('.unity-desktop__launcher');
    const buttons = launcher?.querySelectorAll('button');
    const showApps = Array.from(buttons ?? []).find(
      (btn) => btn.getAttribute('aria-label') === 'Show Applications',
    );
    expect(showApps).not.toBeUndefined();
  });

  it('applies className', () => {
    const el = render(createElement(UnityDesktop, { className: 'custom-class' }));
    const root = el.querySelector('.unity-desktop');
    expect(root?.classList.contains('custom-class')).toBe(true);
  });

  it('has correct background styling on desktop area', () => {
    const el = render(createElement(UnityDesktop, null));
    const desktop = el.querySelector('.unity-desktop__desktop') as HTMLElement;
    expect(desktop.style.background).toContain('linear-gradient');
  });

  it('has aria-label on launcher for accessibility', () => {
    const el = render(createElement(UnityDesktop, null));
    const launcher = el.querySelector('.unity-desktop__launcher');
    expect(launcher?.getAttribute('aria-label')).toBe('Application launcher');
  });

  it('has launcher icon labels for accessibility', () => {
    const el = render(createElement(UnityDesktop, null));
    const launcher = el.querySelector('.unity-desktop__launcher');
    const buttons = launcher?.querySelectorAll('button');
    const labels = Array.from(buttons ?? []).map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Files');
    expect(labels).toContain('Terminal');
    expect(labels).toContain('Settings');
  });
});
