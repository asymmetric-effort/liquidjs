// ============================================================================
// SpecifyJS Static Pre-rendering — Build-time HTML Generation
//
// These APIs render SpecifyJS component trees to HTML strings or streams
// for use in BUILD SCRIPTS and STATIC SITE GENERATION only.
// They must NOT be used for server-side rendering in request handlers.
//
// For dynamic content, use client-side rendering with data fetched
// via HTTPS from API endpoints.
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

export { renderToString, renderToStaticMarkup } from './render-to-string';
export { renderToPipeableStream } from './render-to-pipeable-stream';
export { renderToReadableStream } from './render-to-readable-stream';
