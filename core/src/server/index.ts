// ============================================================================
// LiquidJS Static Pre-rendering — Build-time HTML Generation
//
// These APIs render LiquidJS component trees to HTML strings or streams
// for use in BUILD SCRIPTS and STATIC SITE GENERATION only.
// They must NOT be used for server-side rendering in request handlers.
//
// For dynamic content, use client-side rendering with data fetched
// via HTTPS from API endpoints.
// ============================================================================

export { renderToString, renderToStaticMarkup } from './render-to-string';
export { renderToPipeableStream } from './render-to-pipeable-stream';
export { renderToReadableStream } from './render-to-readable-stream';
