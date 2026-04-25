// ============================================================================
// SpecifyJS Telemetry — Public API
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

export {
  // Types
  type TraceId,
  type SpanId,
  type TraceContext,
  type SpanKind,
  type SpanStatus,
  type SpanEvent,
  type Span,
  type StartSpanOptions,
  type TracerConfig,
  type Tracer,
  // Functions
  generateTraceId,
  generateSpanId,
  parseTraceparent,
  formatTraceparent,
  startSpan,
  endSpan,
  createTracer,
  useTracing,
} from './tracing';

export {
  // Types
  type DataPoint,
  type Counter,
  type Histogram,
  type Gauge,
  type Instrument,
  type InstrumentOptions,
  type MeterProviderConfig,
  type MeterProvider,
  // Functions
  createMeterProvider,
  formatOtlpMetrics,
  formatOtlpTraces,
  exportToEndpoint,
} from './metrics';
