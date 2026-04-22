FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /liquidjs-core/src/

# Copy components
COPY components/ /liquidjs-components/

# Copy demo UI source
COPY demos/layout-grid/ui/package.json ./
RUN bun install

COPY demos/layout-grid/ui/ ./

# Fix component imports to use absolute container paths
RUN sed -i 's|../../../../components/|/liquidjs-components/|g' src/app.ts

# Write container-specific vite config using JS
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
