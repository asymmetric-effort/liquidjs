FROM oven/bun:alpine AS build
WORKDIR /app
COPY core/src/ /specifyjs-core/src/
COPY demos/protobuf-app/ui/package.json ./
RUN bun install
COPY demos/protobuf-app/ui/ ./
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "specifyjs/hooks": "/specifyjs-core/src/hooks/index.ts", "specifyjs/dom": "/specifyjs-core/src/dom/index.ts", "specifyjs": "/specifyjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY demos/protobuf-app/ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
