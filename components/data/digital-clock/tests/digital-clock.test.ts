// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DigitalClock } from '../src/index';
import { createElement } from '../../../../core/src/index';
import { createRoot } from '../../../../core/src/dom/create-root';

function render(vnode: unknown): { container: HTMLElement; root: ReturnType<typeof createRoot> } {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(vnode as any);
  return { container, root };
}

describe('DigitalClock', () => {
  describe('happy paths', () => {
    it('renders with defaults (12h format, shows seconds)', () => {
      const { container } = render(createElement(DigitalClock, {}));
      const wrapper = container.querySelector('div');
      expect(wrapper).toBeTruthy();
      // Should have a time span
      const timeSpan = wrapper!.querySelector('span');
      expect(timeSpan).toBeTruthy();
      // Time text should contain colons (HH:MM:SS)
      const text = timeSpan!.textContent ?? '';
      // Should have seconds (two colons)
      expect((text.match(/:/g) || []).length).toBeGreaterThanOrEqual(2);
    });

    it('displays AM for morning hours', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 9, 30, 45)); // 9:30:45 AM
      const { container } = render(createElement(DigitalClock, { format: '12h' }));
      expect(container.textContent).toContain('AM');
      vi.useRealTimers();
    });

    it('displays PM for afternoon hours', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 14, 30, 45)); // 2:30:45 PM
      const { container } = render(createElement(DigitalClock, { format: '12h' }));
      expect(container.textContent).toContain('PM');
      vi.useRealTimers();
    });

    it('shows time in 24h format when format="24h"', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 14, 30, 45));
      const { container } = render(createElement(DigitalClock, { format: '24h' }));
      // Should NOT have AM/PM
      expect(container.textContent).not.toContain('AM');
      expect(container.textContent).not.toContain('PM');
      // Should show 14:30
      expect(container.textContent).toContain('14:30');
      vi.useRealTimers();
    });

    it('shows date when showDate=true with short format', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 10, 0, 0));
      const { container } = render(createElement(DigitalClock, { showDate: true, dateFormat: 'short' }));
      // Short format: MM/DD/YYYY
      expect(container.textContent).toContain('04/25/2026');
      vi.useRealTimers();
    });

    it('shows date with long format', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 10, 0, 0));
      const { container } = render(createElement(DigitalClock, { showDate: true, dateFormat: 'long' }));
      expect(container.textContent).toContain('April');
      expect(container.textContent).toContain('2026');
      vi.useRealTimers();
    });

    it('shows date with iso format', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 10, 0, 0));
      const { container } = render(createElement(DigitalClock, { showDate: true, dateFormat: 'iso' }));
      expect(container.textContent).toContain('2026-04-25');
      vi.useRealTimers();
    });

    it('hides seconds when showSeconds=false', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 10, 30, 45));
      const { container } = render(createElement(DigitalClock, { showSeconds: false }));
      const timeSpan = container.querySelector('span');
      const text = timeSpan!.textContent ?? '';
      // Should only have one colon (HH:MM) without AM/PM span
      // Filter out the AM/PM child span text
      const timeOnly = text.replace(/[AP]M/, '').trim();
      expect((timeOnly.match(/:/g) || []).length).toBe(1);
      vi.useRealTimers();
    });

    it('renders with custom className', () => {
      const { container } = render(createElement(DigitalClock, { className: 'my-clock' }));
      const wrapper = container.querySelector('.my-clock');
      expect(wrapper).toBeTruthy();
    });
  });

  describe('sad paths', () => {
    it('handles invalid timezone gracefully (throws RangeError)', () => {
      // Invalid timezone causes Intl.DateTimeFormat to throw RangeError
      expect(() => {
        render(createElement(DigitalClock, { timezone: 'Invalid/Timezone' }));
      }).toThrow(RangeError);
    });

    it('handles missing props (renders with all defaults)', () => {
      const { container } = render(createElement(DigitalClock, {}));
      const wrapper = container.querySelector('div');
      expect(wrapper).toBeTruthy();
      // Should render time text
      expect(wrapper!.textContent!.length).toBeGreaterThan(0);
    });
  });

  describe('interaction', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 3, 25, 10, 30, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('sets up a 1-second interval for updates', () => {
      const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
      render(createElement(DigitalClock, { format: '24h', showSeconds: true }));
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
      setIntervalSpy.mockRestore();
    });

    it('cleans up interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
      const { root } = render(createElement(DigitalClock, {}));
      root.unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
