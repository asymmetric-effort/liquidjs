// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Development-time ARIA compliance warnings.
 * Checks DOM element props for missing accessibility patterns
 * and warns developers via console.warn.
 */

import { warn } from './warnings';

export function checkAriaCompliance(tag: string, props: Record<string, unknown>): void {
  // Only warn in development
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return;

  // Interactive elements need accessible names
  if (tag === 'button' && !props.children && !props['aria-label'] && !props['aria-labelledby']) {
    warn(
      `<button> without text content or aria-label. Add text, aria-label, or aria-labelledby for accessibility.`,
    );
  }

  // Images need alt text
  if (tag === 'img' && props.alt === undefined) {
    warn(
      `<img> without alt attribute. Add alt="" for decorative images or descriptive text for informative images.`,
    );
  }

  // Input elements need labels
  if (
    (tag === 'input' || tag === 'select' || tag === 'textarea') &&
    !props['aria-label'] &&
    !props['aria-labelledby'] &&
    !props.id
  ) {
    warn(
      `<${tag}> without aria-label, aria-labelledby, or id (for label[for]). Form controls need accessible names.`,
    );
  }

  // Clickable divs/spans should have role and keyboard support
  if ((tag === 'div' || tag === 'span') && props.onClick && !props.role) {
    warn(
      `<${tag}> with onClick but no role attribute. Add role="button" and tabIndex={0} for keyboard accessibility.`,
    );
  }

  // role="button" needs tabIndex for keyboard focus
  if (props.role === 'button' && props.tabIndex === undefined && tag !== 'button') {
    warn(
      `Element with role="button" but no tabIndex. Add tabIndex={0} to make it keyboard-focusable.`,
    );
  }

  // Dialog needs aria-label or aria-labelledby
  if (props.role === 'dialog' && !props['aria-label'] && !props['aria-labelledby']) {
    warn(`Element with role="dialog" needs aria-label or aria-labelledby.`);
  }

  // Links with target="_blank" should have rel
  if (tag === 'a' && props.target === '_blank' && !props.rel) {
    warn(`<a target="_blank"> without rel attribute. Add rel="noopener noreferrer" for security.`);
  }

  // tablist needs aria-label or aria-labelledby
  if (props.role === 'tablist' && !props['aria-label'] && !props['aria-labelledby']) {
    warn(`Element with role="tablist" needs aria-label or aria-labelledby.`);
  }
}
