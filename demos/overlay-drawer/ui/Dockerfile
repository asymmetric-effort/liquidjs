FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /liquidjs-core/src/

# Copy component source
COPY components/overlay/drawer/ /components/overlay/drawer/

# Copy demo UI source
COPY demos/overlay-drawer/ui/package.json ./
RUN bun install

COPY demos/overlay-drawer/ui/ ./

# Fix component imports to use absolute container paths
RUN sed -i "s|../../../../core/src|/liquidjs-core/src|g" /components/overlay/drawer/src/*.ts

# Write container-specific vite config
RUN echo 'import { defineConfig } from "vite"; import path from "path"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
