import { describe, it, expect, vi } from 'vitest';
import { TimePicker } from '../src/index';
import { createElement } from '../../../../core/src/index';
import { createRoot } from '../../../../core/src/dom/create-root';
import * as hooks from '../../../../core/src/hooks/index';

function render(vnode: unknown): HTMLElement {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(vnode as any);
  return container;
}

describe('TimePicker', () => {
  describe('happy paths', () => {
    it('renders with defaults', () => {
      const el = render(createElement(TimePicker, { value: '12:00', onChange: vi.fn() }));
      const inputs = el.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it('renders controlled value', () => {
      const el = render(createElement(TimePicker, { value: '14:30', onChange: vi.fn() }));
      const inputs = el.querySelectorAll('input');
      // Hour and minute inputs
      expect((inputs[0] as HTMLInputElement).value).toBe('14');
      expect((inputs[1] as HTMLInputElement).value).toBe('30');
    });

    it('fires onChange on hour change', () => {
      const handler = vi.fn();
      const el = render(createElement(TimePicker, { value: '10:00', onChange: handler }));
      // Click hour increment button
      const buttons = el.querySelectorAll('button');
      if (buttons[0]) (buttons[0] as HTMLElement).click();
      expect(handler).toHaveBeenCalledWith('11:00');
    });

    it('displays label', () => {
      const el = render(createElement(TimePicker, { value: '10:00', onChange: vi.fn(), label: 'Start Time' }));
      expect(el.textContent).toContain('Start Time');
    });

    it('displays error message', () => {
      const el = render(createElement(TimePicker, { value: '10:00', onChange: vi.fn(), error: 'Invalid time' }));
      const error = el.querySelector('.form-field__error');
      expect(error).toBeTruthy();
      expect(error!.textContent).toBe('Invalid time');
    });
  });

  describe('sad paths', () => {
    it('applies disabled state', () => {
      const el = render(createElement(TimePicker, { value: '10:00', onChange: vi.fn(), disabled: true }));
      const inputs = el.querySelectorAll('input');
      inputs.forEach((input) => {
        expect((input as HTMLInputElement).disabled).toBe(true);
      });
    });

    it('renders with empty value gracefully', () => {
      const el = render(createElement(TimePicker, { value: '', onChange: vi.fn() }));
      const inputs = el.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it('handles invalid time string', () => {
      const el = render(createElement(TimePicker, { value: 'not:time', onChange: vi.fn() }));
      const inputs = el.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThanOrEqual(2);
    });

    it('disables buttons when disabled', () => {
      const handler = vi.fn();
      const el = render(createElement(TimePicker, { value: '10:00', onChange: handler, disabled: true }));
      const buttons = el.querySelectorAll('button');
      buttons.forEach((btn) => {
        expect((btn as HTMLButtonElement).disabled).toBe(true);
      });
    });
  });

  describe('interaction', () => {
    it('increment hour button updates time', () => {
      const handler = vi.fn();
      const el = render(createElement(TimePicker, { value: '09:30', onChange: handler }));
      const buttons = el.querySelectorAll('button');
      // First button should be hour increment
      if (buttons[0]) (buttons[0] as HTMLElement).click();
      expect(handler).toHaveBeenCalledWith('10:30');
    });

    it('decrement minute button updates time', () => {
      const handler = vi.fn();
      const el = render(createElement(TimePicker, { value: '09:30', onChange: handler }));
      const buttons = el.querySelectorAll('button');
      // Last button should be minute decrement
      const lastBtn = buttons[buttons.length - 1] as HTMLElement;
      if (lastBtn) lastBtn.click();
      expect(handler).toHaveBeenCalledWith('09:29');
    });

    it('shows AM/PM toggle in 12h format', () => {
      const el = render(createElement(TimePicker, { value: '14:00', onChange: vi.fn(), format: '12h' }));
      expect(el.textContent).toContain('PM');
    });
  });
});
