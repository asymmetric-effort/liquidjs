# Forms and Validation

This guide covers building forms in SpecifyJS, from basic inputs to complex multi-step wizards with async validation.

## Controlled Components

SpecifyJS forms follow the controlled component pattern: the component state is the single source of truth, and user input is fed back through event handlers.

```typescript
import { createElement } from 'specifyjs';
import { useState } from 'specifyjs/hooks';

function NameInput() {
  const [name, setName] = useState('');

  return createElement('input', {
    type: 'text',
    value: name,
    onInput: (e: Event) => setName((e.target as HTMLInputElement).value),
  });
}
```

The `value` prop locks the input to the current state. The `onInput` handler updates state on every keystroke, which triggers a re-render with the new value. This gives you full control over what the user sees and lets you intercept, transform, or reject input before it reaches the DOM.

## Building a Basic Form

A typical form composes multiple controlled inputs and handles submission:

```typescript
function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log({ name, email });
  };

  return createElement('form', { onSubmit: handleSubmit },
    createElement('label', null, 'Name'),
    createElement('input', {
      type: 'text',
      value: name,
      onInput: (e: Event) => setName((e.target as HTMLInputElement).value),
    }),
    createElement('label', null, 'Email'),
    createElement('input', {
      type: 'email',
      value: email,
      onInput: (e: Event) => setEmail((e.target as HTMLInputElement).value),
    }),
    createElement('button', { type: 'submit' }, 'Send'),
  );
}
```

Always call `e.preventDefault()` in the submit handler to prevent the browser from performing a full page navigation.

## Using FormFieldWrapper for Consistent Styling

The `FormFieldWrapper` component provides a standardized container with label, help text, error display, required indicator, and disabled styling. All form components in the `@specifyjs/components` library use it internally.

```typescript
import { FormFieldWrapper } from '@specifyjs/form-wrapper';

function StyledInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  return createElement(FormFieldWrapper, {
    label: 'Username',
    required: true,
    helpText: 'Choose a unique username',
    error: error,
  },
    createElement('input', {
      type: 'text',
      value: value,
      onInput: (e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        setValue(v);
        setError(v.length < 3 ? 'Must be at least 3 characters' : undefined);
      },
    }),
  );
}
```

The wrapper handles label-to-input linking via `htmlFor`, displays a red asterisk for required fields, and switches between help text and error messages automatically. Customize colors, fonts, and spacing through the `styling` prop.

For single-line text inputs, the pre-built `TextField` component wraps `FormFieldWrapper` with focus/blur state management, prefix/suffix addon slots, and keyboard handling (e.g., `onEnter`):

```typescript
import { TextField } from '@specifyjs/textfield';

createElement(TextField, {
  label: 'Email',
  type: 'email',
  value: email,
  onChange: setEmail,
  error: emailError,
  required: true,
  placeholder: 'you@example.com',
});
```

## Input Validation Patterns

### Inline Validation

Validate on every change or on blur. Blur validation avoids showing errors while the user is still typing:

```typescript
function ValidatedEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const validate = (value: string): string | undefined => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
    return undefined;
  };

  return createElement(TextField, {
    label: 'Email',
    type: 'email',
    value: email,
    onChange: setEmail,
    onBlur: (v: string) => setError(validate(v)),
    error: error,
    required: true,
  });
}
```

### Form-Level Validation

For forms with many fields, centralize validation in a single function that returns an errors map:

```typescript
interface FormData { name: string; age: string; email: string; }
type Errors = Partial<Record<keyof FormData, string>>;

function validateForm(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.name) errors.name = 'Name is required';
  if (!data.age || Number(data.age) < 18) errors.age = 'Must be 18 or older';
  if (!data.email) errors.email = 'Email is required';
  return errors;
}

function RegistrationForm() {
  const [data, setData] = useState<FormData>({ name: '', age: '', email: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData) => (value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateForm(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Submit the data
    }
  };

  return createElement('form', { onSubmit: handleSubmit },
    createElement(TextField, { label: 'Name', value: data.name, onChange: update('name'), error: errors.name, required: true }),
    createElement(TextField, { label: 'Age', type: 'number', value: data.age, onChange: update('age'), error: errors.age, required: true }),
    createElement(TextField, { label: 'Email', type: 'email', value: data.email, onChange: update('email'), error: errors.email, required: true }),
    createElement('button', { type: 'submit' }, 'Register'),
  );
}
```

### Custom Validation with useReducer

For complex validation logic, `useReducer` keeps state transitions predictable:

```typescript
type Action =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'VALIDATE' }
  | { type: 'RESET' };

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case 'VALIDATE':
      return { ...state, errors: validateForm(state.values) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
```

## Displaying Validation Errors

When using `FormFieldWrapper` or `TextField`, pass the `error` prop. The wrapper automatically renders the error with `role="alert"` for screen readers. For custom error displays:

```typescript
createElement('div', { className: 'error-summary', role: 'alert' },
  Object.entries(errors).map(([field, msg]) =>
    createElement('p', { key: field, style: { color: '#ef4444' } }, `${field}: ${msg}`),
  ),
);
```

## Async Validation

Use `useEffect` with a debounce pattern to validate against a server:

```typescript
function UsernameField() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (username.length < 3) {
      setError(username ? 'Too short' : undefined);
      return;
    }
    setChecking(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/check-username?u=${encodeURIComponent(username)}`);
      const { available } = await res.json();
      setError(available ? undefined : 'Username is taken');
      setChecking(false);
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [username]);

  return createElement(TextField, {
    label: 'Username',
    value: username,
    onChange: setUsername,
    error: error,
    suffix: checking ? 'Checking...' : null,
    required: true,
  });
}
```

## Select and Radio Groups

Build select dropdowns and radio groups as controlled components:

```typescript
function ColorPicker() {
  const [color, setColor] = useState('red');

  return createElement(FormFieldWrapper, { label: 'Favorite Color' },
    createElement('select', {
      value: color,
      onChange: (e: Event) => setColor((e.target as HTMLSelectElement).value),
    },
      createElement('option', { value: 'red' }, 'Red'),
      createElement('option', { value: 'green' }, 'Green'),
      createElement('option', { value: 'blue' }, 'Blue'),
    ),
  );
}

function SizeSelector() {
  const [size, setSize] = useState('medium');
  const sizes = ['small', 'medium', 'large'];

  return createElement(FormFieldWrapper, { label: 'Size' },
    ...sizes.map(s =>
      createElement('label', { key: s, style: { marginRight: '12px' } },
        createElement('input', {
          type: 'radio',
          name: 'size',
          value: s,
          checked: size === s,
          onChange: () => setSize(s),
        }),
        ` ${s}`,
      ),
    ),
  );
}
```

## File Uploads

Use an uncontrolled input (type `file` cannot be controlled) and read the file via a ref or event:

```typescript
function FileUpload() {
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
    setUploading(false);
  };

  return createElement(FormFieldWrapper, { label: 'Attachment' },
    createElement('input', { type: 'file', onChange: handleFile }),
    fileName ? createElement('span', null, uploading ? 'Uploading...' : `Selected: ${fileName}`) : null,
  );
}
```

## Date and Time Pickers

Use native HTML date/time inputs as controlled components:

```typescript
function DateRange() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  return createElement('div', { style: { display: 'flex', gap: '16px' } },
    createElement(TextField, { label: 'Start Date', type: 'date' as any, value: start, onChange: setStart }),
    createElement(TextField, { label: 'End Date', type: 'date' as any, value: end, onChange: setEnd,
      error: end && start && end < start ? 'End must be after start' : undefined }),
  );
}
```

## Multi-Step Forms (Wizards)

Track the current step in state and render one section at a time:

```typescript
function WizardForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', email: '', plan: 'free' });

  const steps = [
    () => createElement(TextField, { label: 'Name', value: data.name, onChange: (v: string) => setData(d => ({ ...d, name: v })) }),
    () => createElement(TextField, { label: 'Email', type: 'email', value: data.email, onChange: (v: string) => setData(d => ({ ...d, email: v })) }),
    () => createElement('div', null,
      createElement('h3', null, 'Confirm'),
      createElement('p', null, `Name: ${data.name}`),
      createElement('p', null, `Email: ${data.email}`),
    ),
  ];

  return createElement('div', null,
    createElement('p', null, `Step ${step + 1} of ${steps.length}`),
    steps[step](),
    createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '16px' } },
      step > 0
        ? createElement('button', { onClick: () => setStep(s => s - 1) }, 'Back')
        : null,
      step < steps.length - 1
        ? createElement('button', { onClick: () => setStep(s => s + 1) }, 'Next')
        : createElement('button', { onClick: () => console.log('Submit', data) }, 'Submit'),
    ),
  );
}
```

## Best Practices

1. **Prefer controlled components.** Keeping form state in SpecifyJS gives you full control over validation, formatting, and conditional logic.

2. **Validate on blur for UX, on submit for safety.** Show errors after the user finishes a field, but always re-validate the entire form before submitting.

3. **Debounce async validation.** Network requests on every keystroke waste bandwidth and create race conditions. Use a 300-500ms delay.

4. **Use `FormFieldWrapper` for consistency.** It handles labels, errors, required indicators, and accessibility attributes so you do not have to.

5. **Set `aria-invalid` and `role="alert"`.** Screen readers need these attributes to announce validation errors. `FormFieldWrapper` and `TextField` handle this automatically.

6. **Avoid derived state.** Do not store both the raw value and a "cleaned" version. Derive formatted values during render with `useMemo` instead.

7. **Disable the submit button during async operations.** Prevent duplicate submissions by tracking a `submitting` state flag.

8. **Use `key` props on dynamic field lists.** When fields are added or removed dynamically, stable keys prevent input state from jumping between fields.
