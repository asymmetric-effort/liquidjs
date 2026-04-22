FROM oven/bun:alpine AS build
WORKDIR /app
COPY core/src/ /liquidjs-core/src/
COPY components/ /liquidjs-components/
COPY demos/hypercube-app/ui/package.json ./
RUN bun install
COPY demos/hypercube-app/ui/ ./
RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts
# Fix all imports to point to container paths
RUN find /liquidjs-components -name '*.ts' -exec sed -i "s|../../../../core/src/|/liquidjs-core/src/|g" {} + 2>/dev/null; \
    sed -i "s|../../../../components/|/liquidjs-components/|g" src/app.ts
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY demos/hypercube-app/ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
