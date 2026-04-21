import { describe, it, expect, vi } from 'vitest';
import { startTransition } from '../../../src/core/transitions';
import { isInTransition } from '../../../src/core/transitions';

describe('startTransition', () => {
  it('executes the callback synchronously', () => {
    const fn = vi.fn();
    startTransition(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('marks isInTransition as true during callback', () => {
    let wasInTransition = false;
    startTransition(() => {
      wasInTransition = isInTransition();
    });
    expect(wasInTransition).toBe(true);
  });

  it('resets isInTransition after callback', () => {
    startTransition(() => {});
    expect(isInTransition()).toBe(false);
  });

  it('resets isInTransition even if callback throws', () => {
    expect(() => {
      startTransition(() => {
        throw new Error('oops');
      });
    }).toThrow('oops');
    expect(isInTransition()).toBe(false);
  });

  it('handles nested transitions', () => {
    let innerCheck = false;
    startTransition(() => {
      startTransition(() => {
        innerCheck = isInTransition();
      });
    });
    expect(innerCheck).toBe(true);
    expect(isInTransition()).toBe(false);
  });
});
