import { describe, it, expect } from '@asymmetric-effort/nogginlessdom';
import { reconcileChildren } from '../../../src/core/reconciler';
import {
  createHostRootFiber,
  createFiberFromElement,
  createFiberFromText,
} from '../../../src/core/fiber';
import { createElement } from '../../../src/index';
import { FiberTag, EffectTag } from '../../../src/shared/types';

function collectChildren(firstChild: ReturnType<typeof reconcileChildren>) {
  const children: Array<{
    tag: number;
    type: unknown;
    key: unknown;
    index: number;
    effectTag: number;
  }> = [];
  let child = firstChild;
  while (child !== null) {
    children.push({
      tag: child.tag,
      type: child.type,
      key: child.key,
      index: child.index,
      effectTag: child.effectTag,
    });
    child = child.sibling;
  }
  return children;
}

describe('reconcileChildren', () => {
  describe('initial render (no current children)', () => {
    it('creates a single host element', () => {
      const parent = createHostRootFiber();
      const child = reconcileChildren(parent, null, createElement('div', { id: 'root' }), 0);
      expect(child).not.toBeNull();
      expect(child!.tag).toBe(FiberTag.HostComponent);
      expect(child!.type).toBe('div');
      expect(child!.effectTag).toBe(EffectTag.Placement);
      expect(child!.return).toBe(parent);
    });

    it('creates a single text node', () => {
      const parent = createHostRootFiber();
      const child = reconcileChildren(parent, null, 'hello', 0);
      expect(child).not.toBeNull();
      expect(child!.tag).toBe(FiberTag.HostText);
      expect(child!.effectTag).toBe(EffectTag.Placement);
    });

    it('creates multiple children as siblings', () => {
      const parent = createHostRootFiber();
      const child = reconcileChildren(
        parent,
        null,
        [createElement('div', { key: 'a' }), createElement('span', { key: 'b' }), 'text'],
        0,
      );

      const children = collectChildren(child);
      expect(children).toHaveLength(3);
      expect(children[0]!.type).toBe('div');
      expect(children[0]!.index).toBe(0);
      expect(children[1]!.type).toBe('span');
      expect(children[1]!.index).toBe(1);
      expect(children[2]!.tag).toBe(FiberTag.HostText);
      expect(children[2]!.index).toBe(2);
    });

    it('returns null for empty children', () => {
      const parent = createHostRootFiber();
      expect(reconcileChildren(parent, null, null, 0)).toBeNull();
      expect(reconcileChildren(parent, null, [], 0)).toBeNull();
    });

    it('filters out booleans and null from arrays', () => {
      const parent = createHostRootFiber();
      const child = reconcileChildren(
        parent,
        null,
        [null, true, createElement('div', null), false],
        0,
      );
      const children = collectChildren(child);
      expect(children).toHaveLength(1);
      expect(children[0]!.type).toBe('div');
    });
  });

  describe('reconciliation (with existing children)', () => {
    it('reuses fiber when type matches on single child', () => {
      const parent = createHostRootFiber();

      // Initial render
      const firstChild = reconcileChildren(
        parent,
        null,
        createElement('div', { className: 'old' }),
        0,
      );

      // Update
      const updated = reconcileChildren(
        parent,
        firstChild,
        createElement('div', { className: 'new' }),
        0,
      );

      expect(updated).not.toBeNull();
      expect(updated!.alternate).toBe(firstChild);
      expect(updated!.pendingProps.className).toBe('new');
    });

    it('replaces fiber when type changes on single child', () => {
      const parent = createHostRootFiber();

      const firstChild = reconcileChildren(parent, null, createElement('div', null), 0);

      const updated = reconcileChildren(parent, firstChild, createElement('span', null), 0);

      expect(updated).not.toBeNull();
      expect(updated!.type).toBe('span');
      expect(updated!.alternate).toBeNull(); // new fiber, not reused
      expect(updated!.effectTag).toBe(EffectTag.Placement);
    });

    it('reuses keyed children that stay in order', () => {
      const parent = createHostRootFiber();

      const first = reconcileChildren(
        parent,
        null,
        [createElement('div', { key: 'a' }), createElement('span', { key: 'b' })],
        0,
      );

      const updated = reconcileChildren(
        parent,
        first,
        [createElement('div', { key: 'a', className: 'new' }), createElement('span', { key: 'b' })],
        0,
      );

      const children = collectChildren(updated);
      expect(children).toHaveLength(2);
      // First child should be reused (has alternate)
      expect(updated!.alternate).not.toBeNull();
      expect(updated!.pendingProps.className).toBe('new');
    });

    it('handles reordered keyed children', () => {
      const parent = createHostRootFiber();

      const first = reconcileChildren(
        parent,
        null,
        [
          createElement('div', { key: 'a' }),
          createElement('span', { key: 'b' }),
          createElement('p', { key: 'c' }),
        ],
        0,
      );

      // Reverse order
      const updated = reconcileChildren(
        parent,
        first,
        [
          createElement('p', { key: 'c' }),
          createElement('span', { key: 'b' }),
          createElement('div', { key: 'a' }),
        ],
        0,
      );

      const children = collectChildren(updated);
      expect(children).toHaveLength(3);
      expect(children[0]!.type).toBe('p');
      expect(children[0]!.key).toBe('c');
      expect(children[1]!.type).toBe('span');
      expect(children[1]!.key).toBe('b');
      expect(children[2]!.type).toBe('div');
      expect(children[2]!.key).toBe('a');
    });

    it('deletes removed children', () => {
      const parent = createHostRootFiber();

      const first = reconcileChildren(
        parent,
        null,
        [
          createElement('div', { key: 'a' }),
          createElement('span', { key: 'b' }),
          createElement('p', { key: 'c' }),
        ],
        0,
      );

      // Remove middle child
      const updated = reconcileChildren(
        parent,
        first,
        [createElement('div', { key: 'a' }), createElement('p', { key: 'c' })],
        0,
      );

      const children = collectChildren(updated);
      expect(children).toHaveLength(2);
      expect(children[0]!.key).toBe('a');
      expect(children[1]!.key).toBe('c');

      // The deleted child should be tracked in parent's updateQueue
      const deletions = parent.updateQueue as unknown[];
      expect(deletions).toBeDefined();
      expect(deletions.length).toBeGreaterThanOrEqual(1);
    });

    it('adds new children', () => {
      const parent = createHostRootFiber();

      const first = reconcileChildren(parent, null, [createElement('div', { key: 'a' })], 0);

      const updated = reconcileChildren(
        parent,
        first,
        [createElement('div', { key: 'a' }), createElement('span', { key: 'b' })],
        0,
      );

      const children = collectChildren(updated);
      expect(children).toHaveLength(2);
      expect(children[1]!.key).toBe('b');
      expect(children[1]!.effectTag).toBe(EffectTag.Placement);
    });

    it('replaces text with element', () => {
      const parent = createHostRootFiber();
      const textFiber = reconcileChildren(parent, null, 'old text', 0);

      const updated = reconcileChildren(parent, textFiber, createElement('div', null), 0);

      expect(updated!.tag).toBe(FiberTag.HostComponent);
      expect(updated!.type).toBe('div');
    });

    it('replaces element with text', () => {
      const parent = createHostRootFiber();
      const elementFiber = reconcileChildren(parent, null, createElement('div', null), 0);

      const updated = reconcileChildren(parent, elementFiber, 'new text', 0);
      expect(updated!.tag).toBe(FiberTag.HostText);
    });

    it('handles single child key mismatch — deletes non-matching key siblings', () => {
      const parent = createHostRootFiber();

      // Create initial children: key 'a' then key 'b' (siblings)
      const first = reconcileChildren(
        parent,
        null,
        [createElement('div', { key: 'a' }), createElement('span', { key: 'b' })],
        0,
      );

      // Now reconcile with a single child with key 'b'
      // This forces the reconciler to skip key 'a' (deleteChild) and find key 'b'
      const updated = reconcileChildren(
        parent,
        first,
        createElement('span', { key: 'b', className: 'updated' }),
        0,
      );

      expect(updated).not.toBeNull();
      expect(updated!.type).toBe('span');
      expect(updated!.pendingProps.className).toBe('updated');
    });

    it('handles single child key match but type differs', () => {
      const parent = createHostRootFiber();

      // Create initial child with key 'k'
      const first = reconcileChildren(parent, null, createElement('div', { key: 'k' }), 0);

      // Reconcile with same key but different type — should delete old and create new
      const updated = reconcileChildren(parent, first, createElement('span', { key: 'k' }), 0);

      expect(updated).not.toBeNull();
      expect(updated!.type).toBe('span');
      expect(updated!.alternate).toBeNull(); // new fiber
      expect(updated!.effectTag).toBe(EffectTag.Placement);
    });

    it('handles updateSlot returning null — key mismatch triggers pass 2', () => {
      const parent = createHostRootFiber();

      // Create keyed children
      const first = reconcileChildren(
        parent,
        null,
        [createElement('div', { key: 'a' }), createElement('span', { key: 'b' })],
        0,
      );

      // Reorder with different keys first — key mismatch in pass 1 triggers pass 2
      const updated = reconcileChildren(
        parent,
        first,
        [createElement('span', { key: 'b' }), createElement('div', { key: 'a' })],
        0,
      );

      const children = collectChildren(updated);
      expect(children).toHaveLength(2);
      expect(children[0]!.key).toBe('b');
      expect(children[1]!.key).toBe('a');
    });

    it('handles text node in multi-child reconciliation with existing text', () => {
      const parent = createHostRootFiber();

      // Initial: text nodes
      const first = reconcileChildren(parent, null, ['hello', 'world'], 0);

      // Update text
      const updated = reconcileChildren(parent, first, ['updated', 'text'], 0);

      const children = collectChildren(updated);
      expect(children).toHaveLength(2);
      expect(children[0]!.tag).toBe(FiberTag.HostText);
      expect(children[1]!.tag).toBe(FiberTag.HostText);
    });

    it('handles pass 1 with oldFiber.index > newIdx (null oldFiber reset)', () => {
      const parent = createHostRootFiber();

      // Create children with specific indices
      const first = reconcileChildren(
        parent,
        null,
        [
          createElement('div', { key: 'a' }),
          createElement('div', { key: 'b' }),
          createElement('div', { key: 'c' }),
        ],
        0,
      );

      // Manipulate the fiber index to be ahead
      // This simulates the oldFiber.index > newIdx condition (line 141-143)
      if (first) {
        first.index = 5; // Set high index
      }

      const updated = reconcileChildren(
        parent,
        first,
        [createElement('div', { key: 'x' }), createElement('div', { key: 'y' })],
        0,
      );

      const children = collectChildren(updated);
      expect(children.length).toBeGreaterThanOrEqual(2);
    });

    it('deletes all children when new children is null', () => {
      const parent = createHostRootFiber();
      parent.updateQueue = null;

      const first = reconcileChildren(
        parent,
        null,
        [createElement('div', { key: 'a' }), createElement('span', { key: 'b' })],
        0,
      );

      const updated = reconcileChildren(parent, first, null, 0);
      expect(updated).toBeNull();

      const deletions = parent.updateQueue as unknown[];
      expect(deletions).toBeDefined();
      expect(deletions.length).toBe(2);
    });
  });
});
