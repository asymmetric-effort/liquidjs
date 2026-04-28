// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * TradingDashboard -- Full-screen layout resembling a stock trading terminal.
 *
 * Features a header bar, and a 3x2 CSS grid containing: price chart (SVG),
 * order book, watchlist, position summary, recent trades, and market depth
 * visualization. Uses useState for a simulated price ticker.
 */

import { createElement } from '../../../../core/src/index';
import { useState, useEffect, useMemo } from '../../../../core/src/hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TradingDashboardProps {
  /** Extra class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const WATCHLIST = [
  { symbol: 'AAPL', price: 189.42, change: 1.23, volume: '52.3M' },
  { symbol: 'GOOGL', price: 141.80, change: -0.87, volume: '23.1M' },
  { symbol: 'MSFT', price: 378.91, change: 2.45, volume: '18.7M' },
  { symbol: 'AMZN', price: 185.63, change: -1.12, volume: '31.4M' },
  { symbol: 'TSLA', price: 248.50, change: 3.78, volume: '67.2M' },
  { symbol: 'NVDA', price: 875.30, change: 12.50, volume: '41.8M' },
];

const ORDER_BOOK_BIDS = [
  { price: 189.40, qty: 1200 },
  { price: 189.38, qty: 3400 },
  { price: 189.35, qty: 800 },
  { price: 189.32, qty: 5600 },
  { price: 189.30, qty: 2100 },
  { price: 189.28, qty: 4300 },
];

const ORDER_BOOK_ASKS = [
  { price: 189.44, qty: 900 },
  { price: 189.47, qty: 2200 },
  { price: 189.50, qty: 1500 },
  { price: 189.53, qty: 3800 },
  { price: 189.55, qty: 1100 },
  { price: 189.58, qty: 2700 },
];

const POSITIONS = [
  { symbol: 'AAPL', qty: 100, avgPrice: 185.20, currentPrice: 189.42, pnl: 422.00 },
  { symbol: 'MSFT', qty: 50, avgPrice: 382.10, currentPrice: 378.91, pnl: -159.50 },
  { symbol: 'NVDA', qty: 25, avgPrice: 850.00, currentPrice: 875.30, pnl: 632.50 },
];

const RECENT_TRADES = [
  { time: '14:32:01', symbol: 'AAPL', side: 'BUY', qty: 50, price: 189.42 },
  { time: '14:31:45', symbol: 'MSFT', side: 'SELL', qty: 25, price: 378.95 },
  { time: '14:30:22', symbol: 'TSLA', side: 'BUY', qty: 100, price: 247.80 },
  { time: '14:29:58', symbol: 'NVDA', side: 'BUY', qty: 10, price: 874.50 },
  { time: '14:28:33', symbol: 'GOOGL', side: 'SELL', qty: 75, price: 142.10 },
];

const CHART_DATA = [
  185.20, 186.10, 185.80, 187.50, 188.20, 187.90, 186.50, 187.80,
  188.40, 189.10, 188.60, 187.20, 188.50, 189.80, 189.20, 188.90,
  189.50, 190.10, 189.40, 188.80, 189.60, 190.30, 189.90, 189.42,
];

const DEPTH_BIDS = [
  { price: 189.40, volume: 1200 },
  { price: 189.35, volume: 3400 },
  { price: 189.30, volume: 2800 },
  { price: 189.25, volume: 5100 },
  { price: 189.20, volume: 4200 },
];

const DEPTH_ASKS = [
  { price: 189.45, volume: 900 },
  { price: 189.50, volume: 2600 },
  { price: 189.55, volume: 1800 },
  { price: 189.60, volume: 4400 },
  { price: 189.65, volume: 3100 },
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const cellStyle: Record<string, string> = {
  backgroundColor: '#1a1a2e',
  borderRadius: '4px',
  padding: '12px',
  border: '1px solid #2a2a4a',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const cellTitleStyle: Record<string, string> = {
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#8888aa',
  marginBottom: '8px',
  flexShrink: '0',
};

const tableStyle: Record<string, string> = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '12px',
};

const thStyle: Record<string, string> = {
  textAlign: 'left',
  padding: '4px 6px',
  borderBottom: '1px solid #2a2a4a',
  color: '#8888aa',
  fontWeight: '600',
  fontSize: '11px',
};

const tdStyle: Record<string, string> = {
  padding: '3px 6px',
  borderBottom: '1px solid #16162a',
  color: '#ccccdd',
  fontSize: '12px',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function buildPriceChart(data: Array<number>, currentPrice: number): unknown {
  const width = 360;
  const height = 140;
  const padX = 10;
  const padY = 10;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);

  const points = data.map((v, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (v - min) / range) * (height - padY * 2);
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;

  // Candlestick-like coloring: green if up, red if down from previous
  const segments: Array<unknown> = [];
  for (let i = 1; i < data.length; i++) {
    const x1 = padX + (i - 1) * stepX;
    const y1 = padY + (1 - (data[i - 1] - min) / range) * (height - padY * 2);
    const x2 = padX + i * stepX;
    const y2 = padY + (1 - (data[i] - min) / range) * (height - padY * 2);
    const color = data[i] >= data[i - 1] ? '#00c853' : '#ff1744';
    segments.push(
      createElement('line', {
        key: String(i),
        x1: String(x1),
        y1: String(y1),
        x2: String(x2),
        y2: String(y2),
        stroke: color,
        strokeWidth: '2',
      }),
    );
  }

  return createElement(
    'div',
    { style: cellStyle },
    createElement('div', { style: cellTitleStyle },
      'AAPL ',
      createElement('span', { style: { color: '#00c853', fontSize: '14px', fontWeight: '700' } }, `$${currentPrice.toFixed(2)}`),
    ),
    createElement(
      'svg',
      {
        viewBox: `0 0 ${width} ${height}`,
        style: { width: '100%', flex: '1', minHeight: '0' },
        'aria-label': 'Price chart',
        role: 'img',
      },
      // Grid lines
      ...Array.from({ length: 5 }, (_, i) => {
        const y = padY + (i / 4) * (height - padY * 2);
        return createElement('line', {
          key: `g${i}`,
          x1: String(padX),
          y1: String(y),
          x2: String(width - padX),
          y2: String(y),
          stroke: '#2a2a4a',
          strokeWidth: '0.5',
        });
      }),
      // Price line segments
      ...segments,
    ),
  );
}

function buildOrderBook(): unknown {
  const maxQty = Math.max(
    ...ORDER_BOOK_BIDS.map((b) => b.qty),
    ...ORDER_BOOK_ASKS.map((a) => a.qty),
  );

  return createElement(
    'div',
    { style: cellStyle },
    createElement('div', { style: cellTitleStyle }, 'Order Book'),
    createElement(
      'table',
      { style: tableStyle },
      createElement(
        'thead',
        null,
        createElement(
          'tr',
          null,
          createElement('th', { style: thStyle }, 'Bid Price'),
          createElement('th', { style: thStyle }, 'Qty'),
          createElement('th', { style: thStyle }, 'Ask Price'),
          createElement('th', { style: thStyle }, 'Qty'),
        ),
      ),
      createElement(
        'tbody',
        null,
        ...ORDER_BOOK_BIDS.map((bid, i) => {
          const ask = ORDER_BOOK_ASKS[i];
          return createElement(
            'tr',
            { key: String(i) },
            createElement('td', {
              style: { ...tdStyle, color: '#00c853', background: `rgba(0,200,83,${bid.qty / maxQty * 0.2})` },
            }, bid.price.toFixed(2)),
            createElement('td', { style: tdStyle }, String(bid.qty)),
            createElement('td', {
              style: { ...tdStyle, color: '#ff1744', background: `rgba(255,23,68,${(ask?.qty ?? 0) / maxQty * 0.2})` },
            }, ask ? ask.price.toFixed(2) : ''),
            createElement('td', { style: tdStyle }, ask ? String(ask.qty) : ''),
          );
        }),
      ),
    ),
  );
}

function buildWatchlist(priceOffset: number): unknown {
  return createElement(
    'div',
    { style: cellStyle },
    createElement('div', { style: cellTitleStyle }, 'Watchlist'),
    createElement(
      'table',
      { style: tableStyle },
      createElement(
        'thead',
        null,
        createElement(
          'tr',
          null,
          createElement('th', { style: thStyle }, 'Symbol'),
          createElement('th', { style: thStyle }, 'Price'),
          createElement('th', { style: thStyle }, 'Chg%'),
          createElement('th', { style: thStyle }, 'Volume'),
        ),
      ),
      createElement(
        'tbody',
        null,
        ...WATCHLIST.map((item, i) => {
          const adjustedPrice = item.price + (i === 0 ? priceOffset : 0);
          const isPositive = item.change >= 0;
          return createElement(
            'tr',
            { key: String(i) },
            createElement('td', { style: { ...tdStyle, fontWeight: '600', color: '#ffffff' } }, item.symbol),
            createElement('td', { style: tdStyle }, adjustedPrice.toFixed(2)),
            createElement('td', {
              style: { ...tdStyle, color: isPositive ? '#00c853' : '#ff1744' },
            }, `${isPositive ? '+' : ''}${item.change.toFixed(2)}%`),
            createElement('td', { style: tdStyle }, item.volume),
          );
        }),
      ),
    ),
  );
}

function buildPositions(): unknown {
  return createElement(
    'div',
    { style: cellStyle },
    createElement('div', { style: cellTitleStyle }, 'Positions'),
    createElement(
      'table',
      { style: tableStyle },
      createElement(
        'thead',
        null,
        createElement(
          'tr',
          null,
          createElement('th', { style: thStyle }, 'Symbol'),
          createElement('th', { style: thStyle }, 'Qty'),
          createElement('th', { style: thStyle }, 'Avg'),
          createElement('th', { style: thStyle }, 'P&L'),
        ),
      ),
      createElement(
        'tbody',
        null,
        ...POSITIONS.map((pos, i) => {
          const isPositive = pos.pnl >= 0;
          return createElement(
            'tr',
            { key: String(i) },
            createElement('td', { style: { ...tdStyle, fontWeight: '600', color: '#ffffff' } }, pos.symbol),
            createElement('td', { style: tdStyle }, String(pos.qty)),
            createElement('td', { style: tdStyle }, pos.avgPrice.toFixed(2)),
            createElement('td', {
              style: { ...tdStyle, color: isPositive ? '#00c853' : '#ff1744', fontWeight: '600' },
            }, `${isPositive ? '+' : ''}$${pos.pnl.toFixed(2)}`),
          );
        }),
      ),
    ),
  );
}

function buildRecentTrades(): unknown {
  return createElement(
    'div',
    { style: cellStyle },
    createElement('div', { style: cellTitleStyle }, 'Recent Trades'),
    createElement(
      'table',
      { style: tableStyle },
      createElement(
        'thead',
        null,
        createElement(
          'tr',
          null,
          createElement('th', { style: thStyle }, 'Time'),
          createElement('th', { style: thStyle }, 'Sym'),
          createElement('th', { style: thStyle }, 'Side'),
          createElement('th', { style: thStyle }, 'Qty'),
          createElement('th', { style: thStyle }, 'Price'),
        ),
      ),
      createElement(
        'tbody',
        null,
        ...RECENT_TRADES.map((trade, i) => {
          const isBuy = trade.side === 'BUY';
          return createElement(
            'tr',
            { key: String(i) },
            createElement('td', { style: { ...tdStyle, color: '#8888aa' } }, trade.time),
            createElement('td', { style: { ...tdStyle, fontWeight: '600', color: '#ffffff' } }, trade.symbol),
            createElement('td', {
              style: { ...tdStyle, color: isBuy ? '#00c853' : '#ff1744', fontWeight: '600' },
            }, trade.side),
            createElement('td', { style: tdStyle }, String(trade.qty)),
            createElement('td', { style: tdStyle }, trade.price.toFixed(2)),
          );
        }),
      ),
    ),
  );
}

function buildMarketDepth(): unknown {
  const maxVolume = Math.max(
    ...DEPTH_BIDS.map((b) => b.volume),
    ...DEPTH_ASKS.map((a) => a.volume),
  );

  const barHeight = '16px';

  return createElement(
    'div',
    { style: cellStyle },
    createElement('div', { style: cellTitleStyle }, 'Market Depth'),
    createElement(
      'div',
      { style: { flex: '1', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center' } },
      // Bids (green, left-aligned)
      ...DEPTH_BIDS.map((bid, i) =>
        createElement(
          'div',
          {
            key: `b${i}`,
            style: { display: 'flex', alignItems: 'center', gap: '6px' },
          },
          createElement('span', { style: { width: '52px', fontSize: '11px', color: '#8888aa', textAlign: 'right' } }, bid.price.toFixed(2)),
          createElement('div', {
            style: {
              height: barHeight,
              width: `${(bid.volume / maxVolume) * 100}%`,
              backgroundColor: '#00c853',
              opacity: '0.6',
              borderRadius: '2px',
              maxWidth: '60%',
            },
          }),
          createElement('span', { style: { fontSize: '11px', color: '#ccccdd' } }, String(bid.volume)),
        ),
      ),
      // Separator
      createElement('div', { style: { height: '1px', backgroundColor: '#2a2a4a', margin: '4px 0' } }),
      // Asks (red, left-aligned)
      ...DEPTH_ASKS.map((ask, i) =>
        createElement(
          'div',
          {
            key: `a${i}`,
            style: { display: 'flex', alignItems: 'center', gap: '6px' },
          },
          createElement('span', { style: { width: '52px', fontSize: '11px', color: '#8888aa', textAlign: 'right' } }, ask.price.toFixed(2)),
          createElement('div', {
            style: {
              height: barHeight,
              width: `${(ask.volume / maxVolume) * 100}%`,
              backgroundColor: '#ff1744',
              opacity: '0.6',
              borderRadius: '2px',
              maxWidth: '60%',
            },
          }),
          createElement('span', { style: { fontSize: '11px', color: '#ccccdd' } }, String(ask.volume)),
        ),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TradingDashboard(props: TradingDashboardProps) {
  const [priceOffset, setPriceOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceOffset((_prev: number) => {
        const delta = (Math.random() - 0.5) * 0.5;
        return Math.round(delta * 100) / 100;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = useMemo<Record<string, string>>(() => ({
    width: '100%',
    height: '100%',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    fontSize: '13px',
    color: '#ccccdd',
    backgroundColor: '#0d0d1a',
    overflow: 'hidden',
  }), []);

  const headerStyle: Record<string, string> = {
    height: '40px',
    backgroundColor: '#12122a',
    borderBottom: '1px solid #2a2a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    flexShrink: '0',
  };

  const headerTitleStyle: Record<string, string> = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.5px',
  };

  const gridStyle: Record<string, string> = {
    flex: '1',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '6px',
    padding: '6px',
    overflow: 'hidden',
  };

  const currentPrice = 189.42 + priceOffset;

  return createElement(
    'div',
    {
      className: `trading-dashboard ${props.className ?? ''}`.trim(),
      style: containerStyle,
    },
    // Header
    createElement(
      'header',
      { className: 'trading-dashboard__header', style: headerStyle },
      createElement('span', { style: headerTitleStyle }, 'SpecifyJS Trading Platform'),
      createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' } },
        createElement('span', { style: { color: '#8888aa' } }, 'Account: SJS-28401'),
        createElement('span', { style: { color: '#00c853' } }, 'Balance: $124,582.30'),
        createElement('span', { style: { color: '#8888aa' } }, 'Status: Connected'),
      ),
    ),
    // Grid
    createElement(
      'div',
      { className: 'trading-dashboard__grid', style: gridStyle },
      buildPriceChart(CHART_DATA, currentPrice),
      buildOrderBook(),
      buildWatchlist(priceOffset),
      buildPositions(),
      buildRecentTrades(),
      buildMarketDepth(),
    ),
  );
}
