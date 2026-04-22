FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /liquidjs-core/src/

# Copy form components source
COPY components/form/ /liquidjs-components/form/

# Copy demo UI source
COPY demos/form-checkbox/ui/package.json ./
RUN bun install

COPY demos/form-checkbox/ui/ ./

# Rewrite bare imports to absolute paths for the container build
RUN sed -i "s|from 'liquidjs/hooks'|from '/liquidjs-core/src/hooks/index.ts'|g" src/app.ts && \
    sed -i "s|from 'liquidjs/dom'|from '/liquidjs-core/src/dom/index.ts'|g" src/app.ts && \
    sed -i "s|from 'liquidjs'|from '/liquidjs-core/src/index.ts'|g" src/app.ts && \
    sed -i "s|from '../../../../components/form/checkbox/src/index.ts'|from '/liquidjs-components/form/checkbox/src/index.ts'|g" src/app.ts

# Inline vite config
RUN echo 'import { defineConfig } from "vite"; import path from "path"; export default defineConfig({ resolve: { alias: { "liquidjs/hooks": "/liquidjs-core/src/hooks/index.ts", "liquidjs/dom": "/liquidjs-core/src/dom/index.ts", "liquidjs": "/liquidjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
