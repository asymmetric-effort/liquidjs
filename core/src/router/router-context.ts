/**
 * Router context — provides routing state to descendant components.
 */

import { createContext } from '../context/create-context';
import type { LiquidNode } from '../shared/types';

export interface RouterContextValue {
  /** Current hash pathname */
  pathname: string;
  /** Matched route parameters */
  params: Record<string, string>;
  /** Navigate to a new path */
  navigate: (to: string, options?: { replace?: boolean }) => void;
  /** Base path for nested routing (parent route's matched URL) */
  basePath: string;
}

export const RouterContext = createContext<RouterContextValue>({
  pathname: '/',
  params: {},
  navigate: () => {
    throw new Error('useNavigate must be used inside a <Router> component.');
  },
  basePath: '',
});
