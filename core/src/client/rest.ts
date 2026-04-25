// ============================================================================
// SpecifyJS REST Client
// Zero-dependency REST client built on the browser Fetch API
// ============================================================================
// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { useState, useEffect, useCallback, useRef } from '../hooks/index';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RestClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
    error?: ErrorInterceptor[];
  };
}

export interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  timeout?: number;
}

export interface RestResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  ok: boolean;
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: RestResponse<unknown>) => RestResponse<unknown>;
export type ErrorInterceptor = (error: RestError) => RestError | Promise<RestError>;

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

export interface RestClient {
  get<T>(path: string, opts?: RequestOptions): Promise<RestResponse<T>>;
  post<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<RestResponse<T>>;
  put<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<RestResponse<T>>;
  patch<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<RestResponse<T>>;
  delete<T>(path: string, opts?: RequestOptions): Promise<RestResponse<T>>;
}

// ---------------------------------------------------------------------------
// RestError
// ---------------------------------------------------------------------------

export class RestError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: unknown;
  public readonly config: RequestConfig;

  constructor(
    message: string,
    status: number,
    statusText: string,
    data: unknown,
    config: RequestConfig,
  ) {
    super(message);
    this.name = 'RestError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.config = config;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function parseResponseHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function buildURL(baseURL: string, path: string): string {
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const rel = path.startsWith('/') ? path : '/' + path;
  return base + rel;
}

// ---------------------------------------------------------------------------
// createRestClient
// ---------------------------------------------------------------------------

export function createRestClient(config: RestClientConfig): RestClient {
  const {
    baseURL,
    headers: defaultHeaders = {},
    timeout: defaultTimeout,
    interceptors = {},
  } = config;

  const requestInterceptors = interceptors.request ?? [];
  const responseInterceptors = interceptors.response ?? [];
  const errorInterceptors = interceptors.error ?? [];

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    opts?: RequestOptions,
  ): Promise<RestResponse<T>> {
    // Build initial request config
    let reqConfig: RequestConfig = {
      url: buildURL(baseURL, path),
      method,
      headers: {
        ...defaultHeaders,
        ...(opts?.headers ?? {}),
      },
      body,
      signal: opts?.signal,
      timeout: opts?.timeout ?? defaultTimeout,
    };

    // Add Content-Type for requests with a body
    if (body !== undefined && body !== null && !reqConfig.headers['Content-Type']) {
      reqConfig.headers['Content-Type'] = 'application/json';
    }

    // Run request interceptors
    for (const interceptor of requestInterceptors) {
      reqConfig = await interceptor(reqConfig);
    }

    // Set up timeout via AbortController
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    if (reqConfig.timeout && reqConfig.timeout > 0) {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller!.abort();
      }, reqConfig.timeout);

      // If the caller already provided a signal, listen for its abort too
      if (reqConfig.signal) {
        const externalSignal = reqConfig.signal;
        if (externalSignal.aborted) {
          controller.abort();
        } else {
          externalSignal.addEventListener('abort', () => {
            controller!.abort();
          });
        }
      }
    }

    const fetchSignal = controller ? controller.signal : reqConfig.signal;

    // Build fetch init
    const fetchInit: RequestInit = {
      method: reqConfig.method,
      headers: reqConfig.headers,
      signal: fetchSignal,
    };

    if (body !== undefined && body !== null) {
      fetchInit.body = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(reqConfig.url, fetchInit);
    } catch (err: unknown) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      const message = isAbort
        ? `Request timeout after ${reqConfig.timeout}ms`
        : err instanceof Error
          ? err.message
          : 'Network error';

      let restError = new RestError(message, 0, '', null, reqConfig);
      for (const interceptor of errorInterceptors) {
        restError = await interceptor(restError);
      }
      throw restError;
    }

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    // Parse response body
    const contentType = response.headers.get('content-type') ?? '';
    let data: T;
    if (contentType.includes('application/json')) {
      data = (await response.json()) as T;
    } else {
      const text = await response.text();
      // Attempt JSON parse for responses without explicit content-type
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = text as unknown as T;
      }
    }

    const parsedHeaders = parseResponseHeaders(response.headers);

    if (!response.ok) {
      let restError = new RestError(
        `Request failed with status ${response.status}`,
        response.status,
        response.statusText,
        data,
        reqConfig,
      );
      for (const interceptor of errorInterceptors) {
        restError = await interceptor(restError);
      }
      throw restError;
    }

    let restResponse: RestResponse<T> = {
      data,
      status: response.status,
      headers: parsedHeaders,
      ok: response.ok,
    };

    // Run response interceptors
    for (const interceptor of responseInterceptors) {
      restResponse = interceptor(restResponse as RestResponse<unknown>) as RestResponse<T>;
    }

    return restResponse;
  }

  return {
    get<T>(path: string, opts?: RequestOptions): Promise<RestResponse<T>> {
      return request<T>('GET', path, undefined, opts);
    },
    post<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<RestResponse<T>> {
      return request<T>('POST', path, body, opts);
    },
    put<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<RestResponse<T>> {
      return request<T>('PUT', path, body, opts);
    },
    patch<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<RestResponse<T>> {
      return request<T>('PATCH', path, body, opts);
    },
    delete<T>(path: string, opts?: RequestOptions): Promise<RestResponse<T>> {
      return request<T>('DELETE', path, undefined, opts);
    },
  };
}

// ---------------------------------------------------------------------------
// useRest hook
// ---------------------------------------------------------------------------

export interface UseRestOptions {
  method?: string;
  body?: unknown;
  deps?: readonly unknown[];
  enabled?: boolean;
}

export interface UseRestResult<T> {
  data: T | null;
  loading: boolean;
  error: RestError | null;
  refetch: () => void;
}

export function useRest<T>(
  client: RestClient,
  path: string,
  opts?: UseRestOptions,
): UseRestResult<T> {
  const method = opts?.method ?? 'GET';
  const body = opts?.body;
  const deps = opts?.deps ?? [];
  const enabled = opts?.enabled ?? true;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<RestError | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef<boolean>(true);

  const fetchData = useCallback(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Cancel any previous in-flight request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    const requestOpts: RequestOptions = { signal: controller.signal };

    let promise: Promise<RestResponse<T>>;
    const upperMethod = method.toUpperCase();
    if (upperMethod === 'POST') {
      promise = client.post<T>(path, body, requestOpts);
    } else if (upperMethod === 'PUT') {
      promise = client.put<T>(path, body, requestOpts);
    } else if (upperMethod === 'PATCH') {
      promise = client.patch<T>(path, body, requestOpts);
    } else if (upperMethod === 'DELETE') {
      promise = client.delete<T>(path, requestOpts);
    } else {
      promise = client.get<T>(path, requestOpts);
    }

    promise
      .then((response) => {
        if (mountedRef.current && !controller.signal.aborted) {
          setData(response.data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (mountedRef.current && !controller.signal.aborted) {
          setError(
            err instanceof RestError
              ? err
              : new RestError(err instanceof Error ? err.message : 'Unknown error', 0, '', null, {
                  url: path,
                  method: upperMethod,
                  headers: {},
                }),
          );
          setLoading(false);
        }
      });
  }, [client, path, method, body, enabled, ...deps]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
