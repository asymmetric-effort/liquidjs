import type { LiquidNode } from '../shared/types';

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
  _element: LiquidNode,
  _options?: RenderToReadableStreamOptions,
): Promise<ReadableStream<Uint8Array>> {
  // TODO: implement web stream server renderer
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}
