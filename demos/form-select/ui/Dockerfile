FROM oven/bun:alpine AS build
WORKDIR /app

# Copy core framework source
COPY core/src/ /specifyjs-core/src/

# Copy form components source
COPY components/form/ /specifyjs-components/form/

# Copy demo UI source
COPY demos/form-select/ui/package.json ./
RUN bun install

COPY demos/form-select/ui/ ./

# Rewrite bare imports to absolute paths for the container build
RUN sed -i "s|from 'specifyjs/hooks'|from '/specifyjs-core/src/hooks/index.ts'|g" src/app.ts && \
    sed -i "s|from 'specifyjs/dom'|from '/specifyjs-core/src/dom/index.ts'|g" src/app.ts && \
    sed -i "s|from 'specifyjs'|from '/specifyjs-core/src/index.ts'|g" src/app.ts && \
    sed -i "s|from '../../../../components/form/select/src/index.ts'|from '/specifyjs-components/form/select/src/index.ts'|g" src/app.ts

# Inline vite config
RUN echo 'import { defineConfig } from "vite"; import path from "path"; export default defineConfig({ resolve: { alias: { "specifyjs/hooks": "/specifyjs-core/src/hooks/index.ts", "specifyjs/dom": "/specifyjs-core/src/dom/index.ts", "specifyjs": "/specifyjs-core/src/index.ts" } }, build: { outDir: "dist", minify: "esbuild" } });' > vite.config.js && rm -f vite.config.ts

RUN bun run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
