import { createServer } from 'vite';

const server = await createServer({
  server: { port: 3000, strictPort: true, host: '127.0.0.1' },
});
await server.listen();
console.log('Server ready at http://127.0.0.1:3000');
