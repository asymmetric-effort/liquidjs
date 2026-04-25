import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { Stepper } from '../../../../components/nav/stepper/src/index';
import type { StepItem, StepperOrientation, StepperVariant } from '../../../../components/nav/stepper/src/index';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orientation, setOrientation] = useState<StepperOrientation>('horizontal');
  const [variant, setVariant] = useState<StepperVariant>('circle');

  const steps: StepItem[] = [
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Set up your profile' },
    { label: 'Preferences', description: 'Choose your settings' },
    { label: 'Review', description: 'Confirm your details' },
    { label: 'Complete', description: 'All done!' },
  ];

  const handlePrev = useCallback(() => {
    setCurrentStep((prev: number) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev: number) => Math.min(steps.length - 1, prev + 1));
  }, []);

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'Stepper Demo'),

    createElement(
      'div',
      { style: { display: 'flex', gap: '16px', marginBottom: '24px' } },
      createElement('button', {
        onClick: () => setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal'),
        style: { padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' },
      }, `Orientation: ${orientation}`),
      createElement('button', {
        onClick: () => setVariant(variant === 'circle' ? 'dot' : 'circle'),
        style: { padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer' },
      }, `Variant: ${variant}`),
    ),

    createElement(
      'div',
      { style: { marginBottom: '32px', minHeight: orientation === 'vertical' ? '300px' : 'auto' } },
      createElement(Stepper, {
        steps,
        currentStep,
        orientation,
        variant,
        clickable: true,
        onChange: handleStepClick,
      }),
    ),

    createElement(
      'div',
      { style: { display: 'flex', gap: '12px', justifyContent: 'center' } },
      createElement('button', {
        onClick: handlePrev,
        disabled: currentStep === 0 || undefined,
        style: {
          padding: '10px 24px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          cursor: currentStep === 0 ? 'default' : 'pointer',
          opacity: currentStep === 0 ? '0.5' : '1',
        },
      }, 'Previous'),
      createElement('button', {
        onClick: handleNext,
        disabled: currentStep === steps.length - 1 || undefined,
        style: {
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#fff',
          cursor: currentStep === steps.length - 1 ? 'default' : 'pointer',
          opacity: currentStep === steps.length - 1 ? '0.5' : '1',
        },
      }, currentStep === steps.length - 1 ? 'Finish' : 'Next'),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
