// ============================================================================
// LiquidJS Telemetry — Distributed Tracing (OpenTelemetry-compatible)
// Zero third-party dependencies — OTEL protocols implemented from scratch.
// ============================================================================

import { useEffect, useRef } from '../hooks/index';

// ---------------------------------------------------------------------------
// Trace Context — W3C Trace Context propagation
// ---------------------------------------------------------------------------

/** 16-byte (32 hex char) trace identifier. */
export type TraceId = string;

/** 8-byte (16 hex char) span identifier. */
export type SpanId = string;

/** W3C Trace Context carrier. */
export interface TraceContext {
  traceId: TraceId;
  spanId: SpanId;
  traceFlags: string;
  parentSpanId?: SpanId;
}

// -- ID generation ----------------------------------------------------------

function randomBytes(length: number): Uint8Array {
  const buf = new Uint8Array(length);
  try {
    // Works in browsers and Node >=15 (globalThis.crypto)
    crypto.getRandomValues(buf);
  } catch {
    // Fallback for environments without Web Crypto
    for (let i = 0; i < length; i++) {
      buf[i] = Math.floor(Math.random() * 256);
    }
  }
  return buf;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += (bytes[i] ?? 0).toString(16).padStart(2, '0');
  }
  return hex;
}

/** Generate a 32-hex-char trace ID (16 random bytes). */
export function generateTraceId(): TraceId {
  return bytesToHex(randomBytes(16));
}

/** Generate a 16-hex-char span ID (8 random bytes). */
export function generateSpanId(): SpanId {
  return bytesToHex(randomBytes(8));
}

// -- W3C traceparent parsing / formatting -----------------------------------

const TRACEPARENT_RE = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;

/**
 * Parse a W3C `traceparent` header.
 *
 * Format: `{version}-{traceId}-{spanId}-{traceFlags}`
 * Returns `null` when the header is invalid.
 */
export function parseTraceparent(header: string): TraceContext | null {
  const match = TRACEPARENT_RE.exec(header.trim());
  if (!match) return null;

  const traceId = match[2]!;
  const spanId = match[3]!;
  const traceFlags = match[4]!;

  // All-zero trace/span IDs are invalid per the spec.
  if (/^0+$/.test(traceId) || /^0+$/.test(spanId)) return null;

  return { traceId, spanId, traceFlags };
}

/**
 * Format a {@link TraceContext} as a W3C `traceparent` header string.
 *
 * Output: `00-{traceId}-{spanId}-{traceFlags}`
 */
export function formatTraceparent(ctx: TraceContext): string {
  return `00-${ctx.traceId}-${ctx.spanId}-${ctx.traceFlags}`;
}

// ---------------------------------------------------------------------------
// Spans
// ---------------------------------------------------------------------------

export type SpanKind = 'internal' | 'server' | 'client' | 'producer' | 'consumer';

export interface SpanStatus {
  code: 'unset' | 'ok' | 'error';
  message?: string;
}

export interface SpanEvent {
  name: string;
  timestamp: number;
  attributes?: Record<string, string | number | boolean>;
}

export interface Span {
  traceId: TraceId;
  spanId: SpanId;
  parentSpanId?: SpanId;
  name: string;
  kind: SpanKind;
  startTime: number;
  endTime?: number;
  status: SpanStatus;
  attributes: Record<string, string | number | boolean>;
  events: SpanEvent[];
}

export interface StartSpanOptions {
  kind?: SpanKind;
  parentSpanId?: SpanId;
  traceId?: TraceId;
  attributes?: Record<string, string | number | boolean>;
}

/**
 * Create and start a new span. The span is **not** automatically associated
 * with a tracer — use {@link Tracer.startSpan} for automatic parent tracking.
 */
export function startSpan(name: string, opts?: StartSpanOptions): Span {
  return {
    traceId: opts?.traceId ?? generateTraceId(),
    spanId: generateSpanId(),
    parentSpanId: opts?.parentSpanId,
    name,
    kind: opts?.kind ?? 'internal',
    startTime: performance.now(),
    status: { code: 'unset' },
    attributes: opts?.attributes ? { ...opts.attributes } : {},
    events: [],
  };
}

/** End a span by recording its end time. */
export function endSpan(span: Span): void {
  span.endTime = performance.now();
}

// ---------------------------------------------------------------------------
// Tracer
// ---------------------------------------------------------------------------

export interface TracerConfig {
  serviceName: string;
  serviceVersion?: string;
  endpoint?: string;
  headers?: Record<string, string>;
  batchSize?: number;
  flushInterval?: number;
}

export interface Tracer {
  /** Create a span, automatically parented to the current active span. */
  startSpan(name: string, opts?: StartSpanOptions): Span;

  /**
   * Execute `fn` with `span` as the active span. The span is automatically
   * ended when `fn` completes (sync or async). The previous active span is
   * restored afterward.
   */
  withSpan<T>(span: Span, fn: () => T): T;

  /** Export all pending (buffered) spans to the configured endpoint. */
  flush(): Promise<void>;

  /** Access the currently-active span (top of the span stack), or `undefined`. */
  activeSpan(): Span | undefined;

  /** Read-only view of the pending span buffer. */
  readonly pendingSpans: ReadonlyArray<Span>;

  /** Tracer configuration. */
  readonly config: Readonly<TracerConfig>;
}

export function createTracer(config: TracerConfig): Tracer {
  const spanStack: Span[] = [];
  const buffer: Span[] = [];
  // batchSize reserved for future batched export
  void config.batchSize;

  // Auto-flush timer (if configured)
  let flushTimer: ReturnType<typeof setInterval> | undefined;
  if (config.flushInterval && config.flushInterval > 0) {
    flushTimer = setInterval(() => {
      void tracer.flush();
    }, config.flushInterval);
    // Allow the process to exit even if the timer is running (Node.js).
    if (typeof flushTimer === 'object' && 'unref' in flushTimer) {
      (flushTimer as { unref: () => void }).unref();
    }
  }

  const tracer: Tracer = {
    config,

    get pendingSpans(): ReadonlyArray<Span> {
      return buffer;
    },

    activeSpan(): Span | undefined {
      return spanStack.length > 0 ? spanStack[spanStack.length - 1] : undefined;
    },

    startSpan(name: string, opts?: StartSpanOptions): Span {
      const active = tracer.activeSpan();
      const span = startSpan(name, {
        kind: opts?.kind,
        attributes: opts?.attributes,
        traceId: opts?.traceId ?? active?.traceId,
        parentSpanId: opts?.parentSpanId ?? active?.spanId,
      });
      spanStack.push(span);
      return span;
    },

    withSpan<T>(span: Span, fn: () => T): T {
      // Only push if not already on the stack (startSpan may have pushed it).
      const alreadyOnStack = spanStack.includes(span);
      if (!alreadyOnStack) {
        spanStack.push(span);
      }

      const removeFromStack = (): void => {
        // Remove ALL occurrences of the span from the stack.
        for (let i = spanStack.length - 1; i >= 0; i--) {
          if (spanStack[i] === span) {
            spanStack.splice(i, 1);
          }
        }
      };

      try {
        const result = fn();
        // Handle thenables (Promises) without importing anything.
        if (result && typeof (result as unknown as Promise<unknown>).then === 'function') {
          return (result as unknown as Promise<unknown>).then(
            (value) => {
              endSpan(span);
              buffer.push(span);
              removeFromStack();
              return value;
            },
            (err) => {
              span.status = { code: 'error', message: String(err) };
              endSpan(span);
              buffer.push(span);
              removeFromStack();
              throw err;
            },
          ) as unknown as T;
        }
        endSpan(span);
        buffer.push(span);
        removeFromStack();
        return result;
      } catch (err) {
        span.status = { code: 'error', message: String(err) };
        endSpan(span);
        buffer.push(span);
        removeFromStack();
        throw err;
      }
    },

    async flush(): Promise<void> {
      if (buffer.length === 0) return;

      const toExport = buffer.splice(0, buffer.length);

      if (config.endpoint) {
        // Lazy-import format helper to avoid circular deps at module level.
        const { formatOtlpTraces, exportToEndpoint } = await import('./metrics');
        const body = formatOtlpTraces(toExport, config.serviceName, config.serviceVersion);
        await exportToEndpoint(config.endpoint, config.headers ?? {}, body);
      }
    },
  };

  return tracer;
}

// ---------------------------------------------------------------------------
// useTracing hook
// ---------------------------------------------------------------------------

/**
 * Hook that creates a span for the component render lifecycle.
 * Auto-starts on mount, records render duration, ends on unmount.
 */
export function useTracing(tracer: Tracer, name: string): void {
  const spanRef = useRef<Span | null>(null);

  useEffect(() => {
    // Mount — start span
    const span = tracer.startSpan(name, { kind: 'internal' });
    span.events.push({ name: 'mount', timestamp: performance.now() });
    spanRef.current = span;

    return () => {
      // Unmount — end span
      if (spanRef.current) {
        spanRef.current.events.push({ name: 'unmount', timestamp: performance.now() });
        endSpan(spanRef.current);
      }
    };
  }, []);
}
