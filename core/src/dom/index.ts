// ============================================================================
// LiquidJS DOM — Browser Rendering APIs
// ============================================================================

export { createRoot, hydrateRoot } from './create-root';
export { createPortal } from './create-portal';
export { flushSync } from './flush-sync';

// Legacy APIs (for migration support)
export { render, hydrate, unmountComponentAtNode } from './legacy';
