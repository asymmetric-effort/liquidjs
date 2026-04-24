import type { LiquidNode } from '../shared/types';
import { renderToString } from './render-to-string';

export interface RenderToReadableStreamOptions {
  identifierPrefix?: string;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
  /**
   * Maximum bytes per chunk for progressive flushing.
   * Default: 8192 (8KB)
   */
  progressiveChunkSize?: number;
}

/**
 * Renders a LiquidJS tree to a web ReadableStream.
 * Equivalent to ReactDOMServer.renderToReadableStream.
 *
 * Renders the full HTML, then enqueues it in chunks so the stream
 * can be consumed progressively by the client.
 */
export async function renderToReadableStream(
  element: LiquidNode,
  options?: RenderToReadableStreamOptions,
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const chunkSize = options?.progressiveChunkSize ?? 8192;

  return new ReadableStream({
    start(controller) {
      if (options?.signal?.aborted) {
        controller.close();
        return;
      }

      let html: string;
      try {
        html = renderToString(element);
      } catch (error) {
        options?.onError?.(error);
        controller.error(error);
        return;
      }

      // Enqueue in chunks for progressive streaming
      let offset = 0;
      while (offset < html.length) {
        const chunk = html.slice(offset, offset + chunkSize);
        controller.enqueue(encoder.encode(chunk));
        offset += chunkSize;
      }

      controller.close();
    },
  });
}
