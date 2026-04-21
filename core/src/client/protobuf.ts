// ============================================================================
// LiquidJS Protobuf / gRPC-Web Client
// Zero third-party dependencies — wire format implemented from scratch.
// ============================================================================

import { useState, useEffect, useCallback, useRef } from '../hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FieldType = 'int32' | 'uint32' | 'string' | 'bool' | 'bytes' | 'float64' | 'enum';

export interface FieldDescriptor {
  tag: number;
  type: FieldType;
  repeated?: boolean;
}

export type FieldMap = Record<string, FieldDescriptor>;

export interface MessageType<T> {
  name: string;
  fields: FieldMap;
  encode(obj: T): Uint8Array;
  decode(bytes: Uint8Array): T;
}

export interface GrpcWebClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

export interface GrpcWebClient {
  unary<Req, Res>(
    service: string,
    method: string,
    reqType: MessageType<Req>,
    resType: MessageType<Res>,
    request: Req,
  ): Promise<Res>;
}

export interface UseProtoResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ---------------------------------------------------------------------------
// Varint helpers
// ---------------------------------------------------------------------------

/** Encode an unsigned 32-bit integer as a varint into an array of bytes. */
export function encodeVarint(value: number): number[] {
  const bytes: number[] = [];
  // Treat as unsigned 32-bit
  let v = value >>> 0;
  while (v > 0x7f) {
    bytes.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  bytes.push(v & 0x7f);
  return bytes;
}

/** Decode a varint from a Uint8Array starting at `offset`. Returns [value, newOffset]. */
export function decodeVarint(bytes: Uint8Array, offset: number): [number, number] {
  let result = 0;
  let shift = 0;
  let pos = offset;
  while (pos < bytes.length) {
    const b = bytes[pos]!;
    result |= (b & 0x7f) << shift;
    pos++;
    if ((b & 0x80) === 0) {
      return [result >>> 0, pos];
    }
    shift += 7;
    if (shift >= 35) {
      throw new Error('Varint too long');
    }
  }
  throw new Error('Unexpected end of data while decoding varint');
}

// ---------------------------------------------------------------------------
// Wire-type helpers
// ---------------------------------------------------------------------------

const WIRE_VARINT = 0;
const WIRE_64BIT = 1;
const WIRE_LENGTH_DELIMITED = 2;

function wireTypeFor(type: FieldType): number {
  switch (type) {
    case 'int32':
    case 'uint32':
    case 'bool':
    case 'enum':
      return WIRE_VARINT;
    case 'float64':
      return WIRE_64BIT;
    case 'string':
    case 'bytes':
      return WIRE_LENGTH_DELIMITED;
  }
}

// ---------------------------------------------------------------------------
// Field encoding
// ---------------------------------------------------------------------------

function encodeFieldKey(tag: number, wireType: number): number[] {
  return encodeVarint((tag << 3) | wireType);
}

function encodeFieldValue(type: FieldType, value: unknown): number[] {
  switch (type) {
    case 'int32': {
      const n = value as number;
      // Signed int32 — use zig-zag? No, standard protobuf int32 just uses varint.
      // Negative int32 in proto uses 10-byte two's complement, but for simplicity
      // we treat as unsigned 32-bit (matching proto3 behavior for small negatives).
      return encodeVarint(n | 0);
    }
    case 'uint32':
      return encodeVarint((value as number) >>> 0);
    case 'bool':
      return encodeVarint(value ? 1 : 0);
    case 'enum':
      return encodeVarint((value as number) >>> 0);
    case 'float64': {
      const buf = new ArrayBuffer(8);
      new DataView(buf).setFloat64(0, value as number, true); // little-endian
      return Array.from(new Uint8Array(buf));
    }
    case 'string': {
      const encoded = new TextEncoder().encode(value as string);
      return [...encodeVarint(encoded.length), ...encoded];
    }
    case 'bytes': {
      const data = value as Uint8Array;
      return [...encodeVarint(data.length), ...data];
    }
  }
}

// ---------------------------------------------------------------------------
// Field decoding
// ---------------------------------------------------------------------------

function decodeFieldValue(
  type: FieldType,
  wireType: number,
  bytes: Uint8Array,
  offset: number,
): [unknown, number] {
  switch (wireType) {
    case WIRE_VARINT: {
      const [val, newOffset] = decodeVarint(bytes, offset);
      switch (type) {
        case 'bool':
          return [val !== 0, newOffset];
        case 'int32':
          return [(val | 0), newOffset]; // sign-extend
        case 'uint32':
        case 'enum':
          return [val >>> 0, newOffset];
        default:
          return [val, newOffset];
      }
    }
    case WIRE_64BIT: {
      if (offset + 8 > bytes.length) {
        throw new Error('Unexpected end of data while decoding 64-bit value');
      }
      const buf = new ArrayBuffer(8);
      const view = new Uint8Array(buf);
      for (let i = 0; i < 8; i++) {
        view[i] = bytes[offset + i] ?? 0;
      }
      const dv = new DataView(buf);
      return [dv.getFloat64(0, true), offset + 8];
    }
    case WIRE_LENGTH_DELIMITED: {
      const [len, dataStart] = decodeVarint(bytes, offset);
      if (dataStart + len > bytes.length) {
        throw new Error('Unexpected end of data while decoding length-delimited value');
      }
      const slice = bytes.slice(dataStart, dataStart + len);
      if (type === 'string') {
        return [new TextDecoder().decode(slice), dataStart + len];
      }
      // bytes
      return [slice, dataStart + len];
    }
    default:
      throw new Error(`Unknown wire type: ${wireType}`);
  }
}

// ---------------------------------------------------------------------------
// defineMessage
// ---------------------------------------------------------------------------

export function defineMessage<T>(name: string, fields: FieldMap): MessageType<T> {
  // Build lookup: tag -> { fieldName, descriptor }
  const tagToField = new Map<number, { fieldName: string; descriptor: FieldDescriptor }>();
  for (const [fieldName, descriptor] of Object.entries(fields)) {
    tagToField.set(descriptor.tag, { fieldName, descriptor });
  }

  function encode(obj: T): Uint8Array {
    const out: number[] = [];
    const record = obj as Record<string, unknown>;

    for (const [fieldName, descriptor] of Object.entries(fields)) {
      const value = record[fieldName];
      if (value === undefined || value === null) continue;

      const wt = wireTypeFor(descriptor.type);

      if (descriptor.repeated) {
        const arr = value as unknown[];
        for (const item of arr) {
          out.push(...encodeFieldKey(descriptor.tag, wt));
          out.push(...encodeFieldValue(descriptor.type, item));
        }
      } else {
        out.push(...encodeFieldKey(descriptor.tag, wt));
        out.push(...encodeFieldValue(descriptor.type, value));
      }
    }

    return new Uint8Array(out);
  }

  function decode(bytes: Uint8Array): T {
    const result: Record<string, unknown> = {};

    // Initialize repeated fields as empty arrays
    for (const [fieldName, descriptor] of Object.entries(fields)) {
      if (descriptor.repeated) {
        result[fieldName] = [];
      }
    }

    let offset = 0;
    while (offset < bytes.length) {
      const [keyVarint, newOffset] = decodeVarint(bytes, offset);
      const tag = keyVarint >>> 3;
      const wireType = keyVarint & 0x07;
      offset = newOffset;

      const entry = tagToField.get(tag);
      if (!entry) {
        // Skip unknown field
        offset = skipField(wireType, bytes, offset);
        continue;
      }

      const [value, nextOffset] = decodeFieldValue(
        entry.descriptor.type,
        wireType,
        bytes,
        offset,
      );
      offset = nextOffset;

      if (entry.descriptor.repeated) {
        (result[entry.fieldName] as unknown[]).push(value);
      } else {
        result[entry.fieldName] = value;
      }
    }

    return result as T;
  }

  return { name, fields, encode, decode };
}

/** Skip an unknown field so parsing can continue. */
function skipField(wireType: number, bytes: Uint8Array, offset: number): number {
  switch (wireType) {
    case WIRE_VARINT: {
      const [, next] = decodeVarint(bytes, offset);
      return next;
    }
    case WIRE_64BIT:
      return offset + 8;
    case WIRE_LENGTH_DELIMITED: {
      const [len, dataStart] = decodeVarint(bytes, offset);
      return dataStart + len;
    }
    default:
      throw new Error(`Cannot skip unknown wire type: ${wireType}`);
  }
}

// ---------------------------------------------------------------------------
// gRPC-Web framing helpers
// ---------------------------------------------------------------------------

/** Encode a message into a gRPC-Web frame: [flags:1][length:4][data:N] */
export function encodeGrpcWebFrame(data: Uint8Array, flags: number = 0): Uint8Array {
  const frame = new Uint8Array(5 + data.length);
  frame[0] = flags;
  // Big-endian 4-byte length
  const dv = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
  dv.setUint32(1, data.length, false);
  frame.set(data, 5);
  return frame;
}

/** Decode the first gRPC-Web frame from bytes. Returns [flags, data, bytesConsumed]. */
export function decodeGrpcWebFrame(
  bytes: Uint8Array,
): [number, Uint8Array, number] {
  if (bytes.length < 5) {
    throw new Error('gRPC-Web frame too short');
  }
  const flags = bytes[0] ?? 0;
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const length = dv.getUint32(1, false);
  if (bytes.length < 5 + length) {
    throw new Error('gRPC-Web frame data incomplete');
  }
  const data = bytes.slice(5, 5 + length);
  return [flags, data, 5 + length] as [number, Uint8Array, number];
}

// ---------------------------------------------------------------------------
// gRPC-Web client
// ---------------------------------------------------------------------------

export function createGrpcWebClient(config: GrpcWebClientConfig): GrpcWebClient {
  const { baseURL, headers: extraHeaders } = config;

  async function unary<Req, Res>(
    service: string,
    method: string,
    reqType: MessageType<Req>,
    resType: MessageType<Res>,
    request: Req,
  ): Promise<Res> {
    const reqBytes = reqType.encode(request);
    const frame = encodeGrpcWebFrame(reqBytes);

    const url = `${baseURL.replace(/\/+$/, '')}/${service}/${method}`;

    const hdrs: Record<string, string> = {
      'Content-Type': 'application/grpc-web+proto',
      Accept: 'application/grpc-web+proto',
      'X-Grpc-Web': '1',
      ...extraHeaders,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: hdrs,
      body: frame.buffer as ArrayBuffer,
    });

    if (!response.ok) {
      throw new Error(`gRPC-Web request failed: ${response.status} ${response.statusText}`);
    }

    const responseBytes = new Uint8Array(await response.arrayBuffer());

    // The response contains one or more gRPC-Web frames.
    // The first frame with flags === 0 contains the data.
    let offset = 0;
    while (offset < responseBytes.length) {
      const [flags, data, consumed] = decodeGrpcWebFrame(
        responseBytes.subarray(offset),
      );
      offset += consumed;

      // flags === 0 means data frame, flags & 0x80 means trailers
      if ((flags & 0x80) === 0) {
        return resType.decode(data);
      }
    }

    throw new Error('No data frame found in gRPC-Web response');
  }

  return { unary };
}

// ---------------------------------------------------------------------------
// useProto hook
// ---------------------------------------------------------------------------

export function useProto<Req, Res>(
  client: GrpcWebClient,
  service: string,
  method: string,
  reqType: MessageType<Req>,
  resType: MessageType<Res>,
  request: Req,
  opts?: { enabled?: boolean },
): UseProtoResult<Res> {
  const [data, setData] = useState<Res | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  const requestRef = useRef(request);
  requestRef.current = request;

  const enabled = opts?.enabled !== false;

  const refetch = useCallback(() => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    client
      .unary(service, method, reqType, resType, requestRef.current)
      .then((res) => {
        if (mountedRef.current) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (mountedRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
  }, [client, service, method, reqType, resType, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    refetch();
    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { data, loading, error, refetch };
}
