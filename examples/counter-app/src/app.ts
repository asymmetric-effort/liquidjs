import { createElement, Fragment } from '../../../src/index';
import { useState, useEffect, useRef, useReducer, useId, useMemo, useCallback } from '../../../src/hooks/index';
import { createRoot } from '../../../src/dom/create-root';

type CounterAction =
  | { type: 'increment'; step: number }
  | { type: 'decrement'; step: number }
  | { type: 'reset' }
  | { type: 'set'; value: number };

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case 'increment': return state + action.step;
    case 'decrement': return state - action.step;
    case 'reset': return 0;
    case 'set': return action.value;
  }
}

function StepCounter() {
  const [step, setStep] = useState(1);
  const [count, dispatch] = useReducer(counterReducer, 0);
  const counterId = useId();
  const renderCount = useRef(0);

  renderCount.current++;

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  const isEven = useMemo(() => count % 2 === 0, [count]);
  const doubleCount = useMemo(() => count * 2, [count]);

  const handleIncrement = useCallback(() => {
    dispatch({ type: 'increment', step });
  }, [step]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: 'decrement', step });
  }, [step]);

  return createElement('div', { className: 'counter-app', id: 'counter-app' },
    createElement('h1', null, 'Step Counter'),

    createElement('div', { className: 'display', id: 'count-display' },
      createElement('span', {
        className: `count ${count > 0 ? 'positive' : count < 0 ? 'negative' : ''}`,
        id: 'count-value',
        'data-testid': 'count',
      }, String(count)),
      createElement('div', { className: 'meta' },
        createElement('span', { 'data-testid': 'is-even' }, isEven ? 'Even' : 'Odd'),
        createElement('span', { 'data-testid': 'double' }, `Double: ${doubleCount}`),
        createElement('span', { 'data-testid': 'renders' }, `Renders: ${renderCount.current}`),
      ),
    ),

    createElement('div', { className: 'controls' },
      createElement('button', {
        onClick: handleDecrement,
        'data-testid': 'dec-btn',
        id: 'dec-btn',
      }, `- ${step}`),
      createElement('button', {
        onClick: () => dispatch({ type: 'reset' }),
        'data-testid': 'reset-btn',
        id: 'reset-btn',
      }, 'Reset'),
      createElement('button', {
        onClick: handleIncrement,
        'data-testid': 'inc-btn',
        id: 'inc-btn',
      }, `+ ${step}`),
    ),

    createElement('div', { className: 'step-control' },
      createElement('label', { htmlFor: `${counterId}-step` }, 'Step size: '),
      createElement('input', {
        type: 'range',
        id: `${counterId}-step`,
        min: '1',
        max: '10',
        value: String(step),
        onChange: (e: Event) => setStep(Number((e.target as HTMLInputElement).value)),
        'data-testid': 'step-slider',
      }),
      createElement('span', { 'data-testid': 'step-value' }, String(step)),
    ),

    createElement('div', { className: 'direct-set' },
      createElement('label', null, 'Set directly: '),
      createElement('input', {
        type: 'number',
        onChange: (e: Event) => {
          const val = parseInt((e.target as HTMLInputElement).value, 10);
          if (!isNaN(val)) dispatch({ type: 'set', value: val });
        },
        'data-testid': 'direct-input',
      }),
    ),
  );
}

// Mount
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(createElement(StepCounter, null));
}

export { StepCounter };
