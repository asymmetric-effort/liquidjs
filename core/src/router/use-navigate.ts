// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { useContext } from '../hooks/index';
import { RouterContext } from './router-context';

/** Returns the navigate function from the nearest Router. */
export function useNavigate(): (to: string, options?: { replace?: boolean }) => void {
  return useContext(RouterContext).navigate;
}
