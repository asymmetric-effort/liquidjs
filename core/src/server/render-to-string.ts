import {
  type LiquidNode,
  type LiquidElement,
  type Props,
  type FunctionComponent,
  type ClassComponentInstance,
  LIQUID_FRAGMENT_TYPE,
  LIQUID_STRICT_MODE_TYPE,
  LIQUID_PROFILER_TYPE,
  LIQUID_FORWARD_REF_TYPE,
  LIQUID_MEMO_TYPE,
  LIQUID_PROVIDER_TYPE,
} from '../shared/types';
import { isValidElement } from '../core/is-valid-element';

// Self-closing HTML tags
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

// Map of prop names to HTML attribute names
const PROP_TO_ATTR: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  acceptCharset: 'accept-charset',
  tabIndex: 'tabindex',
  autoFocus: 'autofocus',
  autoComplete: 'autocomplete',
  autoPlay: 'autoplay',
  crossOrigin: 'crossorigin',
  noValidate: 'novalidate',
  formNoValidate: 'formnovalidate',
  readOnly: 'readonly',
  cellPadding: 'cellpadding',
  cellSpacing: 'cellspacing',
  colSpan: 'colspan',
  rowSpan: 'rowspan',
  frameBorder: 'frameborder',
  marginHeight: 'marginheight',
  marginWidth: 'marginwidth',
};

// Props that should not be rendered as attributes
const RESERVED_PROPS = new Set(['children', 'key', 'ref', 'dangerouslySetInnerHTML']);

const EVENT_RE = /^on[A-Z]/;

/**
 * Renders a LiquidJS component tree to an HTML string.
 *
 * **Build-time pre-rendering only.** This function is designed for use
 * during the build process (e.g., static site generation, build scripts)
 * to produce HTML files that are served statically. It must NOT be called
 * in server request handlers, middleware, or any runtime code path that
 * responds to HTTP requests.
 *
 * For dynamic content, use LiquidJS's client-side rendering with data
 * fetched via HTTPS from API endpoints.
 *
 * @throws {Error} If called in a detected server request context
 */
export function renderToString(element: LiquidNode): string {
  assertNotInRequestContext('renderToString');
  return renderNode(element, true);
}

/**
 * Renders a LiquidJS component tree to static HTML (no hydration markers).
 *
 * **Build-time pre-rendering only.** Use in build scripts to generate
 * static HTML pages. Do NOT use in server request handlers.
 *
 * @throws {Error} If called in a detected server request context
 */
export function renderToStaticMarkup(element: LiquidNode): string {
  assertNotInRequestContext('renderToStaticMarkup');
  return renderNode(element, false);
}

/**
 * Guard against misuse in server request handlers.
 * Detects common server frameworks (Express, Koa, Fastify, etc.)
 * by checking for telltale global state.
 */
/* v8 ignore next 22 -- environment detection only triggers in Node.js production */
function assertNotInRequestContext(fnName: string): void {
  if (
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    process.env.LIQUIDJS_ALLOW_PRERENDER === 'true'
  ) {
    return;
  }

  if (
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    (process.env.NODE_ENV === 'production' || process.env.PORT)
  ) {
    if (!process.env.LIQUIDJS_ALLOW_PRERENDER) {
      console.warn(
        `[LiquidJS] ${fnName}() is intended for build-time pre-rendering only, ` +
          `not runtime server-side rendering. Set LIQUIDJS_ALLOW_PRERENDER=true ` +
          `if you are using this in a build script. See: ` +
          `https://github.com/asymmetric-effort/liquidjs/blob/main/docs/api/static-prerendering.md`,
      );
    }
  }
}

function renderNode(node: LiquidNode, includeDataAttrs: boolean): string {
  // Null, undefined, boolean → empty
  if (node == null || typeof node === 'boolean') {
    return '';
  }

  // String or number → escape and return
  if (typeof node === 'string') {
    return escapeHtml(node);
  }
  if (typeof node === 'number') {
    return String(node);
  }

  // Array → render each child
  if (Array.isArray(node)) {
    return node.map((child) => renderNode(child, includeDataAttrs)).join('');
  }

  // Must be an element
  if (!isValidElement(node)) {
    return '';
  }

  const element = node as LiquidElement;
  return renderElement(element, includeDataAttrs);
}

function renderElement(element: LiquidElement, includeDataAttrs: boolean): string {
  const { type, props } = element;

  // Fragment, StrictMode, Profiler → render children only
  if (
    type === LIQUID_FRAGMENT_TYPE ||
    type === LIQUID_STRICT_MODE_TYPE ||
    type === LIQUID_PROFILER_TYPE
  ) {
    return renderNode(props.children, includeDataAttrs);
  }

  // Context Provider → set value and render children
  if (typeof type === 'object' && type !== null) {
    const $$typeof = (type as { $$typeof?: symbol }).$$typeof;

    if ($$typeof === LIQUID_PROVIDER_TYPE) {
      const context = (type as { _context: { _currentValue: unknown } })._context;
      const prevValue = context._currentValue;
      context._currentValue = props.value;
      const result = renderNode(props.children, includeDataAttrs);
      context._currentValue = prevValue;
      return result;
    }

    if ($$typeof === LIQUID_FORWARD_REF_TYPE) {
      const render = (type as { render: (props: Props, ref: unknown) => LiquidNode }).render;
      const children = render(props, element.ref);
      return renderNode(children, includeDataAttrs);
    }

    if ($$typeof === LIQUID_MEMO_TYPE) {
      const innerType = (type as { type: FunctionComponent }).type;
      if (typeof innerType === 'function') {
        const children = innerType(props);
        return renderNode(children, includeDataAttrs);
      }
    }
  }

  // Function component
  if (typeof type === 'function') {
    if ((type.prototype as Record<string, unknown>)?.isLiquidComponent) {
      // Class component
      const Constructor = type as new (props: Props) => ClassComponentInstance;
      const instance = new Constructor(props);
      const children = instance.render();
      return renderNode(children, includeDataAttrs);
    }

    // Functional component
    const children = (type as FunctionComponent)(props);
    return renderNode(children, includeDataAttrs);
  }

  // Host element (string tag)
  if (typeof type === 'string') {
    return renderHostElement(type, props, includeDataAttrs);
  }

  return '';
}

function renderHostElement(tag: string, props: Props, includeDataAttrs: boolean): string {
  let html = `<${tag}`;

  // Render attributes
  for (const key in props) {
    if (RESERVED_PROPS.has(key) || EVENT_RE.test(key)) continue;

    const value = props[key];
    if (value == null || value === false) continue;

    const attrName = PROP_TO_ATTR[key] || key.toLowerCase();

    if (key === 'style') {
      html += ` style="${renderStyle(value as Record<string, string | number>)}"`;
    } else if (key === 'value' || key === 'checked' || key === 'selected') {
      if (value === true) {
        html += ` ${attrName}`;
      } else {
        html += ` ${attrName}="${escapeHtml(String(value))}"`;
      }
    } else if (value === true) {
      html += ` ${attrName}`;
    } else {
      html += ` ${attrName}="${escapeHtml(String(value))}"`;
    }
  }

  if (includeDataAttrs) {
    // Mark the root element for hydration
  }

  // Self-closing tags
  if (VOID_ELEMENTS.has(tag)) {
    html += '/>';
    return html;
  }

  html += '>';

  // dangerouslySetInnerHTML
  if (props.dangerouslySetInnerHTML) {
    const innerHtml = (props.dangerouslySetInnerHTML as { __html: string }).__html;
    html += innerHtml;
  } else {
    // Render children
    html += renderNode(props.children, includeDataAttrs);
  }

  html += `</${tag}>`;
  return html;
}

function renderStyle(style: Record<string, string | number>): string {
  const parts: string[] = [];
  for (const prop in style) {
    const value = style[prop];
    if (value == null) continue;

    // Convert camelCase to kebab-case
    const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    const cssValue =
      typeof value === 'number' && value !== 0 && !isUnitlessProp(prop)
        ? `${value}px`
        : String(value);

    parts.push(`${cssProp}:${cssValue}`);
  }
  return parts.join(';');
}

const UNITLESS_PROPS = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
]);

function isUnitlessProp(prop: string): boolean {
  return UNITLESS_PROPS.has(prop);
}

function escapeHtml(str: string): string {
  let result = '';
  let lastIndex = 0;

  for (let i = 0; i < str.length; i++) {
    let escaped: string | undefined;
    switch (str.charCodeAt(i)) {
      case 34:
        escaped = '&quot;';
        break; // "
      case 38:
        escaped = '&amp;';
        break; // &
      case 39:
        escaped = '&#x27;';
        break; // '
      case 60:
        escaped = '&lt;';
        break; // <
      case 62:
        escaped = '&gt;';
        break; // >
    }
    if (escaped !== undefined) {
      if (lastIndex !== i) {
        result += str.slice(lastIndex, i);
      }
      result += escaped;
      lastIndex = i + 1;
    }
  }

  if (lastIndex === 0) return str;
  if (lastIndex < str.length) {
    result += str.slice(lastIndex);
  }
  return result;
}
