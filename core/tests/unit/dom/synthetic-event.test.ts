import { describe, it, expect, vi } from '@asymmetric-effort/nogginlessdom';
import {
  SyntheticEvent,
  SyntheticMouseEvent,
  SyntheticKeyboardEvent,
  SyntheticFocusEvent,
  SyntheticInputEvent,
  SyntheticTouchEvent,
  SyntheticWheelEvent,
  createSyntheticEvent,
  EVENT_NAME_MAP,
} from '../../../src/dom/synthetic-event';

describe('SyntheticEvent', () => {
  it('wraps a native event', () => {
    const native = new Event('click', { bubbles: true, cancelable: true });
    const synthetic = new SyntheticEvent(native);
    expect(synthetic.type).toBe('click');
    expect(synthetic.nativeEvent).toBe(native);
    expect(synthetic.bubbles).toBe(true);
    expect(synthetic.cancelable).toBe(true);
  });

  it('preventDefault calls native preventDefault', () => {
    const native = new Event('click', { cancelable: true });
    const spy = vi.spyOn(native, 'preventDefault');
    const synthetic = new SyntheticEvent(native);
    synthetic.preventDefault();
    expect(spy).toHaveBeenCalled();
    expect(synthetic.isDefaultPrevented()).toBe(true);
  });

  it('stopPropagation calls native stopPropagation', () => {
    const native = new Event('click');
    const spy = vi.spyOn(native, 'stopPropagation');
    const synthetic = new SyntheticEvent(native);
    synthetic.stopPropagation();
    expect(spy).toHaveBeenCalled();
    expect(synthetic.isPropagationStopped()).toBe(true);
  });

  it('stopImmediatePropagation calls native', () => {
    const native = new Event('click');
    const spy = vi.spyOn(native, 'stopImmediatePropagation');
    const synthetic = new SyntheticEvent(native);
    synthetic.stopImmediatePropagation();
    expect(spy).toHaveBeenCalled();
    expect(synthetic.isPropagationStopped()).toBe(true);
  });

  it('persist is a no-op', () => {
    const native = new Event('click');
    const synthetic = new SyntheticEvent(native);
    expect(() => synthetic.persist()).not.toThrow();
  });

  it('isDefaultPrevented is false initially', () => {
    const native = new Event('click');
    const synthetic = new SyntheticEvent(native);
    expect(synthetic.isDefaultPrevented()).toBe(false);
  });

  it('isPropagationStopped is false initially', () => {
    const native = new Event('click');
    const synthetic = new SyntheticEvent(native);
    expect(synthetic.isPropagationStopped()).toBe(false);
  });
});

describe('SyntheticMouseEvent', () => {
  it('captures mouse properties', () => {
    const native = new MouseEvent('click', {
      clientX: 100,
      clientY: 200,
      button: 0,
      altKey: true,
    });
    const synthetic = new SyntheticMouseEvent(native);
    expect(synthetic.clientX).toBe(100);
    expect(synthetic.clientY).toBe(200);
    expect(synthetic.button).toBe(0);
    expect(synthetic.altKey).toBe(true);
    expect(synthetic.ctrlKey).toBe(false);
  });
});

describe('SyntheticMouseEvent — getModifierState', () => {
  it('delegates getModifierState to native event', () => {
    const native = new MouseEvent('click', { shiftKey: true });
    const synthetic = new SyntheticMouseEvent(native);
    // getModifierState('Shift') should return true when shiftKey is set
    expect(synthetic.getModifierState('Shift')).toBe(true);
    expect(synthetic.getModifierState('Control')).toBe(false);
  });
});

describe('SyntheticKeyboardEvent', () => {
  it('captures keyboard properties', () => {
    const native = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      shiftKey: true,
      repeat: false,
    });
    const synthetic = new SyntheticKeyboardEvent(native);
    expect(synthetic.key).toBe('Enter');
    expect(synthetic.code).toBe('Enter');
    expect(synthetic.shiftKey).toBe(true);
    expect(synthetic.repeat).toBe(false);
  });
});

describe('SyntheticKeyboardEvent — getModifierState', () => {
  it('delegates getModifierState to native event', () => {
    const native = new KeyboardEvent('keydown', { ctrlKey: true, key: 'a' });
    const synthetic = new SyntheticKeyboardEvent(native);
    expect(synthetic.getModifierState('Control')).toBe(true);
    expect(synthetic.getModifierState('Alt')).toBe(false);
  });
});

describe('SyntheticFocusEvent', () => {
  it('captures relatedTarget', () => {
    const native = new FocusEvent('focus', { relatedTarget: null });
    const synthetic = new SyntheticFocusEvent(native);
    expect(synthetic.relatedTarget).toBeNull();
  });
});

describe('SyntheticWheelEvent', () => {
  it('captures wheel delta', () => {
    const native = new WheelEvent('wheel', {
      deltaX: 10,
      deltaY: -20,
      deltaMode: 0,
    });
    const synthetic = new SyntheticWheelEvent(native);
    expect(synthetic.deltaX).toBe(10);
    expect(synthetic.deltaY).toBe(-20);
    expect(synthetic.deltaMode).toBe(0);
  });
});

describe('SyntheticInputEvent', () => {
  it('captures input event properties', () => {
    const native = new InputEvent('input', {
      data: 'a',
      inputType: 'insertText',
    });
    const synthetic = new SyntheticInputEvent(native);
    expect(synthetic.data).toBe('a');
    expect(synthetic.inputType).toBe('insertText');
    expect(synthetic.type).toBe('input');
  });
});

describe('SyntheticTouchEvent', () => {
  it('captures touch event properties', () => {
    const native = new TouchEvent('touchstart', {
      altKey: true,
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
    });
    const synthetic = new SyntheticTouchEvent(native);
    expect(synthetic.altKey).toBe(true);
    expect(synthetic.ctrlKey).toBe(false);
    expect(synthetic.metaKey).toBe(true);
    expect(synthetic.shiftKey).toBe(false);
    expect(synthetic.type).toBe('touchstart');
    expect(synthetic.touches).toBeDefined();
    expect(synthetic.targetTouches).toBeDefined();
    expect(synthetic.changedTouches).toBeDefined();
  });
});

describe('createSyntheticEvent', () => {
  it('creates SyntheticMouseEvent for MouseEvent', () => {
    const native = new MouseEvent('click');
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticMouseEvent);
  });

  it('creates SyntheticKeyboardEvent for KeyboardEvent', () => {
    const native = new KeyboardEvent('keydown');
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticKeyboardEvent);
  });

  it('creates SyntheticFocusEvent for FocusEvent', () => {
    const native = new FocusEvent('focus');
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticFocusEvent);
  });

  it('creates SyntheticWheelEvent for WheelEvent', () => {
    const native = new WheelEvent('wheel');
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticWheelEvent);
  });

  it('creates SyntheticInputEvent for InputEvent', () => {
    const native = new InputEvent('input', { data: 'x', inputType: 'insertText' });
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticInputEvent);
  });

  it('creates SyntheticTouchEvent for TouchEvent', () => {
    const native = new TouchEvent('touchstart');
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticTouchEvent);
  });

  it('falls back to SyntheticEvent for generic Event', () => {
    const native = new Event('custom');
    const synthetic = createSyntheticEvent(native);
    expect(synthetic).toBeInstanceOf(SyntheticEvent);
    expect(synthetic).not.toBeInstanceOf(SyntheticMouseEvent);
  });
});

describe('EVENT_NAME_MAP', () => {
  it('maps onClick to click', () => {
    expect(EVENT_NAME_MAP.onClick).toBe('click');
  });

  it('maps onKeyDown to keydown', () => {
    expect(EVENT_NAME_MAP.onKeyDown).toBe('keydown');
  });

  it('maps onDoubleClick to dblclick', () => {
    expect(EVENT_NAME_MAP.onDoubleClick).toBe('dblclick');
  });

  it('maps onSubmit to submit', () => {
    expect(EVENT_NAME_MAP.onSubmit).toBe('submit');
  });

  it('covers all common events', () => {
    const expectedEvents = [
      'onClick',
      'onMouseDown',
      'onMouseUp',
      'onMouseMove',
      'onKeyDown',
      'onKeyUp',
      'onFocus',
      'onBlur',
      'onChange',
      'onInput',
      'onSubmit',
      'onScroll',
      'onWheel',
      'onDrag',
      'onDrop',
      'onContextMenu',
      'onCopy',
      'onCut',
      'onPaste',
    ];
    for (const name of expectedEvents) {
      expect(EVENT_NAME_MAP).toHaveProperty(name);
    }
  });
});
