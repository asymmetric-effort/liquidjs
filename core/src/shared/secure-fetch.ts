// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Secure fetch wrapper — enforces HTTPS-only policy.
 *
 * LiquidJS prohibits HTTP connections. All network requests must use
 * HTTPS or be relative URLs. This prevents data from being transmitted
 * in plaintext, protecting against eavesdropping and MITM attacks.
 *
 * Exceptions:
 * - Relative URLs (./path, /path) — resolved by the browser
 * - localhost and 127.0.0.1 — development only
 */

/**
 * Validate that a URL uses HTTPS or is a relative/localhost URL.
 * Throws if the URL uses plaintext HTTP.
 */
export function assertSecureUrl(url: string): void {
  // Relative URLs are always allowed
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return;
  }

  // Data URLs are allowed
  if (url.startsWith('data:')) {
    return;
  }

  // Parse absolute URLs
  let parsed: URL;
  try {
    parsed = new URL(url, typeof window !== 'undefined' ? window.location.href : undefined);
  } catch {
    // If URL can't be parsed, allow it (likely a relative path the browser will resolve)
    return;
  }

  // Allow HTTPS
  if (parsed.protocol === 'https:') {
    return;
  }

  // Allow localhost/127.0.0.1 for development (any protocol)
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
    return;
  }

  // Reject HTTP and other insecure protocols
  throw new Error(
    `[LiquidJS] Insecure URL rejected: "${url}". ` +
      `LiquidJS enforces HTTPS-only for all network requests. ` +
      `Use https:// or a relative URL. ` +
      `Localhost URLs are allowed for development.`,
  );
}

/**
 * Secure fetch — drop-in replacement for window.fetch that enforces HTTPS.
 * Use this instead of fetch() directly to comply with the HTTPS-only policy.
 */
export function secureFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  assertSecureUrl(url);
  return fetch(input, init);
}
