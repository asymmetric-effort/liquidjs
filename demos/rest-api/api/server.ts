// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * REST API Demo Server — Bookmarks CRUD
 * Zero dependencies, uses Node.js built-in http module.
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';

// ── Types ─────────────────────────────────────────────────────────────

interface Bookmark {
  id: number;
  title: string;
  url: string;
  tags: string[];
}

// ── In-memory store ───────────────────────────────────────────────────

let nextId = 4;
const bookmarks: Map<number, Bookmark> = new Map([
  [1, { id: 1, title: 'SpecifyJS Docs', url: 'https://specifyjs.asymmetric-effort.com', tags: ['docs', 'framework'] }],
  [2, { id: 2, title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', tags: ['typescript', 'docs'] }],
  [3, { id: 3, title: 'MDN Web Docs', url: 'https://developer.mozilla.org', tags: ['reference', 'web'] }],
]);

// ── Helpers ───────────────────────────────────────────────────────────

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, data: unknown): void {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function cors(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function extractId(url: string): number | null {
  const match = url.match(/^\/api\/bookmarks\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// ── Request handler ───────────────────────────────────────────────────

async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  cors(res);
  const method = req.method ?? 'GET';
  const url = req.url ?? '/';

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (url === '/api/health') {
    json(res, 200, { status: 'ok' });
    return;
  }

  // GET /api/bookmarks
  if (url === '/api/bookmarks' && method === 'GET') {
    json(res, 200, Array.from(bookmarks.values()));
    return;
  }

  // POST /api/bookmarks
  if (url === '/api/bookmarks' && method === 'POST') {
    const body = await readBody(req);
    const data = JSON.parse(body) as Partial<Bookmark>;
    if (!data.title || !data.url) {
      json(res, 400, { error: 'title and url are required' });
      return;
    }
    const bookmark: Bookmark = {
      id: nextId++,
      title: data.title,
      url: data.url,
      tags: data.tags ?? [],
    };
    bookmarks.set(bookmark.id, bookmark);
    json(res, 201, bookmark);
    return;
  }

  // Single bookmark operations
  const id = extractId(url);
  if (id !== null) {
    const bookmark = bookmarks.get(id);

    if (method === 'GET') {
      if (!bookmark) { json(res, 404, { error: 'not found' }); return; }
      json(res, 200, bookmark);
      return;
    }

    if (method === 'PUT') {
      if (!bookmark) { json(res, 404, { error: 'not found' }); return; }
      const body = await readBody(req);
      const data = JSON.parse(body) as Partial<Bookmark>;
      const updated: Bookmark = {
        ...bookmark,
        title: data.title ?? bookmark.title,
        url: data.url ?? bookmark.url,
        tags: data.tags ?? bookmark.tags,
      };
      bookmarks.set(id, updated);
      json(res, 200, updated);
      return;
    }

    if (method === 'DELETE') {
      if (!bookmarks.delete(id)) { json(res, 404, { error: 'not found' }); return; }
      json(res, 200, { deleted: true });
      return;
    }
  }

  json(res, 404, { error: 'not found' });
}

// ── Start server ──────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '4001', 10);
const server = createServer((req, res) => {
  handler(req, res).catch((err) => {
    json(res, 500, { error: String(err) });
  });
});

server.listen(PORT, () => {
  console.log(`REST API server listening on http://localhost:${PORT}`);
});
