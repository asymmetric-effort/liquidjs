import { createElement } from 'specifyjs';
import { useState, useCallback, useRef } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { createToaster, ToastContainer } from '../../../../components/overlay/toast/src/index';
import type { ToastPosition, ToastType, Toaster } from '../../../../components/overlay/toast/src/index';

function ToastDemo() {
  const toasterRef = useRef<Toaster | null>(null);
  if (!toasterRef.current) {
    toasterRef.current = createToaster({ position: 'top-right', maxToasts: 5, defaultDuration: 4000 });
  }
  const toaster = toasterRef.current!;

  // Force re-render on toast changes
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((n: number) => n + 1), []);

  const [position, setPosition] = useState<ToastPosition>('top-right');

  const types: ToastType[] = ['info', 'success', 'warning', 'error'];
  const positions: ToastPosition[] = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'];

  const showToast = useCallback((type: ToastType) => {
    const messages: Record<ToastType, string> = {
      info: 'This is an informational message.',
      success: 'Operation completed successfully!',
      warning: 'Please review before continuing.',
      error: 'Something went wrong. Please try again.',
    };
    toaster.toast(messages[type], { type });
    forceUpdate();
  }, [toaster, forceUpdate]);

  const showWithAction = useCallback(() => {
    toaster.toast('Item deleted.', {
      type: 'warning',
      action: {
        label: 'Undo',
        onClick: () => {
          toaster.toast('Item restored!', { type: 'success' });
          forceUpdate();
        },
      },
    });
    forceUpdate();
  }, [toaster, forceUpdate]);

  const showPersistent = useCallback(() => {
    toaster.toast('This toast will not auto-dismiss. Close it manually.', {
      type: 'info',
      duration: 0,
    });
    forceUpdate();
  }, [toaster, forceUpdate]);

  return createElement(
    'div',
    { className: 'demo' },

    createElement('h1', null, 'Toast Component Demo'),

    // Type variants
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Toast Types'),
      createElement(
        'div',
        { className: 'btn-group' },
        ...types.map((type) =>
          createElement(
            'button',
            {
              key: type,
              className: `btn btn-${type}`,
              onClick: () => showToast(type),
            },
            type.charAt(0).toUpperCase() + type.slice(1),
          ),
        ),
      ),
    ),

    // With action
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Toast with Action'),
      createElement(
        'button',
        { className: 'btn', onClick: showWithAction },
        'Show with Undo Action',
      ),
    ),

    // Persistent
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Persistent Toast'),
      createElement(
        'button',
        { className: 'btn', onClick: showPersistent },
        'Show Persistent Toast',
      ),
    ),

    // Dismiss all
    createElement(
      'section',
      { className: 'demo-section' },
      createElement('h2', null, 'Controls'),
      createElement(
        'button',
        {
          className: 'btn btn-danger',
          onClick: () => {
            toaster.dismissAll();
            forceUpdate();
          },
        },
        'Dismiss All',
      ),
    ),

    // Toast container (renders active toasts)
    createElement(ToastContainer, { toaster }),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(ToastDemo, null));
