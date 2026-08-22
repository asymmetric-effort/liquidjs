// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { describe, it, expect, vi } from '@asymmetric-effort/nogginlessdom';
import { TextEditor } from '../src/index';
import { createElement } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';
import * as hooks from 'specifyjs/hooks';

function render(vnode: unknown): HTMLElement {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(vnode as any);
  return container;
}

describe('TextEditor', () => {
  describe('happy paths', () => {
    it('renders with defaults', () => {
      const el = render(createElement(TextEditor, null));
      const editor = el.querySelector('[contenteditable]');
      expect(editor).toBeTruthy();
    });

    it('renders toolbar buttons', () => {
      const el = render(createElement(TextEditor, null));
      const toolbar = el.querySelector('.texteditor-toolbar');
      expect(toolbar).toBeTruthy();
      const buttons = toolbar!.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('fires onChange on content input', () => {
      const handler = vi.fn();
      const el = render(createElement(TextEditor, { onChange: handler }));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      editor.innerHTML = '<p>Hello</p>';
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      expect(handler).toHaveBeenCalled();
    });

    it('displays label', () => {
      const el = render(createElement(TextEditor, { label: 'Content' }));
      const label = el.querySelector('label');
      expect(label).toBeTruthy();
      expect(label!.textContent).toContain('Content');
    });

    it('displays error message', () => {
      const el = render(createElement(TextEditor, { error: 'Content required' }));
      const error = el.querySelector('.form-field__error');
      expect(error).toBeTruthy();
      expect(error!.textContent).toBe('Content required');
    });

    it('displays help text', () => {
      const el = render(createElement(TextEditor, { helpText: 'Format with toolbar' }));
      const help = el.querySelector('.form-field__help');
      expect(help).toBeTruthy();
      expect(help!.textContent).toBe('Format with toolbar');
    });
  });

  describe('sad paths', () => {
    it('disables contentEditable when disabled', () => {
      const el = render(createElement(TextEditor, { disabled: true }));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.getAttribute('contenteditable')).toBe('false');
    });

    it('renders with empty value', () => {
      const el = render(createElement(TextEditor, { value: '' }));
      const editor = el.querySelector('[contenteditable]');
      expect(editor).toBeTruthy();
    });

    it('renders without onChange gracefully', () => {
      const el = render(createElement(TextEditor, { value: '<p>Static</p>' }));
      const editor = el.querySelector('[contenteditable]');
      expect(editor).toBeTruthy();
    });

    it('disables toolbar buttons when disabled', () => {
      const el = render(createElement(TextEditor, { disabled: true }));
      const buttons = el.querySelectorAll('.texteditor-toolbar button');
      buttons.forEach((btn) => {
        expect((btn as HTMLButtonElement).disabled).toBe(true);
      });
    });
  });

  describe('interaction', () => {
    it('fires onBlur when editor loses focus', () => {
      const handler = vi.fn();
      const el = render(createElement(TextEditor, { onBlur: handler }));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      editor.dispatchEvent(new Event('blur', { bubbles: true }));
      expect(handler).toHaveBeenCalled();
    });

    it('renders with custom toolbar subset', () => {
      const el = render(createElement(TextEditor, { toolbar: ['bold', 'italic'] }));
      const buttons = el.querySelectorAll('.texteditor-toolbar button');
      expect(buttons.length).toBe(2);
    });

    it('applies custom minHeight', () => {
      const el = render(createElement(TextEditor, { minHeight: '400px' }));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.style.minHeight).toBe('400px');
    });
  });

  describe('security (PT-003)', () => {
    it('strips script tags from initial value', async () => {
      const el = render(createElement(TextEditor, {
        value: '<p>Hello</p><script>alert("xss")</script><p>World</p>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('<script');
      expect(editor.innerHTML).toContain('Hello');
      expect(editor.innerHTML).toContain('World');
    });

    it('strips onerror event handlers from initial value', async () => {
      const el = render(createElement(TextEditor, {
        value: '<img src=x onerror="fetch(\'https://evil.com\')">',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('onerror');
    });

    it('strips onclick event handlers from initial value', async () => {
      const el = render(createElement(TextEditor, {
        value: '<div onclick="alert(1)">Click</div>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('onclick');
      expect(editor.innerHTML).toContain('Click');
    });

    it('preserves safe HTML formatting tags', async () => {
      const el = render(createElement(TextEditor, {
        value: '<p><strong>Bold</strong> and <em>italic</em></p>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).toContain('<strong>');
      expect(editor.innerHTML).toContain('<em>');
      expect(editor.innerHTML).toContain('Bold');
    });

    it('blocks javascript: URIs in createLink', async () => {
      const el = render(createElement(TextEditor, { value: '<p>text</p>' }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor).not.toBeNull();
    });

    // Regression tests for CodeQL findings #18-21
    it('strips script tags with trailing space in close tag (CodeQL #21)', async () => {
      const el = render(createElement(TextEditor, {
        value: '<p>Safe</p><script>alert(1)</script ><p>End</p>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('<script');
      expect(editor.innerHTML).not.toContain('alert');
      expect(editor.innerHTML).toContain('Safe');
      expect(editor.innerHTML).toContain('End');
    });

    it('strips nested/repeated script tags (CodeQL #20)', async () => {
      const el = render(createElement(TextEditor, {
        value: '<scr<script>ipt>alert(1)</script>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('<script');
      expect(editor.innerHTML).not.toContain('alert');
    });

    it('strips event handlers with spaces around equals (CodeQL #18-19)', async () => {
      const el = render(createElement(TextEditor, {
        value: '<img src="x" onerror = "fetch(\'evil\')" >',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('onerror');
      expect(editor.innerHTML).not.toContain('fetch');
    });

    it('strips onmouseover event handlers', async () => {
      const el = render(createElement(TextEditor, {
        value: '<div onmouseover="alert(1)">Hover</div>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('onmouseover');
      expect(editor.innerHTML).toContain('Hover');
    });

    it('strips onfocus and onblur event handlers', async () => {
      const el = render(createElement(TextEditor, {
        value: '<input onfocus="alert(1)" onblur="alert(2)">',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('onfocus');
      expect(editor.innerHTML).not.toContain('onblur');
    });

    it('strips javascript: URIs in href attributes', async () => {
      const el = render(createElement(TextEditor, {
        value: '<a href="javascript:alert(1)">Click</a>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('javascript:');
      expect(editor.innerHTML).toContain('Click');
    });

    it('strips javascript: URIs in src attributes', async () => {
      const el = render(createElement(TextEditor, {
        value: '<img src="javascript:alert(1)">',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('javascript:');
    });

    it('strips vbscript: URIs', async () => {
      const el = render(createElement(TextEditor, {
        value: '<a href="vbscript:msgbox(1)">Click</a>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('vbscript:');
    });

    it('strips data: URIs except images', async () => {
      const el = render(createElement(TextEditor, {
        value: '<a href="data:text/html,<script>alert(1)</script>">Click</a>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('data:text');
    });

    it('removes style, iframe, object, embed tags', async () => {
      const el = render(createElement(TextEditor, {
        value: '<style>body{display:none}</style><iframe src="evil.com"></iframe><object data="evil"></object><embed src="evil">',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('<style');
      expect(editor.innerHTML).not.toContain('<iframe');
      expect(editor.innerHTML).not.toContain('<object');
      expect(editor.innerHTML).not.toContain('<embed');
    });

    it('removes form and input tags', async () => {
      const el = render(createElement(TextEditor, {
        value: '<form action="evil"><input type="hidden" name="token" value="secret"></form>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).not.toContain('<form');
      expect(editor.innerHTML).not.toContain('<input');
    });

    it('preserves allowed formatting after sanitization', async () => {
      const el = render(createElement(TextEditor, {
        value: '<p><strong>Bold</strong> <a href="https://example.com">Link</a> <img src="photo.jpg" alt="Photo"></p>',
      }));
      await new Promise<void>((r) => queueMicrotask(r));
      const editor = el.querySelector('[contenteditable]') as HTMLElement;
      expect(editor.innerHTML).toContain('<strong>');
      expect(editor.innerHTML).toContain('href="https://example.com"');
      expect(editor.innerHTML).toContain('src="photo.jpg"');
      expect(editor.innerHTML).toContain('alt="Photo"');
    });
  });
});
