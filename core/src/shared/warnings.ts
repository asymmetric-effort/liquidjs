/**
 * Warning system for development-time diagnostics.
 * Warnings are suppressed in production builds.
 */

const warnedMessages = new Set<string>();

/**
 * Issue a one-time warning (deduplicated by message).
 */
export function warn(message: string): void {
  if (warnedMessages.has(message)) return;
  warnedMessages.add(message);

  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn(`[LiquidJS] ${message}`);
  }
}

/**
 * Issue an error-level warning.
 */
export function error(message: string): void {
  if (typeof console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(`[LiquidJS] ${message}`);
  }
}

/**
 * Reset warned messages (for testing).
 */
export function resetWarnings(): void {
  warnedMessages.clear();
}
