import type { LiquidNode } from '../shared/types';

/**
 * Renders a LiquidJS tree to an HTML string.
 * Equivalent to ReactDOMServer.renderToString.
 */
export function renderToString(_element: LiquidNode): string {
  // TODO: implement server renderer
  return '';
}

/**
 * Renders a LiquidJS tree to static HTML (no liquid-root attributes).
 * Equivalent to ReactDOMServer.renderToStaticMarkup.
 */
export function renderToStaticMarkup(_element: LiquidNode): string {
  // TODO: implement static server renderer
  return '';
}
