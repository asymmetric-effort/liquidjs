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
  /**
   * Maximum number of bytes to write per chunk.
   * Smaller values allow the event loop to process other work between chunks.
   * Default: 8192 (8KB)
   */
  progressiveChunkSize?: number;
}

/**
 * Renders a LiquidJS tree to a Node.js pipeable stream.
 * Equivalent to ReactDOMServer.renderToPipeableStream.
 *
 * Renders the full HTML string first, then writes it in chunks to the
 * writable stream. Each chunk yields to the event loop, allowing other
 * I/O operations to interleave with the response body.
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

      let html: string;
      try {
        html = renderToString(element);
      } catch (error) {
        options?.onShellError?.(error);
        options?.onError?.(error);
        destination.end();
        return destination;
      }

      options?.onShellReady?.();

      const chunkSize = options?.progressiveChunkSize ?? 8192;

      if (html.length <= chunkSize) {
        // Small enough to write in one shot
        destination.write(html);
        destination.end();
        options?.onAllReady?.();
      } else {
        // Write in chunks, yielding between each
        let offset = 0;

        function writeNextChunk(): void {
          if (aborted || offset >= html.length) {
            destination.end();
            options?.onAllReady?.();
            return;
          }

          const chunk = html.slice(offset, offset + chunkSize);
          offset += chunkSize;

          const canContinue = destination.write(chunk);
          if (canContinue) {
            // Yield to event loop before next chunk
            setImmediate(writeNextChunk);
          } else {
            // Respect backpressure
            destination.once('drain', writeNextChunk);
          }
        }

        writeNextChunk();
      }

      return destination;
    },
    abort(reason?: unknown): void {
      aborted = true;
      options?.onError?.(reason);
    },
  };
}
