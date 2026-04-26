# Routing

SpecifyJS includes a built-in hash-based router for single-page applications. The router listens to changes in the URL hash (`window.location.hash`) and renders components conditionally based on the current path. No server configuration is required -- the router works on any static file host, including GitHub Pages, S3, and Netlify.

## Why Hash-Based Routing

Traditional path-based routing (e.g., `/users/123`) requires the server to rewrite all requests to `index.html`. Hash-based routing (e.g., `#/users/123`) avoids this entirely because browsers never send the hash fragment to the server. This means:

- **Zero server configuration** -- deploy to any static host and routing works immediately.
- **No 404 errors** -- refreshing the page always loads `index.html`, then the hash router picks up the path.
- **Bookmark-friendly** -- users can share and bookmark URLs with hash paths.

## Basic Setup

Wrap your application in a `Router` component. This subscribes to `hashchange` events and provides routing context to all descendant components.

```typescript
import { createElement } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';
import { Router, Route } from 'specifyjs/router';

function App() {
  return createElement(Router, null,
    createElement(Route, { path: '/', exact: true, component: HomePage }),
    createElement(Route, { path: '/about', component: AboutPage }),
    createElement(Route, { path: '/contact', component: ContactPage }),
  );
}

createRoot(document.getElementById('root')!).render(createElement(App));
```

The `Router` component must be an ancestor of any `Route`, `Link`, or router hook usage. You typically place it at the top of your component tree.

## Defining Routes

The `Route` component renders its content when the current hash path matches the `path` pattern.

```typescript
// Render a component
createElement(Route, { path: '/dashboard', component: Dashboard })

// Render children directly
createElement(Route, { path: '/settings' },
  createElement('h1', null, 'Settings'),
)
```

### RouteProps

| Prop | Type | Description |
|------|------|-------------|
| `path` | `string` | Path pattern to match (e.g., `'/users/:id'`). |
| `component` | `FunctionComponent` | Component to render. Receives matched params as props. |
| `exact` | `boolean` | If `true`, the entire pathname must match. Default: `false`. |
| `children` | `SpecNode` | Alternative to `component` -- render children when matched. |

### Exact Matching

Without `exact`, a route with `path="/"` matches every path because `/` is a prefix of all paths. Use `exact` for your root route:

```typescript
createElement(Route, { path: '/', exact: true, component: HomePage })
```

## Navigation with Link

The `Link` component renders an anchor tag (`<a>`) that navigates by updating the hash without a full page reload:

```typescript
import { Link } from 'specifyjs/router';

function NavBar() {
  return createElement('nav', null,
    createElement(Link, { to: '/' }, 'Home'),
    createElement(Link, { to: '/about' }, 'About'),
    createElement(Link, { to: '/contact' }, 'Contact'),
  );
}
```

### LinkProps

| Prop | Type | Description |
|------|------|-------------|
| `to` | `string` | Target path (e.g., `'/about'`). |
| `className` | `string` | CSS class name for the anchor element. |
| `activeClassName` | `string` | Additional class applied when the link's path matches the current route. |
| `exact` | `boolean` | If `true`, `activeClassName` requires an exact path match. Default: `false`. |
| `children` | `SpecNode` | Link text or content. |

Additional props are spread onto the underlying `<a>` element.

### Active Link Styling

Use `activeClassName` to highlight the current route in your navigation:

```typescript
createElement(Link, {
  to: '/dashboard',
  className: 'nav-link',
  activeClassName: 'nav-link--active',
  exact: true,
}, 'Dashboard')
```

When the user is on `#/dashboard`, the anchor receives both classes: `nav-link nav-link--active`. The `exact` prop controls whether partial path matches also activate the class.

## Route Parameters

Define dynamic segments in your path pattern with the `:paramName` syntax. Matched values are passed as props to the `component` and are available via `useParams()`:

```typescript
function UserProfile(props: { id: string }) {
  return createElement('h1', null, `User #${props.id}`);
}

// In your route definitions:
createElement(Route, { path: '/users/:id', component: UserProfile })
```

When the user navigates to `#/users/42`, the `UserProfile` component receives `{ id: '42' }` as props. Parameter values are automatically URI-decoded.

## Wildcard Routes

A trailing `*` segment matches all remaining path segments. The matched portion is available as `params['*']`:

```typescript
function FileViewer(props: { '*': string }) {
  return createElement('p', null, `Viewing: ${props['*']}`);
}

createElement(Route, { path: '/files/*', component: FileViewer })
```

Navigating to `#/files/docs/readme.md` renders `"Viewing: docs/readme.md"`. Wildcard routes are useful for catch-all pages and file-browser-style UIs.

## Programmatic Navigation

Use the `useNavigate` hook to navigate from event handlers, effects, or any logic inside a component:

```typescript
import { useNavigate } from 'specifyjs/router';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // ... perform login logic
    navigate('/dashboard');
  };

  return createElement('button', { onClick: handleSubmit }, 'Log In');
}
```

### Replace vs. Push

By default, `navigate` pushes a new entry onto the browser history stack. Pass `{ replace: true }` to replace the current entry instead, which prevents the user from navigating back to the current page with the browser's back button:

```typescript
navigate('/dashboard', { replace: true });
```

This is useful after form submissions, redirects, or login flows where going "back" would be confusing.

## Reading Router State

The `useRouter` hook returns the full routing context:

```typescript
import { useRouter } from 'specifyjs/router';

function Breadcrumb() {
  const router = useRouter();
  return createElement('span', null, `Current path: ${router.pathname}`);
}
```

### RouterContextValue

| Property | Type | Description |
|----------|------|-------------|
| `pathname` | `string` | Current hash pathname (e.g., `'/users/123'`). |
| `params` | `Record<string, string>` | Matched route parameters from the nearest `Route`. |
| `navigate` | `(to: string, options?) => void` | Navigate function. |
| `basePath` | `string` | Base path for nested routing (the parent route's matched URL). |

## Extracting Parameters

The `useParams` hook returns the matched route parameters from the nearest `Route` ancestor. It supports a generic type parameter for type safety:

```typescript
import { useParams } from 'specifyjs/router';

function ProductDetail() {
  const params = useParams<{ category: string; id: string }>();
  return createElement('div', null,
    createElement('p', null, `Category: ${params.category}`),
    createElement('p', null, `Product ID: ${params.id}`),
  );
}

// Route definition:
createElement(Route, { path: '/products/:category/:id', component: ProductDetail })
```

## Nested Routing

Routes can be nested to build layouts with sub-sections. When a `Route` matches, it sets a new `basePath` equal to the matched URL, so child routes are relative to the parent:

```typescript
function DashboardLayout() {
  return createElement('div', { className: 'dashboard' },
    createElement('nav', null,
      createElement(Link, { to: '/dashboard/overview' }, 'Overview'),
      createElement(Link, { to: '/dashboard/settings' }, 'Settings'),
    ),
    createElement('main', null,
      createElement(Route, { path: '/overview', component: Overview }),
      createElement(Route, { path: '/settings', component: Settings }),
    ),
  );
}

// Top-level route:
createElement(Route, { path: '/dashboard', component: DashboardLayout })
```

When the user navigates to `#/dashboard/settings`, the parent `Route` matches `/dashboard` and sets `basePath` to `/dashboard`. The child `Route` with `path="/settings"` then matches against the full path `/dashboard/settings`.

Parameters from parent routes are merged into child routes, so deeply nested components can access parameters defined at any level via `useParams()`.

## Best Practices

1. **Always use `exact` on your root route** -- without it, `path="/"` matches every URL.
2. **Prefer `Link` over manual hash manipulation** -- `Link` handles click events, sets `href` for accessibility, and integrates with `activeClassName`.
3. **Use `replace` for redirects** -- after login or form submission, use `navigate(path, { replace: true })` to keep browser history clean.
4. **Type your params** -- use the generic parameter on `useParams<{ id: string }>()` to catch typos at compile time.
5. **Keep route definitions co-located** -- define routes near the components they render rather than in a single distant configuration file.
6. **Use wildcard routes for 404 pages** -- place a `Route` with `path="/*"` last to catch unmatched paths.

## See Also

- [Core Concepts](./core-concepts.md) -- elements, components, and hooks fundamentals
- [Building SPAs](./building-spas.md) -- full application architecture guide
- [API Reference: Router](/docs/api/router.md) -- complete API documentation
