// ============================================================================
// SpecifyJS Telemetry — Metrics (OpenTelemetry-compatible)
// Zero third-party dependencies — OTEL protocols implemented from scratch.
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import type { Span } from './tracing';
import { assertSecureUrl } from '../shared/secure-fetch';

// ---------------------------------------------------------------------------
// Metric data points
// ---------------------------------------------------------------------------

export interface DataPoint {
  value: number;
  attributes: Record<string, string | number | boolean>;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Instruments
// ---------------------------------------------------------------------------

export interface Counter {
  readonly name: string;
  readonly description: string;
  /** Monotonically increment the counter. */
  add(value: number, attributes?: Record<string, string | number | boolean>): void;
  /** Read-only snapshot of data points. */
  readonly dataPoints: ReadonlyArray<DataPoint>;
}

export interface Histogram {
  readonly name: string;
  readonly description: string;
  /** Record a measurement. */
  record(value: number, attributes?: Record<string, string | number | boolean>): void;
  /** Read-only snapshot of data points. */
  readonly dataPoints: ReadonlyArray<DataPoint>;
}

export interface Gauge {
  readonly name: string;
  readonly description: string;
  /** Set the current value. */
  set(value: number, attributes?: Record<string, string | number | boolean>): void;
  /** Read-only snapshot of data points. */
  readonly dataPoints: ReadonlyArray<DataPoint>;
}

export type Instrument = Counter | Histogram | Gauge;

export interface InstrumentOptions {
  description?: string;
  unit?: string;
}

// ---------------------------------------------------------------------------
// Instrument factories (internal)
// ---------------------------------------------------------------------------

const MAX_DATA_POINTS = 10000;

function addDataPoint(
  points: DataPoint[],
  value: number,
  attributes?: Record<string, string | number | boolean>,
): void {
  if (points.length >= MAX_DATA_POINTS) {
    points.splice(0, Math.floor(MAX_DATA_POINTS / 2));
  }
  points.push({
    value,
    attributes: attributes ? { ...attributes } : {},
    timestamp: performance.now(),
  });
}

function createCounter(name: string, opts?: InstrumentOptions): Counter {
  const points: DataPoint[] = [];
  return {
    name,
    description: opts?.description ?? '',
    add(value: number, attributes?: Record<string, string | number | boolean>): void {
      if (value < 0) return; // counters are monotonic
      addDataPoint(points, value, attributes);
    },
    get dataPoints(): ReadonlyArray<DataPoint> {
      return points;
    },
  };
}

function createHistogram(name: string, opts?: InstrumentOptions): Histogram {
  const points: DataPoint[] = [];
  return {
    name,
    description: opts?.description ?? '',
    record(value: number, attributes?: Record<string, string | number | boolean>): void {
      addDataPoint(points, value, attributes);
    },
    get dataPoints(): ReadonlyArray<DataPoint> {
      return points;
    },
  };
}

function createGauge(name: string, opts?: InstrumentOptions): Gauge {
  const points: DataPoint[] = [];
  return {
    name,
    description: opts?.description ?? '',
    set(value: number, attributes?: Record<string, string | number | boolean>): void {
      addDataPoint(points, value, attributes);
    },
    get dataPoints(): ReadonlyArray<DataPoint> {
      return points;
    },
  };
}

// ---------------------------------------------------------------------------
// MeterProvider
// ---------------------------------------------------------------------------

export interface MeterProviderConfig {
  serviceName: string;
  endpoint?: string;
  headers?: Record<string, string>;
  exportInterval?: number;
}

export interface MeterProvider {
  counter(name: string, opts?: InstrumentOptions): Counter;
  histogram(name: string, opts?: InstrumentOptions): Histogram;
  gauge(name: string, opts?: InstrumentOptions): Gauge;
  /** Export all instrument data to the configured endpoint. */
  flush(): Promise<void>;
  /** Read-only access to all registered instruments. */
  readonly instruments: ReadonlyArray<Instrument>;
  readonly config: Readonly<MeterProviderConfig>;
}

export function createMeterProvider(config: MeterProviderConfig): MeterProvider {
  const instruments: Instrument[] = [];

  let exportTimer: ReturnType<typeof setInterval> | undefined;
  /* v8 ignore start -- timer setup requires real interval environment */
  if (config.exportInterval && config.exportInterval > 0) {
    exportTimer = setInterval(() => {
      void provider.flush();
    }, config.exportInterval);
    if (typeof exportTimer === 'object' && 'unref' in exportTimer) {
      (exportTimer as { unref: () => void }).unref();
    }
  }
  /* v8 ignore stop */

  const provider: MeterProvider = {
    config,

    get instruments(): ReadonlyArray<Instrument> {
      return instruments;
    },

    counter(name: string, opts?: InstrumentOptions): Counter {
      const c = createCounter(name, opts);
      instruments.push(c);
      return c;
    },

    histogram(name: string, opts?: InstrumentOptions): Histogram {
      const h = createHistogram(name, opts);
      instruments.push(h);
      return h;
    },

    gauge(name: string, opts?: InstrumentOptions): Gauge {
      const g = createGauge(name, opts);
      instruments.push(g);
      return g;
    },

    async flush(): Promise<void> {
      if (!config.endpoint) return;

      const body = formatOtlpMetrics(instruments, config.serviceName);
      await exportToEndpoint(config.endpoint, config.headers ?? {}, body);
    },
  };

  return provider;
}

// ---------------------------------------------------------------------------
// OTLP JSON export helpers
// ---------------------------------------------------------------------------

/** Attributes to the OTLP key-value array format. */
function toOtlpAttributes(
  attrs: Record<string, string | number | boolean>,
): Array<{ key: string; value: { stringValue?: string; intValue?: number; boolValue?: boolean } }> {
  return Object.entries(attrs).map(([key, val]) => {
    if (typeof val === 'string') return { key, value: { stringValue: val } };
    if (typeof val === 'boolean') return { key, value: { boolValue: val } };
    return { key, value: { intValue: val } };
  });
}

/** Convert a `performance.now()` timestamp to nanoseconds (OTLP convention). */
function toNanos(ms: number): string {
  return String(Math.round(ms * 1_000_000));
}

/**
 * Build an OTLP-compatible JSON payload for metrics.
 *
 * Structure follows the OTLP/HTTP JSON proto mapping:
 * https://opentelemetry.io/docs/specs/otlp/#otlphttp
 */
export function formatOtlpMetrics(
  instruments: ReadonlyArray<Instrument>,
  serviceName?: string,
): Record<string, unknown> {
  const metrics = instruments.map((inst) => {
    const dataPoints = inst.dataPoints.map((dp) => ({
      attributes: toOtlpAttributes(dp.attributes),
      timeUnixNano: toNanos(dp.timestamp),
      asDouble: dp.value,
    }));

    // Determine metric type heuristic: counters have `add`, histograms have
    // `record`, gauges have `set`.
    let metricData: Record<string, unknown>;
    if ('add' in inst) {
      metricData = { sum: { dataPoints, isMonotonic: true, aggregationTemporality: 2 } };
    } else if ('record' in inst) {
      metricData = { histogram: { dataPoints, aggregationTemporality: 2 } };
    } else {
      metricData = { gauge: { dataPoints } };
    }

    return {
      name: inst.name,
      description: inst.description,
      ...metricData,
    };
  });

  return {
    resourceMetrics: [
      {
        resource: {
          attributes: toOtlpAttributes({
            'service.name': serviceName ?? 'unknown',
          }),
        },
        scopeMetrics: [
          {
            scope: { name: 'specifyjs-telemetry', version: '1.0.0' },
            metrics,
          },
        ],
      },
    ],
  };
}

/**
 * Build an OTLP-compatible JSON payload for traces/spans.
 */
export function formatOtlpTraces(
  spans: ReadonlyArray<Span>,
  serviceName?: string,
  serviceVersion?: string,
): Record<string, unknown> {
  const resourceAttrs: Record<string, string> = {
    'service.name': serviceName ?? 'unknown',
  };
  if (serviceVersion) {
    resourceAttrs['service.version'] = serviceVersion;
  }

  const SPAN_KIND_MAP: Record<string, number> = {
    internal: 1,
    server: 2,
    client: 3,
    producer: 4,
    consumer: 5,
  };

  const STATUS_CODE_MAP: Record<string, number> = {
    unset: 0,
    ok: 1,
    error: 2,
  };

  const otlpSpans = spans.map((s) => ({
    traceId: s.traceId,
    spanId: s.spanId,
    parentSpanId: s.parentSpanId ?? '',
    name: s.name,
    kind: SPAN_KIND_MAP[s.kind] ?? 1,
    startTimeUnixNano: toNanos(s.startTime),
    endTimeUnixNano: s.endTime !== undefined ? toNanos(s.endTime) : '0',
    attributes: toOtlpAttributes(s.attributes),
    status: {
      code: STATUS_CODE_MAP[s.status.code] ?? 0,
      message: s.status.message ?? '',
    },
    events: s.events.map((e) => ({
      name: e.name,
      timeUnixNano: toNanos(e.timestamp),
      attributes: e.attributes ? toOtlpAttributes(e.attributes) : [],
    })),
  }));

  return {
    resourceSpans: [
      {
        resource: {
          attributes: toOtlpAttributes(resourceAttrs),
        },
        scopeSpans: [
          {
            scope: { name: 'specifyjs-telemetry', version: '1.0.0' },
            spans: otlpSpans,
          },
        ],
      },
    ],
  };
}

/**
 * Send a JSON payload to an OTLP-compatible endpoint via `fetch`.
 */
export async function exportToEndpoint(
  url: string,
  headers: Record<string, string>,
  body: Record<string, unknown>,
): Promise<void> {
  try {
    assertSecureUrl(url);
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Telemetry export failures are silently ignored so they never break
    // application code.
  }
}
