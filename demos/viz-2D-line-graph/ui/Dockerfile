FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /specifyjs-core/src/

# Copy component source
COPY components/viz/2D-line-graph/src/ /specifyjs-components/viz/2D-line-graph/src/

# Copy demo UI source
COPY demos/viz-2D-line-graph/ui/package.json ./
RUN bun install

COPY demos/viz-2D-line-graph/ui/ ./

# Fix component import paths for container build
RUN sed -i 's|../../../../core/src|/specifyjs-core/src|g' /specifyjs-components/viz/2D-line-graph/src/*.ts

# Write container-specific vite config
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "specifyjs/hooks": "/specifyjs-core/src/hooks/index.ts", "specifyjs/dom": "/specifyjs-core/src/dom/index.ts", "specifyjs": "/specifyjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
