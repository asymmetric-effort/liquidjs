// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Secure fetch wrapper — enforces HTTPS-only policy.
 *
 * SpecifyJS prohibits HTTP connections. All network requests must use
 * HTTPS or be relative URLs. This prevents data from being transmitted
 * in plaintext, protecting against eavesdropping and MITM attacks.
 *
 * Exceptions:
 * - Relative URLs (./path, /path) — resolved by the browser
 * - localhost and 127.0.0.1 — development only
 */

/**
 * Check if a hostname is a valid IPv4 loopback address (127.0.0.0/8).
 * Only matches actual dotted-decimal IPv4 addresses in the 127.x.x.x range,
 * NOT DNS names that happen to start with "127." (e.g., 127.evil.com).
 * Fix for GHSA-4j4w-6h62-75jh.
 */
const IPV4_LOOPBACK = /^127\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
function isLoopbackIPv4(hostname: string): boolean {
  const m = IPV4_LOOPBACK.exec(hostname);
  if (!m) return false;
  // Validate each octet is 0-255
  return Number(m[1]) <= 255 && Number(m[2]) <= 255 && Number(m[3]) <= 255;
}

/**
 * Validate that a URL uses HTTPS or is a relative/localhost URL.
 * Throws if the URL uses plaintext HTTP.
 */
export function assertSecureUrl(url: string): void {
  // Block protocol-relative URLs (//evil.com) — they inherit the page's protocol
  if (url.startsWith('//')) {
    throw new Error(
      `[SpecifyJS] Protocol-relative URL rejected: "${url}". ` + `Use an explicit https:// prefix.`,
    );
  }

  // Relative URLs are always allowed
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return;
  }

  // Data URIs: allow but limit size to prevent memory exhaustion
  if (url.startsWith('data:')) {
    if (url.length > 1024 * 1024) {
      throw new Error('[SpecifyJS] secureFetch: data: URI exceeds 1MB limit');
    }
    return;
  }

  // Parse absolute URLs — reject if unparseable
  let parsed: URL;
  try {
    parsed = new URL(url, typeof window !== 'undefined' ? window.location.href : undefined);
  } catch {
    throw new Error(
      `[SpecifyJS] secureFetch: unable to validate URL "${url}". ` +
        `Provide a valid absolute HTTPS URL or a relative path.`,
    );
  }

  // Allow HTTPS
  if (parsed.protocol === 'https:') {
    return;
  }

  // Allow exact localhost for development (any protocol) — covers IPv4/IPv6 loopback.
  // Block subdomains of localhost (e.g., a.localhost) which resolve to 127.0.0.1
  // and can be used to bypass SSRF protections (GHSA-864j-qcr9-jrwh).
  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname === '0.0.0.0' ||
    isLoopbackIPv4(hostname)
  ) {
    return;
  }

  // Block .localhost TLD subdomains (RFC 6761 — resolve to loopback)
  if (hostname.endsWith('.localhost')) {
    throw new Error(
      `[SpecifyJS] SSRF protection: "${url}" uses a .localhost subdomain ` +
        `which resolves to the loopback interface. Use exact "localhost" instead.`,
    );
  }

  // Reject HTTP and other insecure protocols
  throw new Error(
    `[SpecifyJS] Insecure URL rejected: "${url}". ` +
      `SpecifyJS enforces HTTPS-only for all network requests. ` +
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
  // Default to rejecting redirects to prevent redirect-based SSRF.
  // Callers can override with { redirect: 'follow' } if they trust the target.
  return fetch(input, { redirect: 'error', ...init });
}
