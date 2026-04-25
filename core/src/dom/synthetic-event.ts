// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Synthetic event system with cross-browser normalization.
 * Events are delegated to the root container for efficiency.
 */

export class SyntheticEvent {
  readonly nativeEvent: Event;
  readonly type: string;
  readonly target: EventTarget | null;
  readonly currentTarget: EventTarget | null;
  readonly timeStamp: number;
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  readonly defaultPrevented: boolean;
  readonly eventPhase: number;
  readonly isTrusted: boolean;

  private _isPropagationStopped = false;
  private _isDefaultPrevented = false;

  constructor(nativeEvent: Event) {
    this.nativeEvent = nativeEvent;
    this.type = nativeEvent.type;
    this.target = nativeEvent.target;
    this.currentTarget = nativeEvent.currentTarget;
    this.timeStamp = nativeEvent.timeStamp;
    this.bubbles = nativeEvent.bubbles;
    this.cancelable = nativeEvent.cancelable;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
  }

  preventDefault(): void {
    this._isDefaultPrevented = true;
    this.nativeEvent.preventDefault();
  }

  stopPropagation(): void {
    this._isPropagationStopped = true;
    this.nativeEvent.stopPropagation();
  }

  stopImmediatePropagation(): void {
    this._isPropagationStopped = true;
    this.nativeEvent.stopImmediatePropagation();
  }

  isDefaultPrevented(): boolean {
    return this._isDefaultPrevented;
  }

  isPropagationStopped(): boolean {
    return this._isPropagationStopped;
  }

  persist(): void {
    // No-op — we don't pool events (React removed pooling in v17)
  }
}

export class SyntheticMouseEvent extends SyntheticEvent {
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly button: number;
  readonly buttons: number;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  readonly movementX: number;
  readonly movementY: number;
  readonly relatedTarget: EventTarget | null;

  constructor(nativeEvent: MouseEvent) {
    super(nativeEvent);
    this.clientX = nativeEvent.clientX;
    this.clientY = nativeEvent.clientY;
    this.pageX = nativeEvent.pageX;
    this.pageY = nativeEvent.pageY;
    this.screenX = nativeEvent.screenX;
    this.screenY = nativeEvent.screenY;
    this.button = nativeEvent.button;
    this.buttons = nativeEvent.buttons;
    this.altKey = nativeEvent.altKey;
    this.ctrlKey = nativeEvent.ctrlKey;
    this.metaKey = nativeEvent.metaKey;
    this.shiftKey = nativeEvent.shiftKey;
    this.movementX = nativeEvent.movementX;
    this.movementY = nativeEvent.movementY;
    this.relatedTarget = nativeEvent.relatedTarget;
  }

  getModifierState(key: string): boolean {
    return (this.nativeEvent as MouseEvent).getModifierState(key);
  }
}

export class SyntheticKeyboardEvent extends SyntheticEvent {
  readonly key: string;
  readonly code: string;
  readonly location: number;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  readonly repeat: boolean;

  constructor(nativeEvent: KeyboardEvent) {
    super(nativeEvent);
    this.key = nativeEvent.key;
    this.code = nativeEvent.code;
    this.location = nativeEvent.location;
    this.altKey = nativeEvent.altKey;
    this.ctrlKey = nativeEvent.ctrlKey;
    this.metaKey = nativeEvent.metaKey;
    this.shiftKey = nativeEvent.shiftKey;
    this.repeat = nativeEvent.repeat;
  }

  getModifierState(key: string): boolean {
    return (this.nativeEvent as KeyboardEvent).getModifierState(key);
  }
}

export class SyntheticFocusEvent extends SyntheticEvent {
  readonly relatedTarget: EventTarget | null;

  constructor(nativeEvent: FocusEvent) {
    super(nativeEvent);
    this.relatedTarget = nativeEvent.relatedTarget;
  }
}

export class SyntheticInputEvent extends SyntheticEvent {
  readonly data: string | null;
  readonly inputType: string;

  constructor(nativeEvent: InputEvent) {
    super(nativeEvent);
    this.data = nativeEvent.data;
    this.inputType = nativeEvent.inputType;
  }
}

export class SyntheticTouchEvent extends SyntheticEvent {
  readonly touches: TouchList;
  readonly targetTouches: TouchList;
  readonly changedTouches: TouchList;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;

  /* v8 ignore next 10 -- TouchEvent is not available in jsdom */
  constructor(nativeEvent: TouchEvent) {
    super(nativeEvent);
    this.touches = nativeEvent.touches;
    this.targetTouches = nativeEvent.targetTouches;
    this.changedTouches = nativeEvent.changedTouches;
    this.altKey = nativeEvent.altKey;
    this.ctrlKey = nativeEvent.ctrlKey;
    this.metaKey = nativeEvent.metaKey;
    this.shiftKey = nativeEvent.shiftKey;
  }
}

export class SyntheticWheelEvent extends SyntheticEvent {
  readonly deltaX: number;
  readonly deltaY: number;
  readonly deltaZ: number;
  readonly deltaMode: number;

  constructor(nativeEvent: WheelEvent) {
    super(nativeEvent);
    this.deltaX = nativeEvent.deltaX;
    this.deltaY = nativeEvent.deltaY;
    this.deltaZ = nativeEvent.deltaZ;
    this.deltaMode = nativeEvent.deltaMode;
  }
}

/**
 * Create the appropriate synthetic event wrapper for a native event.
 */
export function createSyntheticEvent(nativeEvent: Event): SyntheticEvent {
  // Check more specific subclasses before their parents
  if (nativeEvent instanceof WheelEvent) {
    return new SyntheticWheelEvent(nativeEvent);
  }
  if (nativeEvent instanceof KeyboardEvent) {
    return new SyntheticKeyboardEvent(nativeEvent);
  }
  if (nativeEvent instanceof FocusEvent) {
    return new SyntheticFocusEvent(nativeEvent);
  }
  if (typeof InputEvent !== 'undefined' && nativeEvent instanceof InputEvent) {
    return new SyntheticInputEvent(nativeEvent);
  }
  /* v8 ignore next 2 -- TouchEvent is not available in jsdom */
  if (typeof TouchEvent !== 'undefined' && nativeEvent instanceof TouchEvent) {
    return new SyntheticTouchEvent(nativeEvent);
  }
  if (nativeEvent instanceof MouseEvent) {
    return new SyntheticMouseEvent(nativeEvent);
  }
  return new SyntheticEvent(nativeEvent);
}

/**
 * Map of React-style event names to DOM event names.
 */
export const EVENT_NAME_MAP: Record<string, string> = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseMove: 'mousemove',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onKeyDown: 'keydown',
  onKeyUp: 'keyup',
  onKeyPress: 'keypress',
  onFocus: 'focus',
  onBlur: 'blur',
  onChange: 'change',
  onInput: 'input',
  onSubmit: 'submit',
  onReset: 'reset',
  onScroll: 'scroll',
  onWheel: 'wheel',
  onDrag: 'drag',
  onDragStart: 'dragstart',
  onDragEnd: 'dragend',
  onDragEnter: 'dragenter',
  onDragLeave: 'dragleave',
  onDragOver: 'dragover',
  onDrop: 'drop',
  onTouchStart: 'touchstart',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onTouchCancel: 'touchcancel',
  onPointerDown: 'pointerdown',
  onPointerUp: 'pointerup',
  onPointerMove: 'pointermove',
  onPointerEnter: 'pointerenter',
  onPointerLeave: 'pointerleave',
  onPointerOver: 'pointerover',
  onPointerOut: 'pointerout',
  onPointerCancel: 'pointercancel',
  onGotPointerCapture: 'gotpointercapture',
  onLostPointerCapture: 'lostpointercapture',
  onContextMenu: 'contextmenu',
  onCopy: 'copy',
  onCut: 'cut',
  onPaste: 'paste',
  onSelect: 'select',
  onAnimationStart: 'animationstart',
  onAnimationEnd: 'animationend',
  onAnimationIteration: 'animationiteration',
  onTransitionEnd: 'transitionend',
  onLoad: 'load',
  onError: 'error',
  onAbort: 'abort',
};
