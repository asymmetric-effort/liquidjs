FROM oven/bun:alpine AS build
WORKDIR /app
COPY core/src/ /liquidjs-core/src/
COPY demos/rest-api/ui/package.json ./
RUN bun install
COPY demos/rest-api/ui/ ./
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY demos/rest-api/ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
