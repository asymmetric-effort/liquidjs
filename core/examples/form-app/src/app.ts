import { createElement, Fragment, createContext } from '../../../src/index';
import { useState, useContext, useCallback, useMemo, useEffect, useRef } from '../../../src/hooks/index';
import { createRoot } from '../../../src/dom/create-root';

// Theme context
interface Theme {
  primary: string;
  background: string;
  text: string;
  name: string;
}

const lightTheme: Theme = { primary: '#3b82f6', background: '#ffffff', text: '#1f2937', name: 'light' };
const darkTheme: Theme = { primary: '#60a5fa', background: '#1f2937', text: '#f9fafb', name: 'dark' };

const ThemeContext = createContext<Theme>(lightTheme);
const ThemeToggleContext = createContext<() => void>(() => {});

function ThemeProvider(props: { children: unknown }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggle = useCallback(() => setIsDark((prev: boolean) => !prev), []);

  return createElement(
    ThemeContext.Provider as unknown as () => null, { value: theme },
    createElement(
      ThemeToggleContext.Provider as unknown as () => null, { value: toggle },
      props.children,
    ),
  );
}

function ThemeToggle() {
  const theme = useContext(ThemeContext);
  const toggle = useContext(ThemeToggleContext);

  return createElement('button', {
    onClick: toggle,
    className: 'theme-toggle',
    'data-testid': 'theme-toggle',
    style: { backgroundColor: theme.primary, color: '#fff' },
  }, `Switch to ${theme.name === 'light' ? 'Dark' : 'Light'}`);
}

// Form with validation
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function ContactForm() {
  const theme = useContext(ThemeContext);
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const validate = useCallback((data: FormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = 'Name is required';
    if (!data.email.trim()) errs.email = 'Email is required';
    else if (!data.email.includes('@')) errs.email = 'Invalid email';
    if (!data.message.trim()) errs.message = 'Message is required';
    else if (data.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  }, []);

  const isValid = useMemo(() => {
    const errs = validate(form);
    return Object.keys(errs).length === 0;
  }, [form, validate]);

  const handleChange = useCallback((field: keyof FormData) => (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setForm((prev: FormData) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback((_e?: Event) => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  }, [form, validate]);

  const handleReset = useCallback(() => {
    setForm({ name: '', email: '', message: '' });
    setErrors({});
    setSubmitted(false);
  }, []);

  if (submitted) {
    return createElement('div', {
      className: 'success',
      'data-testid': 'success-message',
      style: { color: theme.primary },
    },
      createElement('h2', null, 'Thank you!'),
      createElement('p', null, `We received your message, ${form.name}.`),
      createElement('button', {
        onClick: handleReset,
        'data-testid': 'reset-form',
      }, 'Send another'),
    );
  }

  return createElement('form', {
    onSubmit: handleSubmit,
    className: 'contact-form',
    'data-testid': 'contact-form',
    style: { backgroundColor: theme.background, color: theme.text },
  },
    createElement('h2', null, 'Contact Us'),

    createElement('div', { className: 'field' },
      createElement('label', { htmlFor: 'name' }, 'Name'),
      createElement('input', {
        id: 'name',
        type: 'text',
        value: form.name,
        onInput: handleChange('name'),
        ref: nameInputRef,
        'data-testid': 'name-input',
      }),
      errors.name ? createElement('span', { className: 'error', 'data-testid': 'name-error' }, errors.name) : null,
    ),

    createElement('div', { className: 'field' },
      createElement('label', { htmlFor: 'email' }, 'Email'),
      createElement('input', {
        id: 'email',
        type: 'email',
        value: form.email,
        onInput: handleChange('email'),
        'data-testid': 'email-input',
      }),
      errors.email ? createElement('span', { className: 'error', 'data-testid': 'email-error' }, errors.email) : null,
    ),

    createElement('div', { className: 'field' },
      createElement('label', { htmlFor: 'message' }, 'Message'),
      createElement('textarea', {
        id: 'message',
        value: form.message,
        onInput: handleChange('message'),
        'data-testid': 'message-input',
      }),
      errors.message ? createElement('span', { className: 'error', 'data-testid': 'message-error' }, errors.message) : null,
    ),

    createElement('div', { className: 'actions' },
      createElement('button', {
        type: 'button',
        onClick: handleSubmit,
        'data-testid': 'submit-btn',
        style: { backgroundColor: theme.primary, color: '#fff' },
      }, 'Send Message'),
      createElement('button', {
        type: 'button',
        onClick: handleReset,
        'data-testid': 'form-reset',
      }, 'Reset'),
    ),

    createElement('div', { className: 'status' },
      createElement('span', { 'data-testid': 'validity' }, isValid ? 'Form is valid' : 'Form has errors'),
    ),
  );
}

function FormApp() {
  return createElement(ThemeProvider, null,
    createElement('div', { className: 'form-app', id: 'form-app' },
      createElement(ThemeToggle, null),
      createElement(ContactForm, null),
    ),
  );
}

// Mount
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(createElement(FormApp, null));
}

export { FormApp };
