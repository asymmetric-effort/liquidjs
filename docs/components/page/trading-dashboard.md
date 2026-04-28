# TradingDashboard

Full-screen layout resembling a stock trading terminal. Features a header bar and a 3x2 CSS grid containing a price chart (SVG), order book, watchlist, position summary, recent trades, and market depth visualization. Uses `useState` and `useEffect` for a simulated live price ticker.

## Import

```ts
import { TradingDashboard } from 'specifyjs/components/page/trading-dashboard';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | -- | Extra class name |

## Usage

```ts
import { createElement } from 'specifyjs/core';
import { TradingDashboard } from 'specifyjs/components/page/trading-dashboard';

const dashboard = createElement(TradingDashboard, null);
```

## Features

- **Header bar** with platform title, account number, balance, and connection status.
- **Price chart** rendered as an SVG with colored line segments (green for up, red for down) and horizontal grid lines. Displays the current AAPL price.
- **Order book** with bid/ask price and quantity columns. Row backgrounds are shaded proportionally to quantity for visual depth.
- **Watchlist** table showing symbol, price, percentage change (color-coded), and volume for 6 stocks.
- **Positions** table listing open positions with symbol, quantity, average price, and color-coded P&L.
- **Recent trades** table with timestamp, symbol, buy/sell side (color-coded), quantity, and price.
- **Market depth** visualization with horizontal bid (green) and ask (red) bars sized proportionally to volume.
- **Live price simulation** using a 2-second interval that randomly adjusts the AAPL price via `useState`/`useEffect`.

## Accessibility

- The price chart SVG has `role="img"` and `aria-label="Price chart"` for screen readers.
- The header uses a `<header>` element for landmark navigation.
- Tables use semantic `<thead>`/`<tbody>` structure with header cells.
- Color-coded values (green/red) convey meaning through color alone; consider adding text indicators (e.g., up/down arrows) for color-blind users in production use.
