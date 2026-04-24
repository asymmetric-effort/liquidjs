import { useContext } from '../hooks/index';
import { RouterContext, type RouterContextValue } from './router-context';

/** Returns the full router context value. */
export function useRouter(): RouterContextValue {
  return useContext(RouterContext);
}
