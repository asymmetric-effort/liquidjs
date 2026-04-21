import type { LiquidNode } from '../shared/types';
import type { Writable } from 'stream';

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
  _element: LiquidNode,
  _options?: RenderToPipeableStreamOptions,
): PipeableStream {
  // TODO: implement streaming server renderer
  return {
    pipe<T extends Writable>(destination: T): T {
      destination.end();
      return destination;
    },
    abort(_reason?: unknown): void {
      // no-op placeholder
    },
  };
}
