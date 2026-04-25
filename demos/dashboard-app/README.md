# Dashboard Demo

A single-container standalone SpecifyJS SPA demonstrating advanced framework features through an interactive system dashboard.

## Features Demonstrated

- **Context API** (`createContext` / `useContext`) — A `ThemeContext` provides light/dark mode to every component without prop drilling. The sidebar theme toggle and metric cards both consume the context.

- **memo()** — The `MetricCard` component is wrapped in `memo()` so that only the card whose counter changed re-renders, not the entire metrics grid.

- **useReducer** — The Settings panel manages complex form state (notifications toggle, refresh interval, display mode) through a reducer with well-defined action types, including a reset action.

- **useEffect with timers** — The Overview panel simulates live system stats (CPU, Memory, Requests, Uptime) via a `setInterval` inside `useEffect`, with proper cleanup on unmount.

- **useState / useCallback / useMemo** — Used throughout for local state, stable callbacks, and derived values.

## Views

| View | What it shows |
|------|--------------|
| **Overview** | Live-updating system stats (CPU %, Memory %, request count, uptime) |
| **Metrics** | Four metric cards with increment/decrement counters, each memoised |
| **Settings** | Form with toggle, select, radio group, and reset — all driven by `useReducer` |

## Running

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
dashboard-app/
  docker-compose.yml
  ui/
    Dockerfile
    nginx.conf
    package.json
    index.html
    src/
      app.ts          # All components in a single file
```
