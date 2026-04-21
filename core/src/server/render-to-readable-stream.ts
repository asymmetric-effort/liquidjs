import type { LiquidNode } from '../shared/types';
import { renderToString } from './render-to-string';

export interface RenderToReadableStreamOptions {
  identifierPrefix?: string;
  signal?: AbortSignal;
  onError?: (error: unknown) => void;
}

/**
 * Renders a LiquidJS tree to a web ReadableStream.
 * Equivalent to ReactDOMServer.renderToReadableStream.
 */
export async function renderToReadableStream(
  element: LiquidNode,
  options?: RenderToReadableStreamOptions,
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      if (options?.signal?.aborted) {
        controller.close();
        return;
      }

      try {
        const html = renderToString(element);
        controller.enqueue(encoder.encode(html));
      } catch (error) {
        options?.onError?.(error);
        controller.error(error);
        return;
      }

      controller.close();
    },
  });
}
