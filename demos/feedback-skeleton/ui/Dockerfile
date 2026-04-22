FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /liquidjs-core/src/

# Copy component source
COPY components/feedback/skeleton/src/ /liquidjs-components/feedback/skeleton/src/

# Copy demo UI source
COPY demos/feedback-skeleton/ui/package.json ./
RUN bun install

COPY demos/feedback-skeleton/ui/ ./

# Fix component import paths for container build
RUN sed -i 's|../../../../core/src|/liquidjs-core/src|g' /liquidjs-components/feedback/skeleton/src/*.ts

# Write container-specific vite config
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
