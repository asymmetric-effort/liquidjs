// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { useContext } from '../hooks/index';
import { RouterContext, type RouterContextValue } from './router-context';

/** Returns the full router context value. */
export function useRouter(): RouterContextValue {
  return useContext(RouterContext);
}
