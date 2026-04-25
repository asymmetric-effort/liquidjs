FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /specifyjs-core/src/

# Copy components
COPY components/ /specifyjs-components/

# Copy demo UI source
COPY demos/layout-tabs/ui/package.json ./
RUN bun install

COPY demos/layout-tabs/ui/ ./

# Fix component imports to use absolute container paths
RUN sed -i 's|../../../../components/|/specifyjs-components/|g' src/app.ts

# Write container-specific vite config using JS
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "specifyjs/hooks": "/specifyjs-core/src/hooks/index.ts", "specifyjs/dom": "/specifyjs-core/src/dom/index.ts", "specifyjs": "/specifyjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
