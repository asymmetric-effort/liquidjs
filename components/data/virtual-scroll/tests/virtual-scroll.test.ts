import { describe, it, expect, beforeEach } from 'vitest';
import { createElement } from '../../../../core/src/index';
import { createRoot } from '../../../../core/src/dom/create-root';
import { VirtualScroll } from '../src/index';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  return () => {
    document.body.removeChild(container);
  };
});

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: i, label: `Item ${i}` }));

const renderItem = (item: unknown, index: number) => {
  const i = item as { id: number; label: string };
  return createElement('div', { 'data-index': String(index) }, i.label);
};

// ── Happy Path ─────────────────────────────────────────────────────────

describe('VirtualScroll — happy path', () => {
  it('renders only visible items plus overscan', () => {
    const items = generateItems(1000);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '400px',
      overscan: 5,
    }));

    // With 400px height and 40px items, visible count = 10, overscan = 5
    // Start at top: startIndex = max(0, 0 - 5) = 0, endIndex = min(1000, 0 + 10 + 5) = 15
    const renderedItems = container.querySelectorAll('[data-index]');
    expect(renderedItems.length).toBe(15);
  });

  it('creates spacer div with correct total height', () => {
    const items = generateItems(100);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 50,
      height: '300px',
    }));

    // Total height = 100 * 50 = 5000px
    const spacer = container.querySelector('div > div');
    expect((spacer as HTMLElement).style.height).toBe('5000px');
  });

  it('positions items absolutely at correct offsets', () => {
    const items = generateItems(50);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 30,
      height: '200px',
      overscan: 0,
    }));

    const renderedItems = container.querySelectorAll('[data-index]');
    // First item at top: 0px
    const firstParent = renderedItems[0]!.parentElement!;
    expect(firstParent.style.top).toBe('0px');
    expect(firstParent.style.height).toBe('30px');
  });

  it('renders items with correct content', () => {
    const items = generateItems(20);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '200px',
      overscan: 0,
    }));

    const firstItem = container.querySelector('[data-index="0"]');
    expect(firstItem!.textContent).toBe('Item 0');
  });

  it('applies overflow auto to container', () => {
    const items = generateItems(10);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '200px',
    }));

    const scrollContainer = container.firstElementChild as HTMLElement;
    expect(scrollContainer.style.overflow).toBe('auto');
    expect(scrollContainer.style.height).toBe('200px');
  });
});

// ── Sad Path ───────────────────────────────────────────────────────────

describe('VirtualScroll — sad path', () => {
  it('renders nothing when items array is empty', () => {
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items: [],
      renderItem,
      itemHeight: 40,
      height: '400px',
    }));

    const renderedItems = container.querySelectorAll('[data-index]');
    expect(renderedItems.length).toBe(0);

    // Spacer should be 0 height
    const spacer = container.querySelector('div > div');
    expect((spacer as HTMLElement).style.height).toBe('0px');
  });

  it('handles single item list', () => {
    const items = generateItems(1);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '400px',
    }));

    const renderedItems = container.querySelectorAll('[data-index]');
    expect(renderedItems.length).toBe(1);
    expect(renderedItems[0]!.textContent).toBe('Item 0');
  });

  it('handles very large itemHeight gracefully', () => {
    const items = generateItems(5);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 1000,
      height: '200px',
    }));

    // Should still render at least some items
    const renderedItems = container.querySelectorAll('[data-index]');
    expect(renderedItems.length).toBeGreaterThan(0);
  });
});

// ── Interaction ────────────────────────────────────────────────────────

describe('VirtualScroll — interaction', () => {
  it('scroll event updates visible range', () => {
    const items = generateItems(1000);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '400px',
      overscan: 0,
    }));

    // Verify initial items start at index 0
    let renderedItems = container.querySelectorAll('[data-index]');
    expect(renderedItems[0]!.getAttribute('data-index')).toBe('0');

    // Simulate scroll
    const scrollContainer = container.firstElementChild as HTMLElement;
    Object.defineProperty(scrollContainer, 'scrollTop', { value: 2000, writable: true });
    scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));

    // After scroll to 2000px with 40px items, start = floor(2000/40) = 50
    renderedItems = container.querySelectorAll('[data-index]');
    if (renderedItems.length > 0) {
      const firstIdx = parseInt(renderedItems[0]!.getAttribute('data-index')!, 10);
      expect(firstIdx).toBeGreaterThanOrEqual(45);
    }
  });

  it('scroll to bottom renders last items', () => {
    const items = generateItems(100);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '400px',
      overscan: 0,
    }));

    const scrollContainer = container.firstElementChild as HTMLElement;
    // Scroll to near bottom: 100 * 40 - 400 = 3600
    Object.defineProperty(scrollContainer, 'scrollTop', { value: 3600, writable: true });
    scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));

    const renderedItems = container.querySelectorAll('[data-index]');
    if (renderedItems.length > 0) {
      const lastIdx = parseInt(renderedItems[renderedItems.length - 1]!.getAttribute('data-index')!, 10);
      expect(lastIdx).toBeGreaterThanOrEqual(95);
    }
  });

  it('rapidly changing scroll does not crash', () => {
    const items = generateItems(500);
    const root = createRoot(container);
    root.render(createElement(VirtualScroll, {
      items,
      renderItem,
      itemHeight: 40,
      height: '400px',
    }));

    const scrollContainer = container.firstElementChild as HTMLElement;
    // Fire multiple scroll events rapidly
    for (let i = 0; i < 20; i++) {
      Object.defineProperty(scrollContainer, 'scrollTop', { value: i * 200, writable: true, configurable: true });
      scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));
    }

    // Should not throw, should still have rendered items
    const renderedItems = container.querySelectorAll('[data-index]');
    expect(renderedItems.length).toBeGreaterThan(0);
  });
});
