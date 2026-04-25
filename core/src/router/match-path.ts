/**
 * Path matching utility for hash-based routing.
 *
 * Supports:
 * - Literal segments: `/about` matches `/about`
 * - Named parameters: `/users/:id` matches `/users/123` → { id: '123' }
 * - Wildcards: `/files/*` matches `/files/a/b/c` → { '*': 'a/b/c' }
 * - Exact vs. partial matching for nested routes
 */

export interface MatchResult {
  /** Extracted route parameters */
  params: Record<string, string>;
  /** Whether the entire pathname was consumed */
  isExact: boolean;
  /** The pattern that was matched */
  path: string;
  /** The matched portion of the pathname */
  url: string;
}

export interface MatchOptions {
  /** If true, the pattern must match the entire pathname. Default: false. */
  exact?: boolean;
}

/** Strip trailing slash characters without regex (avoids ReDoS). */
function stripTrailingSlashes(s: string): string {
  let end = s.length;
  while (end > 1 && s.charCodeAt(end - 1) === 47 /* '/' */) {
    end--;
  }
  return end === s.length ? s : s.slice(0, end);
}

/**
 * Match a route pattern against a pathname.
 * Returns a MatchResult if the pattern matches, or null if it doesn't.
 */
export function matchPath(
  pattern: string,
  pathname: string,
  options?: MatchOptions,
): MatchResult | null {
  const exact = options?.exact ?? false;

  // Normalize: strip trailing slashes (but keep root /)
  const normalizedPattern = pattern === '/' ? '/' : stripTrailingSlashes(pattern);
  const normalizedPath = pathname === '/' ? '/' : stripTrailingSlashes(pathname);

  // Root pattern
  if (normalizedPattern === '/') {
    const isExact = normalizedPath === '/';
    if (exact && !isExact) {
      return null;
    }
    return {
      params: {},
      isExact,
      path: pattern,
      url: '/',
    };
  }

  const patternSegments = normalizedPattern.split('/').filter(Boolean);
  const pathSegments = normalizedPath.split('/').filter(Boolean);

  // If exact, path can't have more segments than pattern (unless wildcard)
  const hasWildcard = patternSegments[patternSegments.length - 1] === '*';

  if (!hasWildcard && exact && pathSegments.length !== patternSegments.length) {
    return null;
  }

  if (!hasWildcard && pathSegments.length < patternSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};
  const matchedSegments: string[] = [];

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i]!;

    // Wildcard — consume all remaining segments
    if (patternSeg === '*') {
      const remaining = pathSegments.slice(i).join('/');
      params['*'] = remaining;
      return {
        params,
        isExact: true,
        path: pattern,
        url: '/' + pathSegments.join('/'),
      };
    }

    // No more path segments to match against
    if (i >= pathSegments.length) {
      return null;
    }

    const pathSeg = pathSegments[i]!;

    // Named parameter
    if (patternSeg.startsWith(':')) {
      const paramName = patternSeg.slice(1);
      params[paramName] = decodeURIComponent(pathSeg);
      matchedSegments.push(pathSeg);
      continue;
    }

    // Literal segment — case-insensitive comparison
    if (patternSeg.toLowerCase() !== pathSeg.toLowerCase()) {
      return null;
    }

    matchedSegments.push(pathSeg);
  }

  const matchedUrl = '/' + matchedSegments.join('/');
  const isExact = pathSegments.length === patternSegments.length;

  if (exact && !isExact) {
    return null;
  }

  return {
    params,
    isExact,
    path: pattern,
    url: matchedUrl,
  };
}
