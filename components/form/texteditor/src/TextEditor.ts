// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * TextEditor — Simple WYSIWYG rich text editor using contentEditable.
 *
 * Provides a toolbar with basic formatting commands (bold, italic, underline,
 * lists, headings, links) and a contentEditable editing area. Zero
 * dependencies — uses document.execCommand for formatting.
 */

import { createElement, Fragment } from 'specifyjs';
import { useState, useCallback, useRef, useEffect, useId } from 'specifyjs/hooks';
import { FormFieldWrapper } from '../../wrapper/src/FormFieldWrapper';
import type { FormFieldWrapperStyle } from '../../wrapper/src/FormFieldWrapper';

export interface TextEditorProps {
  /** Initial HTML content */
  value?: string;
  /** Change handler — receives HTML string */
  onChange?: (html: string) => void;
  /** Blur handler */
  onBlur?: (html: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum height of editing area (default: '200px') */
  minHeight?: string;
  /** Maximum height (default: none — grows to fit) */
  maxHeight?: string;
  /** Read-only */
  readOnly?: boolean;
  /** Disabled */
  disabled?: boolean;
  /** Which toolbar buttons to show (default: all) */
  toolbar?: ToolbarButton[];
  /** HTML id */
  id?: string;

  // Toolbar styling
  toolbarStyle?: {
    backgroundColor?: string;
    borderBottom?: string;
    buttonColor?: string;
    buttonHoverBackground?: string;
    buttonActiveBackground?: string;
    buttonSize?: string;
  };

  // Editor area styling
  editorStyle?: {
    padding?: string;
    backgroundColor?: string;
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
  };

  // Wrapper
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  wrapperStyle?: FormFieldWrapperStyle;
}

export type ToolbarButton =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'link'
  | 'unlink'
  | 'insertHR'
  | 'removeFormat'
  | 'undo'
  | 'redo';

const DEFAULT_TOOLBAR: ToolbarButton[] = [
  'bold', 'italic', 'underline', 'strikethrough',
  'heading1', 'heading2',
  'bulletList', 'orderedList', 'blockquote',
  'link', 'unlink',
  'insertHR', 'removeFormat',
  'undo', 'redo',
];

const BUTTON_META: Record<ToolbarButton, { label: string; icon: string; command: string; value?: string }> = {
  bold:          { label: 'Bold',          icon: 'B',  command: 'bold' },
  italic:        { label: 'Italic',        icon: 'I',  command: 'italic' },
  underline:     { label: 'Underline',     icon: 'U',  command: 'underline' },
  strikethrough: { label: 'Strikethrough', icon: 'S',  command: 'strikethrough' },
  heading1:      { label: 'Heading 1',     icon: 'H1', command: 'formatBlock', value: 'h1' },
  heading2:      { label: 'Heading 2',     icon: 'H2', command: 'formatBlock', value: 'h2' },
  heading3:      { label: 'Heading 3',     icon: 'H3', command: 'formatBlock', value: 'h3' },
  bulletList:    { label: 'Bullet list',   icon: '\u2022', command: 'insertUnorderedList' },
  orderedList:   { label: 'Numbered list', icon: '1.', command: 'insertOrderedList' },
  blockquote:    { label: 'Blockquote',    icon: '\u201c', command: 'formatBlock', value: 'blockquote' },
  link:          { label: 'Insert link',   icon: '\ud83d\udd17', command: 'createLink' },
  unlink:        { label: 'Remove link',   icon: '\u26d4', command: 'unlink' },
  insertHR:      { label: 'Horizontal rule', icon: '\u2015', command: 'insertHorizontalRule' },
  removeFormat:  { label: 'Clear format',  icon: '\u2718', command: 'removeFormat' },
  undo:          { label: 'Undo',          icon: '\u21a9', command: 'undo' },
  redo:          { label: 'Redo',          icon: '\u21aa', command: 'redo' },
};

/**
 * Sanitize rich text HTML using a DOM-based allowlist approach.
 *
 * Regex-based sanitization is fundamentally unsafe — crafted input can bypass
 * pattern matching (e.g., `</script >`, nested tags, encoded characters).
 * Instead, we parse the HTML into a DOM tree, walk it iteratively, and only
 * keep elements and attributes on the allowlist. Everything else is removed.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del',
  'sub', 'sup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr', 'abbr', 'mark', 'small', 'figure', 'figcaption',
]);

const ALLOWED_ATTRS = new Set([
  'href', 'src', 'alt', 'title', 'width', 'height',
  'class', 'id', 'style', 'colspan', 'rowspan', 'scope',
  'target', 'rel',
]);

const DANGEROUS_URL_PATTERN = /^\s*(javascript|vbscript|data\s*:(?!image\/))/i;

function sanitizeRichText(html: string): string {
  if (typeof document === 'undefined') return '';
  const container = document.createElement('div');
  container.innerHTML = html;

  // Iterative tree walk — process nodes using an explicit stack
  const stack: Node[] = [];
  for (let i = container.childNodes.length - 1; i >= 0; i--) {
    stack.push(container.childNodes[i]!);
  }

  while (stack.length > 0) {
    const node = stack.pop()!;

    // Keep text nodes as-is
    if (node.nodeType === 3) continue;

    // Remove non-element nodes (comments, processing instructions, etc.)
    if (node.nodeType !== 1) {
      node.parentNode?.removeChild(node);
      continue;
    }

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    // Remove disallowed elements — replace with their children (keep text content)
    if (!ALLOWED_TAGS.has(tag)) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        // Push the newly promoted children onto the stack for further processing
        let sibling = parent.firstChild;
        const promoted: Node[] = [];
        while (sibling) {
          if (sibling !== el) promoted.push(sibling);
          sibling = sibling.nextSibling;
        }
        parent.removeChild(el);
        for (let i = promoted.length - 1; i >= 0; i--) {
          stack.push(promoted[i]!);
        }
      }
      continue;
    }

    // Remove disallowed attributes
    const attrs = el.attributes;
    const toRemove: string[] = [];
    for (let i = 0; i < attrs.length; i++) {
      const name = attrs[i]!.name.toLowerCase();
      // Remove any attribute starting with 'on' (event handlers)
      if (name.startsWith('on')) {
        toRemove.push(attrs[i]!.name);
      } else if (!ALLOWED_ATTRS.has(name)) {
        toRemove.push(attrs[i]!.name);
      }
    }
    for (const name of toRemove) {
      el.removeAttribute(name);
    }

    // Sanitize URL attributes
    const href = el.getAttribute('href');
    if (href && DANGEROUS_URL_PATTERN.test(href)) {
      el.removeAttribute('href');
    }
    const src = el.getAttribute('src');
    if (src && DANGEROUS_URL_PATTERN.test(src)) {
      el.removeAttribute('src');
    }

    // Push children onto stack for processing
    for (let i = el.childNodes.length - 1; i >= 0; i--) {
      stack.push(el.childNodes[i]!);
    }
  }

  return container.innerHTML;
}

export function TextEditor(props: TextEditorProps) {
  const [focused, setFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const autoId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const inputId = props.id ?? autoId;
  const toolbar = props.toolbar ?? DEFAULT_TOOLBAR;
  const ts = props.toolbarStyle ?? {};
  const es = props.editorStyle ?? {};

  // Set initial content (sanitized to strip script tags and event handlers)
  useEffect(() => {
    if (editorRef.current && props.value !== undefined) {
      editorRef.current.innerHTML = sanitizeRichText(props.value);
    }
  }, []);

  const execCommand = useCallback(
    (cmd: string, value?: string) => {
      if (props.disabled || props.readOnly) return;

      // Special handling for link — validate URL scheme
      if (cmd === 'createLink') {
        const url = prompt('Enter URL:');
        if (!url) return;
        if (/^(javascript|vbscript|data:text\/html)/i.test(url.trim())) return;
        document.execCommand(cmd, false, url);
      } else if (value && cmd === 'formatBlock') {
        document.execCommand(cmd, false, `<${value}>`);
      } else {
        document.execCommand(cmd, false, value);
      }

      // Fire change
      if (editorRef.current && props.onChange) {
        props.onChange(editorRef.current.innerHTML);
      }
    },
    [props.disabled, props.readOnly, props.onChange],
  );

  const handleInput = useCallback(() => {
    if (editorRef.current && props.onChange) {
      props.onChange(editorRef.current.innerHTML);
    }
  }, [props.onChange]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (editorRef.current && props.onBlur) {
      props.onBlur(editorRef.current.innerHTML);
    }
  }, [props.onBlur]);

  // Toolbar
  const toolbarEl = createElement(
    'div',
    {
      className: 'texteditor-toolbar',
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px',
        padding: '6px 8px',
        backgroundColor: ts.backgroundColor ?? '#f9fafb',
        borderBottom: ts.borderBottom ?? '1px solid #e5e7eb',
        borderRadius: '6px 6px 0 0',
      },
    },
    ...toolbar.map((btn) => {
      const meta = BUTTON_META[btn];
      if (!meta) return null;
      return createElement(
        'button',
        {
          key: btn,
          type: 'button',
          title: meta.label,
          onClick: () => execCommand(meta.command, meta.value),
          disabled: props.disabled || props.readOnly,
          style: {
            padding: '4px 8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: ts.buttonColor ?? '#374151',
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            fontSize: ts.buttonSize ?? '13px',
            fontWeight: btn === 'bold' ? '700' : btn === 'italic' ? '400' : '500',
            fontStyle: btn === 'italic' ? 'italic' : 'normal',
            textDecoration: btn === 'underline' ? 'underline' : btn === 'strikethrough' ? 'line-through' : 'none',
            minWidth: '28px',
            textAlign: 'center',
            lineHeight: '1.4',
          },
        },
        meta.icon,
      );
    }),
  );

  // Editor area
  const editorEl = createElement('div', {
    ref: editorRef,
    id: inputId,
    className: 'texteditor-content',
    contentEditable: props.disabled ? 'false' : 'true',
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-label': props.label ?? 'Text editor',
    'data-placeholder': props.placeholder ?? '',
    style: {
      padding: es.padding ?? '12px 14px',
      minHeight: props.minHeight ?? '200px',
      maxHeight: props.maxHeight ?? 'none',
      overflow: 'auto',
      backgroundColor: es.backgroundColor ?? '#ffffff',
      color: es.color ?? '#1f2937',
      fontFamily: es.fontFamily ?? 'inherit',
      fontSize: es.fontSize ?? '14px',
      lineHeight: es.lineHeight ?? '1.6',
      outline: 'none',
      borderRadius: '0 0 6px 6px',
      border: focused
        ? '1px solid #3b82f6'
        : props.error
          ? '1px solid #ef4444'
          : '1px solid #d1d5db',
      borderTop: 'none',
      transition: 'border-color 0.15s',
    },
    onFocus: () => setFocused(true),
    onBlur: handleBlur,
    onInput: handleInput,
  });

  return createElement(
    FormFieldWrapper,
    {
      label: props.label,
      htmlFor: inputId,
      helpText: props.helpText,
      error: props.error,
      required: props.required,
      disabled: props.disabled,
      styling: props.wrapperStyle,
    },
    createElement(
      'div',
      {
        className: 'texteditor',
        style: {
          border: focused
            ? '1px solid #3b82f6'
            : props.error
              ? '1px solid #ef4444'
              : '1px solid #d1d5db',
          borderRadius: '6px',
          overflow: 'hidden',
          transition: 'border-color 0.15s',
        },
      },
      toolbarEl,
      editorEl,
    ),
  );
}
