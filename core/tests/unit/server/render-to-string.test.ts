import { describe, it, expect } from '@asymmetric-effort/nogginlessdom';
import { renderToString, renderToStaticMarkup } from '../../../src/server/render-to-string';
import { createElement, Fragment, Component, createContext } from '../../../src/index';
import { forwardRef } from '../../../src/core/forward-ref';
import { memo } from '../../../src/core/memo';

describe('renderToString', () => {
  describe('basic elements', () => {
    it('renders a div', () => {
      expect(renderToString(createElement('div', null))).toBe('<div></div>');
    });

    it('renders with text children', () => {
      expect(renderToString(createElement('div', null, 'Hello'))).toBe('<div>Hello</div>');
    });

    it('renders with number children', () => {
      expect(renderToString(createElement('span', null, 42))).toBe('<span>42</span>');
    });

    it('renders nested elements', () => {
      const html = renderToString(createElement('div', null, createElement('span', null, 'inner')));
      expect(html).toBe('<div><span>inner</span></div>');
    });

    it('renders multiple children', () => {
      const html = renderToString(createElement('div', null, 'a', 'b', 'c'));
      expect(html).toBe('<div>abc</div>');
    });

    it('skips null, undefined, and boolean children', () => {
      const html = renderToString(createElement('div', null, null, true, false, undefined, 'text'));
      expect(html).toBe('<div>text</div>');
    });
  });

  describe('attributes', () => {
    it('renders className as class', () => {
      expect(renderToString(createElement('div', { className: 'foo' }))).toBe(
        '<div class="foo"></div>',
      );
    });

    it('renders htmlFor as for', () => {
      expect(renderToString(createElement('label', { htmlFor: 'input-1' }))).toBe(
        '<label for="input-1"></label>',
      );
    });

    it('renders id attribute', () => {
      expect(renderToString(createElement('div', { id: 'test' }))).toBe('<div id="test"></div>');
    });

    it('renders boolean attributes', () => {
      expect(renderToString(createElement('input', { disabled: true, type: 'text' }))).toBe(
        '<input disabled type="text"/>',
      );
    });

    it('omits false boolean attributes', () => {
      expect(renderToString(createElement('input', { disabled: false, type: 'text' }))).toBe(
        '<input type="text"/>',
      );
    });

    it('omits null and undefined attributes', () => {
      expect(renderToString(createElement('div', { 'data-x': null, 'data-y': undefined }))).toBe(
        '<div></div>',
      );
    });

    it('escapes attribute values', () => {
      expect(renderToString(createElement('div', { title: 'a "b" c' }))).toBe(
        '<div title="a &quot;b&quot; c"></div>',
      );
    });

    it('omits event handlers', () => {
      expect(renderToString(createElement('button', { onClick: () => {} }, 'Click'))).toBe(
        '<button>Click</button>',
      );
    });

    it('omits key and ref', () => {
      expect(renderToString(createElement('div', { key: 'k', ref: {} as never }))).toBe(
        '<div></div>',
      );
    });
  });

  describe('styles', () => {
    it('renders inline styles', () => {
      const html = renderToString(
        createElement('div', { style: { color: 'red', fontSize: '16px' } }),
      );
      expect(html).toBe('<div style="color:red;font-size:16px"></div>');
    });

    it('adds px suffix to numbers', () => {
      const html = renderToString(createElement('div', { style: { width: 100 } }));
      expect(html).toBe('<div style="width:100px"></div>');
    });

    it('does not add px to unitless properties', () => {
      const html = renderToString(createElement('div', { style: { opacity: 0.5, zIndex: 10 } }));
      expect(html).toBe('<div style="opacity:0.5;z-index:10"></div>');
    });
  });

  describe('self-closing elements', () => {
    it('renders img as self-closing', () => {
      expect(renderToString(createElement('img', { src: '/pic.png' }))).toBe(
        '<img src="/pic.png"/>',
      );
    });

    it('renders input as self-closing', () => {
      expect(renderToString(createElement('input', { type: 'text' }))).toBe('<input type="text"/>');
    });

    it('renders br as self-closing', () => {
      expect(renderToString(createElement('br', null))).toBe('<br/>');
    });

    it('renders hr as self-closing', () => {
      expect(renderToString(createElement('hr', null))).toBe('<hr/>');
    });
  });

  describe('dangerouslySetInnerHTML', () => {
    it('renders raw HTML', () => {
      const html = renderToString(
        createElement('div', { dangerouslySetInnerHTML: { __html: '<b>bold</b>' } }),
      );
      expect(html).toBe('<div><b>bold</b></div>');
    });
  });

  describe('HTML escaping', () => {
    it('escapes text content', () => {
      expect(renderToString(createElement('div', null, '<script>alert("xss")</script>'))).toBe(
        '<div>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>',
      );
    });

    it('escapes ampersands', () => {
      expect(renderToString(createElement('div', null, 'a & b'))).toBe('<div>a &amp; b</div>');
    });
  });

  describe('Fragment', () => {
    it('renders fragment children without wrapper', () => {
      const html = renderToString(
        createElement(
          Fragment,
          null,
          createElement('span', null, 'A'),
          createElement('span', null, 'B'),
        ),
      );
      expect(html).toBe('<span>A</span><span>B</span>');
    });

    it('renders nested fragments', () => {
      const html = renderToString(
        createElement(Fragment, null, createElement(Fragment, null, 'a'), 'b'),
      );
      expect(html).toBe('ab');
    });
  });

  describe('function components', () => {
    it('renders a function component', () => {
      function Greeting(props: { name: string }) {
        return createElement('h1', null, `Hello, ${props.name}!`);
      }

      expect(renderToString(createElement(Greeting, { name: 'SSR' }))).toBe('<h1>Hello, SSR!</h1>');
    });

    it('renders nested function components', () => {
      function Inner() {
        return createElement('em', null, 'deep');
      }
      function Outer() {
        return createElement('div', null, createElement(Inner, null));
      }

      expect(renderToString(createElement(Outer, null))).toBe('<div><em>deep</em></div>');
    });

    it('handles component returning null', () => {
      function Empty() {
        return null;
      }
      expect(renderToString(createElement(Empty, null))).toBe('');
    });
  });

  describe('class components', () => {
    it('renders a class component', () => {
      class Hello extends Component<{ name: string }> {
        render() {
          return createElement('span', null, `Hi ${this.props.name}`);
        }
      }

      expect(renderToString(createElement(Hello, { name: 'Class' }))).toBe('<span>Hi Class</span>');
    });
  });

  describe('memo', () => {
    it('renders a memo component', () => {
      const Inner = (props: { x: number }) => createElement('span', null, String(props.x));
      const Memoized = memo(Inner);

      expect(renderToString(createElement(Memoized as unknown as () => null, { x: 42 }))).toBe(
        '<span>42</span>',
      );
    });
  });

  describe('forwardRef', () => {
    it('renders a forwardRef component', () => {
      const FancyInput = forwardRef((_props, _ref) => {
        return createElement('input', { type: 'text', className: 'fancy' });
      });

      expect(renderToString(createElement(FancyInput as unknown as () => null, null))).toBe(
        '<input type="text" class="fancy"/>',
      );
    });
  });

  describe('context', () => {
    it('renders with context provider value', () => {
      const Ctx = createContext('default');

      function Reader() {
        // SSR doesn't use hooks dispatcher, so we read context directly
        return createElement('span', null, Ctx._currentValue);
      }

      const html = renderToString(
        createElement(
          Ctx.Provider as unknown as () => null,
          { value: 'server-val' },
          createElement(Reader, null),
        ),
      );
      expect(html).toBe('<span>server-val</span>');
    });

    it('restores context value after render', () => {
      const Ctx = createContext('original');

      function Reader() {
        return createElement('span', null, Ctx._currentValue);
      }

      renderToString(
        createElement(
          Ctx.Provider as unknown as () => null,
          { value: 'temp' },
          createElement(Reader, null),
        ),
      );

      // Context should be restored
      expect(Ctx._currentValue).toBe('original');
    });
  });
});

describe('renderToStaticMarkup', () => {
  it('renders without hydration attributes', () => {
    const html = renderToStaticMarkup(createElement('div', null, 'static'));
    expect(html).toBe('<div>static</div>');
  });

  it('renders the same markup as renderToString for basic elements', () => {
    const element = createElement(
      'div',
      { className: 'test' },
      createElement('span', null, 'hello'),
    );
    expect(renderToStaticMarkup(element)).toBe(renderToString(element));
  });
});

describe('edge cases', () => {
  it('renders null', () => {
    expect(renderToString(null)).toBe('');
  });

  it('renders undefined', () => {
    expect(renderToString(undefined)).toBe('');
  });

  it('renders boolean true', () => {
    expect(renderToString(true as unknown as SpecNode)).toBe('');
  });

  it('renders boolean false', () => {
    expect(renderToString(false as unknown as SpecNode)).toBe('');
  });

  it('renders a number', () => {
    expect(renderToString(42 as unknown as SpecNode)).toBe('42');
  });

  it('renders a string', () => {
    expect(renderToString('hello' as unknown as SpecNode)).toBe('hello');
  });

  it('renders an array of elements', () => {
    const html = renderToString([
      createElement('span', { key: 'a' }, 'A'),
      createElement('span', { key: 'b' }, 'B'),
    ]);
    expect(html).toBe('<span>A</span><span>B</span>');
  });
});

// Type import for edge case test
import type { SpecNode } from '../../../src/shared/types';

describe('renderNode edge cases — nested arrays and invalid elements', () => {
  it('renders deeply nested arrays', () => {
    // Exercises the Array.isArray(child) branch inside the array processing loop (lines 158-160)
    const nested = [[createElement('span', null, 'deep')]];
    const html = renderToString(createElement('div', null, ...nested));
    expect(html).toContain('deep');
  });

  it('renders array containing numbers inside arrays', () => {
    // Exercises the typeof child === 'number' branch (lines 154-156)
    const html = renderToString([42, 99] as unknown as SpecNode);
    expect(html).toBe('4299');
  });

  it('renders array containing booleans and nulls (skips them)', () => {
    // Exercises the null/boolean continue branch (line 149)
    const html = renderToString([null, true, false, undefined, 'visible'] as unknown as SpecNode);
    expect(html).toBe('visible');
  });

  it('renders array containing strings', () => {
    // Exercises the typeof child === 'string' branch (lines 150-153)
    const html = renderToString(['hello', ' ', 'world'] as unknown as SpecNode);
    expect(html).toBe('hello world');
  });

  it('returns empty string for non-valid element object', () => {
    // Exercises the !isValidElement(node) return '' path (lines 168-169)
    const html = renderToString({ notAnElement: true } as unknown as SpecNode);
    expect(html).toBe('');
  });

  it('renders memo component with function type', () => {
    // Exercises the memo inner type path (lines 208-213)
    const Inner = (props: { val: string }) => createElement('em', null, props.val);
    const Memoized = memo(Inner);
    const html = renderToString(
      createElement(Memoized as unknown as () => null, { val: 'memo-val' }),
    );
    expect(html).toBe('<em>memo-val</em>');
  });

  it('returns empty string for unknown element type', () => {
    // Exercises the final return '' in renderElement (line 236)
    // Create a spec element with a non-string, non-function, non-object type
    const el = createElement('div', null);
    (el as any).type = 12345; // set to a number
    const html = renderToString(el);
    expect(html).toBe('');
  });
});

describe('renderHostElement — value/checked/selected attributes', () => {
  it('renders checked as boolean attribute when true', () => {
    const html = renderToString(createElement('input', { type: 'checkbox', checked: true }));
    expect(html).toContain('checked');
    expect(html).not.toContain('checked="');
  });

  it('renders selected attribute as boolean', () => {
    const html = renderToString(createElement('option', { selected: true }, 'Opt'));
    expect(html).toContain('selected');
  });

  it('renders value attribute with string', () => {
    const html = renderToString(createElement('input', { type: 'text', value: 'hello' }));
    expect(html).toContain('value="hello"');
  });

  it('skips attributes with invalid names', () => {
    // Tests the attribute name validation regex (line 252)
    const html = renderToString(createElement('div', { '"><script>': 'bad' } as any));
    expect(html).not.toContain('<script>');
    expect(html).toBe('<div></div>');
  });
});

describe('escapeHtml edge cases', () => {
  it('escapes single quotes', () => {
    const html = renderToString(createElement('div', null, "it's"));
    expect(html).toContain('&#x27;');
  });

  it('handles string with no special characters', () => {
    // Exercises the lastIndex === 0 early return (line 408)
    const html = renderToString(createElement('div', null, 'plain text'));
    expect(html).toBe('<div>plain text</div>');
  });

  it('handles string ending with special character', () => {
    // Exercises the lastIndex < str.length tail check (lines 409-410)
    const html = renderToString(createElement('div', null, 'end&'));
    expect(html).toBe('<div>end&amp;</div>');
  });

  it('handles string starting with special character followed by text', () => {
    const html = renderToString(createElement('div', null, '<start'));
    expect(html).toBe('<div>&lt;start</div>');
  });
});

describe('GHSA-5m8c-jcpx-h89h: style attribute escaping', () => {
  it('escapes double quotes in style values to prevent attribute breakout', () => {
    const html = renderToString(
      createElement('div', { style: { color: 'red" onmouseover="alert(1)' } }),
    );
    // The quote must be escaped so the style attribute isn't broken out of
    expect(html).toContain('&quot;');
    // The output must NOT contain an unescaped onmouseover attribute
    expect(html).not.toContain('" onmouseover="');
  });

  it('escapes double quotes in style property names', () => {
    const html = renderToString(
      createElement('div', {
        style: { 'color" onmouseover="alert(1)//': '' } as Record<string, string>,
      }),
    );
    expect(html).not.toContain('onmouseover');
  });

  it('preserves legitimate style values after escaping', () => {
    const html = renderToString(
      createElement('div', { style: { color: 'red', fontSize: '14px', margin: 0 } }),
    );
    expect(html).toContain('style="');
    expect(html).toContain('color:red');
    expect(html).toContain('font-size:14px');
    expect(html).toContain('margin:0');
  });

  it('rejects style property names with invalid characters', () => {
    const html = renderToString(
      createElement('div', {
        style: { 'valid-prop': 'ok', '<script>': 'bad' } as Record<string, string>,
      }),
    );
    expect(html).toContain('valid-prop:ok');
    expect(html).not.toContain('<script>');
  });

  it('escapes angle brackets in style values', () => {
    const html = renderToString(
      createElement('div', { style: { background: 'url("</style><script>alert(1)</script>")' } }),
    );
    expect(html).not.toContain('<script>');
  });

  it('escapes ampersands in style values', () => {
    const html = renderToString(createElement('div', { style: { content: 'a&b' } }));
    expect(html).toContain('&amp;');
  });
});
