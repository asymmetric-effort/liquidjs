/**
 * Combined dev server for all example apps.
 * Serves each app at a different path:
 *   /todo    -> Todo App
 *   /counter -> Counter App
 *   /form    -> Form App
 */
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const server = await createServer({
    root: path.resolve(__dirname, '..'),
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        'specifyjs': path.resolve(__dirname, '../src/index.ts'),
        'specifyjs/dom': path.resolve(__dirname, '../src/dom/index.ts'),
      },
    },
  });

  await server.listen();
  console.log('Dev server running at http://localhost:3000');
  console.log('  /examples/todo-app/     -> Todo App');
  console.log('  /examples/counter-app/  -> Counter App');
  console.log('  /examples/form-app/     -> Form App');
}

startServer();
