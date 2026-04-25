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

    // S&P 500 Return by President (Bar Chart)
    createElement('div', { className: 'section' },
      createElement('h2', null, 'S&P 500 Return by Administration'),
      createElement('div', { className: 'bar-chart' },
        ...presData.map(p => {
          const maxReturn = 130;
          const absReturn = Math.abs(p.sp500Return);
          const barHeight = Math.max(4, Math.round((absReturn / maxReturn) * 150));
          const color = p.party === 'Democratic' ? 'var(--color-dem)' : 'var(--color-rep)';
          const isNeg = p.sp500Return < 0;

          return createElement('div', { key: p.name, className: 'bar-chart-col' },
            createElement('div', { className: 'bar-chart-value', style: { color: isNeg ? '#ef4444' : '#16a34a' } },
              `${isNeg ? '' : '+'}${p.sp500Return}%`,
            ),
            createElement('div', { className: 'bar-chart-bar-wrap' },
              createElement('div', {
                className: 'bar-chart-bar',
                style: {
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  opacity: isNeg ? '0.5' : '1',
                },
              }),
            ),
            createElement('div', { className: 'bar-chart-label' }, p.name),
          );
        }),
      ),
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
