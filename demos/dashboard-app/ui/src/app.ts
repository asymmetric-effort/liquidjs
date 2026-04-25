import { createElement, Fragment, createContext, memo } from 'specifyjs';
import { useState, useEffect, useCallback, useMemo, useReducer, useContext, useRef } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';

// ---------------------------------------------------------------------------
// Theme Context (light / dark)
// ---------------------------------------------------------------------------

interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  dark: false,
  toggle: () => {},
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type View = 'overview' | 'metrics' | 'settings';

interface SystemStats {
  cpu: number;
  memory: number;
  requests: number;
  uptime: number;
}

// Settings reducer ---------------------------------------------------------

interface SettingsState {
  notifications: boolean;
  refreshInterval: number;
  displayMode: 'compact' | 'comfortable' | 'expanded';
}

type SettingsAction =
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'SET_REFRESH_INTERVAL'; payload: number }
  | { type: 'SET_DISPLAY_MODE'; payload: SettingsState['displayMode'] }
  | { type: 'RESET' };

const defaultSettings: SettingsState = {
  notifications: true,
  refreshInterval: 5,
  displayMode: 'comfortable',
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    case 'SET_REFRESH_INTERVAL':
      return { ...state, refreshInterval: action.payload };
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: action.payload };
    case 'RESET':
      return defaultSettings;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Memoised MetricCard — only re-renders when its own props change
// ---------------------------------------------------------------------------

interface MetricCardProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const MetricCard = memo(function MetricCard(props: MetricCardProps) {
  const { label, value, onIncrement, onDecrement } = props;
  const theme = useContext(ThemeContext);

  return createElement(
    'div',
    { className: `metric-card ${theme.dark ? 'dark' : ''}` },
    createElement('h3', { className: 'metric-label' }, label),
    createElement('span', { className: 'metric-value' }, String(value)),
    createElement(
      'div',
      { className: 'metric-actions' },
      createElement('button', { className: 'btn small', onClick: onDecrement }, '-'),
      createElement('button', { className: 'btn small', onClick: onIncrement }, '+'),
    ),
  );
});

// ---------------------------------------------------------------------------
// Overview Panel
// ---------------------------------------------------------------------------

function OverviewPanel() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 42,
    memory: 61,
    requests: 1340,
    uptime: 0,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setStats((prev: SystemStats) => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 4 - 2))),
        requests: prev.requests + Math.floor(Math.random() * 20),
        uptime: prev.uptime + 1,
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatUptime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  }, []);

  return createElement(
    'section',
    { className: 'panel' },
    createElement('h2', null, 'System Overview'),
    createElement(
      'div',
      { className: 'stats-grid' },
      statBox('CPU', `${stats.cpu.toFixed(1)}%`, stats.cpu > 80 ? 'stat-danger' : ''),
      statBox('Memory', `${stats.memory.toFixed(1)}%`, stats.memory > 85 ? 'stat-danger' : ''),
      statBox('Requests', String(stats.requests), ''),
      statBox('Uptime', formatUptime(stats.uptime), ''),
    ),
  );
}

function statBox(label: string, value: string, extraClass: string) {
  return createElement(
    'div',
    { className: `stat-box ${extraClass}` },
    createElement('div', { className: 'stat-label' }, label),
    createElement('div', { className: 'stat-value' }, value),
  );
}

// ---------------------------------------------------------------------------
// Metrics Panel — uses memo'd cards + local counters
// ---------------------------------------------------------------------------

function MetricsPanel() {
  const [counters, setCounters] = useState<Record<string, number>>({
    'Page Views': 0,
    'API Calls': 0,
    Errors: 0,
    Latency: 0,
  });

  const keys = useMemo(() => Object.keys(counters), [counters]);

  const increment = useCallback(
    (key: string) => {
      setCounters((prev: Record<string, number>) => ({ ...prev, [key]: prev[key] + 1 }));
    },
    [],
  );

  const decrement = useCallback(
    (key: string) => {
      setCounters((prev: Record<string, number>) => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
    },
    [],
  );

  return createElement(
    'section',
    { className: 'panel' },
    createElement('h2', null, 'Metrics'),
    createElement('p', { className: 'hint' }, 'Each card is wrapped in memo() — only the changed card re-renders.'),
    createElement(
      'div',
      { className: 'metrics-grid' },
      ...keys.map((k) =>
        createElement(MetricCard, {
          key: k,
          label: k,
          value: counters[k],
          onIncrement: () => increment(k),
          onDecrement: () => decrement(k),
        }),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Settings Panel — useReducer for complex form state
// ---------------------------------------------------------------------------

function SettingsPanel() {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings);

  return createElement(
    'section',
    { className: 'panel' },
    createElement('h2', null, 'Settings'),
    createElement('p', { className: 'hint' }, 'Managed via useReducer for predictable state transitions.'),
    createElement(
      'div',
      { className: 'settings-form' },

      // Notifications toggle
      createElement(
        'label',
        { className: 'setting-row' },
        createElement('span', null, 'Notifications'),
        createElement(
          'button',
          {
            className: `toggle-btn ${settings.notifications ? 'on' : 'off'}`,
            onClick: () => dispatch({ type: 'TOGGLE_NOTIFICATIONS' }),
          },
          settings.notifications ? 'ON' : 'OFF',
        ),
      ),

      // Refresh interval
      createElement(
        'label',
        { className: 'setting-row' },
        createElement('span', null, 'Refresh interval (seconds)'),
        createElement(
          'select',
          {
            value: String(settings.refreshInterval),
            onChange: (e: Event) => {
              const val = Number((e.target as HTMLSelectElement).value);
              dispatch({ type: 'SET_REFRESH_INTERVAL', payload: val });
            },
          },
          ...[1, 2, 5, 10, 30, 60].map((n) =>
            createElement('option', { key: n, value: String(n) }, `${n}s`),
          ),
        ),
      ),

      // Display mode
      createElement(
        'label',
        { className: 'setting-row' },
        createElement('span', null, 'Display mode'),
        createElement(
          'div',
          { className: 'radio-group' },
          ...(['compact', 'comfortable', 'expanded'] as SettingsState['displayMode'][]).map((mode) =>
            createElement(
              'button',
              {
                key: mode,
                className: `radio-btn ${settings.displayMode === mode ? 'active' : ''}`,
                onClick: () => dispatch({ type: 'SET_DISPLAY_MODE', payload: mode }),
              },
              mode[0].toUpperCase() + mode.slice(1),
            ),
          ),
        ),
      ),

      // Reset
      createElement(
        'div',
        { className: 'setting-row' },
        createElement(
          'button',
          { className: 'btn reset-btn', onClick: () => dispatch({ type: 'RESET' }) },
          'Reset to defaults',
        ),
      ),

      // Current state readout
      createElement(
        'pre',
        { className: 'state-readout' },
        JSON.stringify(settings, null, 2),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'settings', label: 'Settings' },
];

function Sidebar(props: { active: View; onNavigate: (v: View) => void }) {
  const theme = useContext(ThemeContext);

  return createElement(
    'nav',
    { className: 'sidebar' },
    createElement('div', { className: 'sidebar-brand' }, 'SpecifyJS Dashboard'),
    createElement(
      'ul',
      { className: 'nav-list' },
      ...NAV_ITEMS.map((item) =>
        createElement(
          'li',
          { key: item.id },
          createElement(
            'button',
            {
              className: `nav-btn ${props.active === item.id ? 'active' : ''}`,
              onClick: () => props.onNavigate(item.id),
            },
            item.label,
          ),
        ),
      ),
    ),
    createElement(
      'button',
      { className: 'theme-toggle', onClick: theme.toggle },
      theme.dark ? 'Light Mode' : 'Dark Mode',
    ),
  );
}

// ---------------------------------------------------------------------------
// App Root
// ---------------------------------------------------------------------------

function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>('overview');

  const toggle = useCallback(() => setDark((d: boolean) => !d), []);

  const themeValue = useMemo<ThemeContextValue>(() => ({ dark, toggle }), [dark, toggle]);

  // Apply class to <body> for global dark mode styles
  useEffect(() => {
    document.body.className = dark ? 'dark' : '';
  }, [dark]);

  let content: ReturnType<typeof createElement>;
  switch (view) {
    case 'overview':
      content = createElement(OverviewPanel, null);
      break;
    case 'metrics':
      content = createElement(MetricsPanel, null);
      break;
    case 'settings':
      content = createElement(SettingsPanel, null);
      break;
  }

  return createElement(
    ThemeContext.Provider,
    { value: themeValue },
    createElement(
      'div',
      { className: 'dashboard' },
      createElement(Sidebar, { active: view, onNavigate: setView }),
      createElement('main', { className: 'main-content' }, content),
    ),
  );
}

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
