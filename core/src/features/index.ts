/**
 * Feature Flags — Conditionally render components based on feature state.
 *
 * Features can be loaded from a static JSON file, configured programmatically,
 * or toggled at runtime. The FeatureFlagProvider wraps the app and provides
 * flag state via context. FeatureGate conditionally renders children based
 * on whether a flag is enabled.
 *
 * Usage:
 * ```typescript
 * // Wrap app with provider
 * createElement(FeatureFlagProvider, { url: '/features.json' },
 *   createElement(App, null),
 * );
 *
 * // Gate a feature
 * createElement(FeatureGate, { flag: 'dark-mode' },
 *   createElement(DarkModeToggle, null),
 * );
 *
 * // Use hook for custom logic
 * const { isEnabled, flags, setFlag } = useFeatureFlags();
 * if (isEnabled('beta-charts')) { ... }
 * ```
 */

export { FeatureFlagProvider, FeatureGate, useFeatureFlags } from './feature-flags';
export type { FeatureFlags, FeatureFlagProviderProps } from './feature-flags';
