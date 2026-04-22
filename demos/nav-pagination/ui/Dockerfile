FROM oven/bun:alpine AS build
WORKDIR /app

COPY core/src/ /liquidjs-core/src/
COPY components/ /liquidjs-components/

COPY demos/nav-pagination/ui/package.json ./
RUN bun install

COPY demos/nav-pagination/ui/ ./

RUN find . -name '*.ts' -exec sed -i 's|../../../../components/|/liquidjs-components/|g' {} + && \
    find /liquidjs-components -name '*.ts' -exec sed -i 's|../../../../core/src/|/liquidjs-core/src/|g' {} + && \
    find /liquidjs-components -name '*.ts' -exec sed -i 's|../../wrapper/src/|/liquidjs-components/nav/wrapper/src/|g' {} +

RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
