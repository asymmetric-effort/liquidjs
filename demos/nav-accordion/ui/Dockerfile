FROM oven/bun:alpine AS build
WORKDIR /app

COPY core/src/ /specifyjs-core/src/
COPY components/ /specifyjs-components/

COPY demos/nav-accordion/ui/package.json ./
RUN bun install

COPY demos/nav-accordion/ui/ ./

RUN find . -name '*.ts' -exec sed -i 's|../../../../components/|/specifyjs-components/|g' {} + && \
    find /specifyjs-components -name '*.ts' -exec sed -i 's|../../../../core/src/|/specifyjs-core/src/|g' {} + && \
    find /specifyjs-components -name '*.ts' -exec sed -i 's|../../wrapper/src/|/specifyjs-components/nav/wrapper/src/|g' {} +

RUN echo 'import { defineConfig } from "vite"; export default defineConfig({ resolve: { alias: { "specifyjs/hooks": "/specifyjs-core/src/hooks/index.ts", "specifyjs/dom": "/specifyjs-core/src/dom/index.ts", "specifyjs": "/specifyjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
