/**
 * useHead — Manages document <head> meta tags from within components.
 *
 * Allows components to declaratively set page title, meta description,
 * keywords, author, Open Graph tags, and arbitrary meta elements.
 * Tags are applied on mount and cleaned up on unmount.
 */

import { useEffect } from './index';

export interface HeadMeta {
  /** Document title */
  title?: string;
  /** Meta description */
  description?: string;
  /** Meta keywords (comma-separated) */
  keywords?: string;
  /** Meta author */
  author?: string;
  /** Canonical URL */
  canonical?: string;
  /** Open Graph tags */
  og?: Record<string, string>;
  /** Twitter card tags */
  twitter?: Record<string, string>;
  /** Arbitrary meta tags: [{ name, content }] or [{ property, content }] */
  meta?: Array<{ name?: string; property?: string; content: string }>;
}

/**
 * Sets document head meta tags. Tags are applied when the component
 * mounts and removed when it unmounts, preventing stale meta from
 * persisting across route changes.
 *
 * ```typescript
 * useHead({
 *   title: 'My Page',
 *   description: 'Page description for SEO',
 *   keywords: 'liquidjs, framework, spa',
 *   author: 'Your Name',
 *   og: { title: 'My Page', image: '/og-image.png' },
 * });
 * ```
 */
export function useHead(head: HeadMeta): void {
  useEffect(() => {
    const cleanup: (() => void)[] = [];

    // Title
    const prevTitle = document.title;
    if (head.title) {
      document.title = head.title;
      cleanup.push(() => {
        document.title = prevTitle;
      });
    }

    // Standard meta tags
    if (head.description) {
      cleanup.push(setMeta('name', 'description', head.description));
    }
    if (head.keywords) {
      cleanup.push(setMeta('name', 'keywords', head.keywords));
    }
    if (head.author) {
      cleanup.push(setMeta('name', 'author', head.author));
    }

    // Canonical link
    if (head.canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = head.canonical;
      document.head.appendChild(link);
      cleanup.push(() => link.remove());
    }

    // Open Graph
    if (head.og) {
      for (const [key, value] of Object.entries(head.og)) {
        cleanup.push(setMeta('property', `og:${key}`, value));
      }
    }

    // Twitter Card
    if (head.twitter) {
      for (const [key, value] of Object.entries(head.twitter)) {
        cleanup.push(setMeta('name', `twitter:${key}`, value));
      }
    }

    // Arbitrary meta tags
    if (head.meta) {
      for (const tag of head.meta) {
        if (tag.name) {
          cleanup.push(setMeta('name', tag.name, tag.content));
        } else if (tag.property) {
          cleanup.push(setMeta('property', tag.property, tag.content));
        }
      }
    }

    return () => {
      for (const fn of cleanup) fn();
    };
  }, [
    head.title,
    head.description,
    head.keywords,
    head.author,
    head.canonical,
    head.og,
    head.twitter,
    head.meta,
  ]);
}

/**
 * Set or update a meta tag and return a cleanup function that removes it.
 */
function setMeta(attr: 'name' | 'property', key: string, content: string): () => void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  const existed = el !== null;
  const prevContent = el?.content;

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;

  return () => {
    if (existed && prevContent !== undefined) {
      el!.content = prevContent;
    } else if (!existed) {
      el!.remove();
    }
  };
}
