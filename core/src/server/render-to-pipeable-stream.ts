import type { LiquidNode } from '../shared/types';
import type { Writable } from 'stream';
import { renderToString } from './render-to-string';

export interface PipeableStream {
  pipe<T extends Writable>(destination: T): T;
  abort(reason?: unknown): void;
}

export interface RenderToPipeableStreamOptions {
  identifierPrefix?: string;
  onShellReady?: () => void;
  onShellError?: (error: unknown) => void;
  onAllReady?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Renders a LiquidJS tree to a Node.js pipeable stream.
 * Equivalent to ReactDOMServer.renderToPipeableStream.
 */
export function renderToPipeableStream(
  element: LiquidNode,
  options?: RenderToPipeableStreamOptions,
): PipeableStream {
  let aborted = false;

  return {
    pipe<T extends Writable>(destination: T): T {
      if (aborted) {
        destination.end();
        return destination;
      }

      try {
        const html = renderToString(element);
        options?.onShellReady?.();
        destination.write(html);
        destination.end();
        options?.onAllReady?.();
      } catch (error) {
        options?.onShellError?.(error);
        options?.onError?.(error);
        destination.end();
      }

      return destination;
    },
    abort(reason?: unknown): void {
      aborted = true;
      options?.onError?.(reason);
    },
  };
}
