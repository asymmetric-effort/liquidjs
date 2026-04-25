import { createElement } from 'liquidjs';
import { useFetch } from '../hooks/use-fetch';

interface President {
  name: string;
  party: string;
  termStart: string;
  termEnd: string;
  gdpGrowthAvg: number;
  unemploymentChange: number | null;
  cpiInflationAvg: number;
  sp500Return: number;
}

interface PresidentialData {
  source: string;
  presidents: President[];
}

interface EconomicData {
  snapshot2026: {
    realGdpGrowth: number;
    unemploymentRate: number;
    cpiInflation: number;
    sp500Ytd: number;
    fedFundsRate: number;
    treasury10y: number;
    vixAvg: number;
  };
  recessions: { start: string; end: string; label: string }[];
}

export function EconomicDashboard() {
  const presidents = useFetch<PresidentialData>('./data/presidential-economies.json');
  const indicators = useFetch<EconomicData>('./data/economic-indicators.json');

  if (presidents.loading || indicators.loading) {
    return createElement('div', { className: 'loading' }, 'Loading economic data...');
  }

  if (presidents.error || indicators.error) {
    return createElement('div', { className: 'error' },
      `Error: ${presidents.error || indicators.error}`,
    );
  }

  const snap = indicators.data!.snapshot2026;
  const presData = presidents.data!.presidents;

  return createElement('div', null,
    createElement('div', { className: 'section' },
      createElement('h2', null, 'Economic Dashboard'),
      createElement('p', { style: { color: '#64748b', marginBottom: '24px' } },
        'Real-time data fetched via HTTPS from static JSON — demonstrating LiquidJS data loading, state management, and rendering.',
      ),
      createElement('p', { style: { fontSize: '12px', color: '#94a3b8', marginBottom: '16px' } },
        `Source: ${presidents.data!.source}`,
      ),
    ),

    // 2026 Snapshot Stat Cards
    createElement('div', { className: 'section' },
      createElement('h2', null, '2026 Economic Snapshot'),
      createElement('div', { className: 'stat-cards' },
        statCard('GDP Growth', `${snap.realGdpGrowth}%`, 'YoY'),
        statCard('Unemployment', `${snap.unemploymentRate}%`, 'Rate'),
        statCard('CPI Inflation', `${snap.cpiInflation}%`, 'Annual'),
        statCard('S&P 500 YTD', `+${snap.sp500Ytd}%`, 'Return'),
        statCard('Fed Funds', `${snap.fedFundsRate}%`, 'Rate'),
        statCard('10Y Treasury', `${snap.treasury10y}%`, 'Yield'),
      ),
    ),

    // S&P 500 Return by President (SVG Bar Chart)
    createElement('div', { className: 'section' },
      createElement('h2', null, 'S&P 500 Return by Administration'),
      svgBarChart(presData),
    ),

    // GDP Growth Line Graph
    createElement('div', { className: 'section' },
      createElement('h2', null, 'GDP Growth by Administration'),
      svgLineChart(presData.map(p => ({ label: p.name, value: p.gdpGrowthAvg })), '#10b981', 'GDP %'),
    ),

    // CPI Inflation Box Plot
    createElement('div', { className: 'section' },
      createElement('h2', null, 'CPI Inflation Distribution'),
      svgBoxPlot(presData),
    ),

    // Presidential Economies Table
    createElement('div', { className: 'section' },
      createElement('h2', null, 'Presidential Economies (1999–Present)'),
      createElement('table', { className: 'data-table' },
        createElement('thead', null,
          createElement('tr', null,
            th('President'),
            th('Party'),
            th('Term'),
            th('GDP Growth'),
            th('CPI Avg'),
            th('S&P 500'),
          ),
        ),
        createElement('tbody', null,
          ...presData.map(p =>
            createElement('tr', { key: p.name },
              td(p.name),
              td(p.party),
              td(`${p.termStart} – ${p.termEnd}`),
              td(`${p.gdpGrowthAvg}%`),
              td(`${p.cpiInflationAvg}%`),
              td(`${p.sp500Return > 0 ? '+' : ''}${p.sp500Return}%`),
            ),
          ),
        ),
      ),
    ),

    // Recessions
    createElement('div', { className: 'section' },
      createElement('h2', null, 'U.S. Recessions (1999–Present)'),
      createElement('div', { className: 'stat-cards' },
        ...indicators.data!.recessions.map(r =>
          statCard(r.label, `${r.start} – ${r.end}`, 'NBER dates'),
        ),
      ),
    ),
  );
}

function statCard(label: string, value: string, sub: string) {
  return createElement('div', { className: 'stat-card' },
    createElement('div', { className: 'stat-card-label' }, label),
    createElement('div', { className: 'stat-card-value' }, value),
    createElement('div', { className: 'stat-card-sub' }, sub),
  );
}

function th(text: string) {
  return createElement('th', null, text);
}

function td(text: string) {
  return createElement('td', null, text);
}

function svgBarChart(data: President[]) {
  const w = 600;
  const h = 250;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => Math.abs(d.sp500Return)));
  const barW = chartW / data.length - 8;

  return createElement(
    'svg',
    {
      width: String(w),
      height: String(h),
      viewBox: `0 0 ${w} ${h}`,
      style: { background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '100%' },
    },
    // Zero line
    createElement('line', {
      x1: String(pad.left),
      y1: String(pad.top + chartH / 2),
      x2: String(w - pad.right),
      y2: String(pad.top + chartH / 2),
      stroke: '#94a3b8',
      strokeWidth: '1',
      strokeDasharray: '4,4',
    }),
    // Bars
    ...data.map((p, i) => {
      const x = pad.left + i * (chartW / data.length) + 4;
      const barH = (Math.abs(p.sp500Return) / maxVal) * (chartH / 2);
      const y = p.sp500Return >= 0 ? pad.top + chartH / 2 - barH : pad.top + chartH / 2;
      const color = p.party === 'Democratic' ? '#3b82f6' : '#ef4444';
      return createElement('g', { key: p.name },
        createElement('rect', {
          x: String(x), y: String(y), width: String(barW), height: String(barH),
          fill: color, rx: '3', opacity: p.sp500Return < 0 ? '0.6' : '1',
        }),
        createElement('text', {
          x: String(x + barW / 2), y: String(p.sp500Return >= 0 ? y - 4 : y + barH + 14),
          textAnchor: 'middle', fontSize: '11', fontWeight: '600',
          fill: p.sp500Return < 0 ? '#ef4444' : '#16a34a',
        }, `${p.sp500Return > 0 ? '+' : ''}${p.sp500Return}%`),
        createElement('text', {
          x: String(x + barW / 2), y: String(h - 8),
          textAnchor: 'middle', fontSize: '10', fill: '#64748b',
        }, p.name),
      );
    }),
    // Y axis label
    createElement('text', { x: '12', y: String(pad.top + chartH / 2), fontSize: '11', fill: '#94a3b8', textAnchor: 'middle', transform: `rotate(-90, 12, ${pad.top + chartH / 2})` }, 'S&P 500 Return %'),
  );
}

function svgLineChart(data: { label: string; value: number }[], color: string, yLabel: string) {
  if (data.length === 0) {
    return createElement('p', { style: { color: '#94a3b8', textAlign: 'center', padding: '24px' } }, 'No data available for line chart.');
  }
  const w = 600;
  const h = 200;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((d.value - minVal) / range) * chartH,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return createElement(
    'svg',
    {
      width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`,
      style: { background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '100%' },
    },
    createElement('path', { d: pathD, fill: 'none', stroke: color, strokeWidth: '2.5' }),
    ...points.map((p, i) =>
      createElement('g', { key: data[i]!.label },
        createElement('circle', { cx: String(p.x), cy: String(p.y), r: '4', fill: color }),
        createElement('text', { x: String(p.x), y: String(p.y - 10), textAnchor: 'middle', fontSize: '11', fontWeight: '600', fill: '#0f172a' }, `${data[i]!.value}%`),
        createElement('text', { x: String(p.x), y: String(h - 8), textAnchor: 'middle', fontSize: '10', fill: '#64748b' }, data[i]!.label),
      ),
    ),
    createElement('text', { x: '12', y: String(pad.top + chartH / 2), fontSize: '11', fill: '#94a3b8', textAnchor: 'middle', transform: `rotate(-90, 12, ${pad.top + chartH / 2})` }, yLabel),
  );
}

function svgBoxPlot(data: President[]) {
  if (data.length === 0) {
    return createElement('p', { style: { color: '#94a3b8', textAlign: 'center', padding: '24px' } }, 'No data available for box plot.');
  }
  const values = data.map((p) => p.cpiInflationAvg).sort((a, b) => a - b);
  const min = values[0]!;
  const max = values[values.length - 1]!;
  const median = values[Math.floor(values.length / 2)]!;
  const q1 = values[Math.floor(values.length / 4)]!;
  const q3 = values[Math.floor((3 * values.length) / 4)]!;

  const w = 600;
  const h = 120;
  const pad = { left: 50, right: 40 };
  const chartW = w - pad.left - pad.right;
  const range = max - min || 1;
  const toX = (v: number) => pad.left + ((v - min) / range) * chartW;
  const cy = 50;

  return createElement(
    'svg',
    {
      width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`,
      style: { background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '100%' },
    },
    // Whisker line (min to max)
    createElement('line', { x1: String(toX(min)), y1: String(cy), x2: String(toX(max)), y2: String(cy), stroke: '#64748b', strokeWidth: '1.5' }),
    // Min/max caps
    createElement('line', { x1: String(toX(min)), y1: String(cy - 12), x2: String(toX(min)), y2: String(cy + 12), stroke: '#64748b', strokeWidth: '1.5' }),
    createElement('line', { x1: String(toX(max)), y1: String(cy - 12), x2: String(toX(max)), y2: String(cy + 12), stroke: '#64748b', strokeWidth: '1.5' }),
    // IQR box (Q1 to Q3)
    createElement('rect', { x: String(toX(q1)), y: String(cy - 20), width: String(toX(q3) - toX(q1)), height: '40', fill: '#3b82f6', opacity: '0.2', stroke: '#3b82f6', strokeWidth: '1.5', rx: '3' }),
    // Median line
    createElement('line', { x1: String(toX(median)), y1: String(cy - 20), x2: String(toX(median)), y2: String(cy + 20), stroke: '#3b82f6', strokeWidth: '2.5' }),
    // Data points
    ...data.map((p) =>
      createElement('circle', { key: p.name, cx: String(toX(p.cpiInflationAvg)), cy: String(cy), r: '4', fill: p.party === 'Democratic' ? '#3b82f6' : '#ef4444', stroke: '#fff', strokeWidth: '1.5' }),
    ),
    // Labels
    createElement('text', { x: String(toX(min)), y: String(cy + 35), textAnchor: 'middle', fontSize: '10', fill: '#64748b' }, `${min}%`),
    createElement('text', { x: String(toX(max)), y: String(cy + 35), textAnchor: 'middle', fontSize: '10', fill: '#64748b' }, `${max}%`),
    createElement('text', { x: String(toX(median)), y: String(cy - 28), textAnchor: 'middle', fontSize: '10', fontWeight: '600', fill: '#3b82f6' }, `Median: ${median}%`),
    createElement('text', { x: '12', y: String(cy + 4), fontSize: '11', fill: '#94a3b8' }, 'CPI %'),
  );
}
