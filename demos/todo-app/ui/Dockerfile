FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /specifyjs-core/src/

# Copy demo UI source
COPY demos/todo-app/ui/package.json ./
RUN bun install

COPY demos/todo-app/ui/ ./

# Write container-specific vite config using JS (not TS) to avoid issues
RUN echo 'import { defineConfig } from "vite"; import path from "path"; export default defineConfig({ resolve: { alias: { "specifyjs/hooks": "/specifyjs-core/src/hooks/index.ts", "specifyjs/dom": "/specifyjs-core/src/dom/index.ts", "specifyjs": "/specifyjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY demos/todo-app/ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
