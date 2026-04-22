FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /liquidjs-core/src/

# Copy component source
COPY components/data/tag/src/ /liquidjs-components/data/tag/src/

# Copy demo UI source
COPY demos/data-tag/ui/package.json ./
RUN bun install

COPY demos/data-tag/ui/ ./

# Fix component imports to use absolute container paths
RUN sed -i "s|../../../../components/data/tag/src/index|/liquidjs-components/data/tag/src/index|g" src/app.ts
RUN sed -i "s|../../../../core/src/index|/liquidjs-core/src/index|g" /liquidjs-components/data/tag/src/*.ts
RUN sed -i "s|../../../../core/src/hooks/index|/liquidjs-core/src/hooks/index|g" /liquidjs-components/data/tag/src/*.ts

# Write container-specific vite config using JS (not TS) to avoid issues
RUN echo 'import { defineConfig } from "vite"; import path from "path"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
