// ============================================================================
// LiquidJS DOM — Browser Rendering APIs
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

export { createRoot, hydrateRoot } from './create-root';
export { createPortal } from './create-portal';
export { flushSync } from './flush-sync';

// Legacy APIs (for migration support)
export { render, hydrate, unmountComponentAtNode } from './legacy';
