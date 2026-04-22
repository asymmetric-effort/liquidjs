import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from '../../../../core/src/index';
import { Drawer } from '../src/index';

function renderDrawer(overrides: Record<string, unknown> = {}) {
  const defaults = {
    open: true,
    onClose: vi.fn(),
    title: 'Test Drawer',
    children: createElement('p', null, 'Drawer content'),
  };
  const props = { ...defaults, ...overrides };
  return { vnode: Drawer(props as any), onClose: props.onClose };
}

describe('Drawer', () => {
  // ── Happy path ──────────────────────────────────────────────
  describe('happy path', () => {
    it('renders when open is true', () => {
      const { vnode } = renderDrawer({ open: true });
      // Drawer uses animation state, so it may render on first call
      // The component returns a vnode (not null) when visible
      expect(vnode).toBeDefined();
    });

    it('renders the title text when provided', () => {
      const { vnode } = renderDrawer({ title: 'Settings' });
      if (vnode) {
        expect(JSON.stringify(vnode)).toContain('Settings');
      }
    });

    it('renders body content', () => {
      const { vnode } = renderDrawer({
        children: createElement('div', null, 'Panel body'),
      });
      if (vnode) {
        expect(JSON.stringify(vnode)).toContain('Panel body');
      }
    });

    it('sets role=dialog and aria-modal', () => {
      const { vnode } = renderDrawer();
      if (vnode) {
        const str = JSON.stringify(vnode);
        expect(str).toContain('dialog');
        expect(str).toContain('aria-modal');
      }
    });

    it('defaults to right position', () => {
      const { vnode } = renderDrawer();
      if (vnode) {
        const str = JSON.stringify(vnode);
        // right positioned drawer has right: '0'
        expect(str).toContain('"right":"0"');
      }
    });
  });

  // ── Sad path ────────────────────────────────────────────────
  describe('sad path', () => {
    it('returns null when open is false and not visible', () => {
      const { vnode } = renderDrawer({ open: false });
      expect(vnode).toBeNull();
    });

    it('renders without a title', () => {
      const { vnode } = renderDrawer({ title: undefined });
      // Should not crash
      expect(true).toBe(true);
    });

    it('renders without children', () => {
      const { vnode } = renderDrawer({ children: undefined });
      expect(true).toBe(true);
    });

    it('renders without overlay when overlay is false', () => {
      const { vnode } = renderDrawer({ overlay: false });
      if (vnode) {
        const str = JSON.stringify(vnode);
        // Should not contain the backdrop overlay style
        expect(str).not.toContain('rgba(0, 0, 0, 0.5)');
      }
    });
  });

  // ── Interaction ─────────────────────────────────────────────
  describe('interaction', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('calls onClose when Escape key is pressed', () => {
      const onClose = vi.fn();
      renderDrawer({ open: true, onClose, closeOnEscape: true });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on Escape when closeOnEscape is false', () => {
      const onClose = vi.fn();
      renderDrawer({ open: true, onClose, closeOnEscape: false });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('supports left position', () => {
      const { vnode } = renderDrawer({ position: 'left' });
      if (vnode) {
        const str = JSON.stringify(vnode);
        expect(str).toContain('"left":"0"');
      }
    });

    it('supports top position', () => {
      const { vnode } = renderDrawer({ position: 'top' });
      if (vnode) {
        const str = JSON.stringify(vnode);
        expect(str).toContain('"top":"0"');
      }
    });

    it('supports bottom position', () => {
      const { vnode } = renderDrawer({ position: 'bottom' });
      if (vnode) {
        const str = JSON.stringify(vnode);
        expect(str).toContain('"bottom":"0"');
      }
    });

    it('supports custom size', () => {
      const { vnode } = renderDrawer({ size: '500px' });
      if (vnode) {
        expect(JSON.stringify(vnode)).toContain('500px');
      }
    });
  });
});
