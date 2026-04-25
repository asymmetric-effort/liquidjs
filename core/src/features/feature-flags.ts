// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Feature flag system — context-based feature gating for SpecifyJS.
 */

import { createElement } from '../core/create-element';
import { createContext } from '../context/create-context';
import { useState, useEffect, useContext, useCallback } from '../hooks/index';
import type { LiquidNode } from '../shared/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeatureFlags = Record<string, boolean>;

export interface FeatureFlagContextValue {
  /** Current flag states */
  flags: FeatureFlags;
  /** Check if a flag is enabled */
  isEnabled: (flag: string) => boolean;
  /** Set a flag's state at runtime */
  setFlag: (flag: string, enabled: boolean) => void;
  /** Whether flags are still loading from remote */
  loading: boolean;
}

export interface FeatureFlagProviderProps {
  /** URL to fetch feature flags JSON from (optional) */
  url?: string;
  /** Initial/default flag values */
  defaults?: FeatureFlags;
  /** Children */
  children?: LiquidNode;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  flags: {},
  isEnabled: () => false,
  setFlag: () => {},
  loading: false,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function FeatureFlagProvider(props: FeatureFlagProviderProps): LiquidNode {
  const [flags, setFlags] = useState<FeatureFlags>(() => ({ ...props.defaults }));
  const [loading, setLoading] = useState(!!props.url);

  // Fetch flags from URL if provided
  useEffect(() => {
    if (!props.url) return;

    let cancelled = false;
    setLoading(true);

    fetch(props.url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: unknown) => {
        if (!cancelled && typeof json === 'object' && json !== null) {
          setFlags((prev: FeatureFlags) => ({
            ...prev,
            ...(json as FeatureFlags),
          }));
        }
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [props.url]);

  const isEnabled = useCallback(
    ((...args: unknown[]) => {
      const flag = args[0] as string;
      return flags[flag] === true;
    }) as (...args: unknown[]) => unknown,
    [flags],
  ) as (flag: string) => boolean;

  const setFlag = useCallback(
    ((...args: unknown[]) => {
      const flag = args[0] as string;
      const enabled = args[1] as boolean;
      setFlags((prev: FeatureFlags) => ({ ...prev, [flag]: enabled }));
    }) as (...args: unknown[]) => unknown,
    [],
  ) as (flag: string, enabled: boolean) => void;

  const value: FeatureFlagContextValue = {
    flags,
    isEnabled,
    setFlag,
    loading,
  };

  return createElement(FeatureFlagContext.Provider, { value }, props.children);
}

// ---------------------------------------------------------------------------
// Gate component
// ---------------------------------------------------------------------------

export interface FeatureGateProps {
  /** Flag name to check */
  flag: string;
  /** Content to render when flag is enabled */
  children?: LiquidNode;
  /** Content to render when flag is disabled (optional) */
  fallback?: LiquidNode;
}

/**
 * Conditionally renders children based on a feature flag.
 * Renders nothing (or fallback) when the flag is disabled.
 */
export function FeatureGate(props: FeatureGateProps): LiquidNode {
  const { isEnabled } = useContext(FeatureFlagContext);
  return isEnabled(props.flag) ? (props.children as LiquidNode) : (props.fallback ?? null);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook to access feature flag state and controls.
 */
export function useFeatureFlags(): FeatureFlagContextValue {
  return useContext(FeatureFlagContext);
}
