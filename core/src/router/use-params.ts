import { useContext } from '../hooks/index';
import { RouterContext } from './router-context';

/** Returns the matched route parameters. */
export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useContext(RouterContext).params as T;
}
