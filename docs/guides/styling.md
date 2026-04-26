# Styling

SpecifyJS supports multiple approaches to styling components, from inline styles to CSS classes, CSS modules, and dynamic theming via the Context API.

## Inline Styles with createElement

Pass a `style` prop as a JavaScript object. Property names use camelCase, and numeric values default to pixels:

```typescript
import { createElement } from 'specifyjs';

function Banner() {
  return createElement('div', {
    style: {
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      padding: 24,
      borderRadius: 8,
      fontSize: 18,
      fontWeight: 600,
    },
  }, 'Welcome to SpecifyJS');
}
```

Unitless CSS properties (such as `opacity`, `zIndex`, `fontWeight`, `lineHeight`, and `flex`) are not appended with `px`.

## CSS Classes via className

Use the `className` prop to apply CSS classes defined in external stylesheets:

```typescript
function Card(props: { title: string; body: string }) {
  return createElement('div', { className: 'card' },
    createElement('h2', { className: 'card-title' }, props.title),
    createElement('p', { className: 'card-body' }, props.body),
  );
}
```

For conditional classes, build the string manually:

```typescript
function Button(props: { primary?: boolean; disabled?: boolean; label: string }) {
  const classes = [
    'btn',
    props.primary ? 'btn-primary' : 'btn-default',
    props.disabled ? 'btn-disabled' : '',
  ].filter(Boolean).join(' ');

  return createElement('button', {
    className: classes,
    disabled: props.disabled,
  }, props.label);
}
```

## CSS Modules Approach

CSS Modules scope class names to the component, preventing style collisions. With Vite, any `.module.css` file is automatically treated as a CSS Module:

```css
/* Button.module.css */
.button { padding: 8px 16px; border: none; cursor: pointer; }
.primary { background: #0066cc; color: white; }
.secondary { background: #e0e0e0; color: #333; }
```

```typescript
import styles from './Button.module.css';

function Button(props: { variant: 'primary' | 'secondary'; label: string }) {
  return createElement('button', {
    className: `${styles.button} ${styles[props.variant]}`,
  }, props.label);
}
```

The imported `styles` object maps original class names to unique, scoped identifiers (e.g., `Button_button_x7f3a`).

## Dynamic Styling Patterns

Compute styles based on props or state:

```typescript
function ProgressBar(props: { percent: number }) {
  return createElement('div', {
    style: { background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  },
    createElement('div', {
      style: {
        width: `${Math.min(100, Math.max(0, props.percent))}%`,
        height: 8,
        background: props.percent >= 100 ? '#22c55e' : '#3b82f6',
        transition: 'width 0.3s ease',
      },
    }),
  );
}
```

## Theming with Context API

Use the Context API to provide theme values throughout your component tree:

```typescript
import { createElement } from 'specifyjs';
import { createContext, useContext } from 'specifyjs/context';

const ThemeContext = createContext({
  primary: '#0066cc',
  background: '#ffffff',
  text: '#1a1a1a',
  surface: '#f5f5f5',
});

function useTheme() {
  return useContext(ThemeContext);
}

function ThemedButton(props: { label: string; onClick: () => void }) {
  const theme = useTheme();
  return createElement('button', {
    style: {
      backgroundColor: theme.primary,
      color: '#ffffff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: 4,
      cursor: 'pointer',
    },
    onClick: props.onClick,
  }, props.label);
}
```

Wrap the application in a `ThemeContext.Provider` to supply the theme:

```typescript
const darkTheme = {
  primary: '#6366f1',
  background: '#0f0f23',
  text: '#e0e0e0',
  surface: '#1a1a2e',
};

function App() {
  return createElement(ThemeContext.Provider, { value: darkTheme },
    createElement(ThemedButton, { label: 'Click me', onClick: () => {} }),
  );
}
```

## Dark Mode Implementation

Combine theme context with state to toggle between light and dark modes:

```typescript
import { useState } from 'specifyjs/hooks';

const lightTheme = { primary: '#0066cc', background: '#ffffff', text: '#1a1a1a' };
const darkTheme = { primary: '#6366f1', background: '#0f0f23', text: '#e0e0e0' };

function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return createElement(ThemeContext.Provider, { value: theme },
    createElement('div', {
      style: { backgroundColor: theme.background, color: theme.text, minHeight: '100vh' },
    },
      createElement('button', {
        onClick: () => setIsDark((prev) => !prev),
      }, isDark ? 'Switch to Light' : 'Switch to Dark'),
      createElement(MainContent, null),
    ),
  );
}
```

To respect the user's system preference on initial load:

```typescript
const [isDark, setIsDark] = useState(() =>
  window.matchMedia('(prefers-color-scheme: dark)').matches,
);
```
