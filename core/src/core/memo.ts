import { LIQUID_MEMO_TYPE, type Props, type ComponentType } from '../shared/types';

export interface MemoComponent<P extends Props = Props> {
  $$typeof: typeof LIQUID_MEMO_TYPE;
  type: ComponentType<P>;
  compare: ((prevProps: P, nextProps: P) => boolean) | null;
  displayName?: string;
}

/**
 * Memoizes a component, skipping re-render if props are shallowly equal.
 * Equivalent to React.memo.
 */
export function memo<P extends Props>(
  component: ComponentType<P>,
  compare?: (prevProps: P, nextProps: P) => boolean,
): MemoComponent<P> {
  return {
    $$typeof: LIQUID_MEMO_TYPE,
    type: component,
    compare: compare || null,
    displayName:
      (component as { displayName?: string }).displayName ||
      (component as { name?: string }).name ||
      'Memo',
  };
}
