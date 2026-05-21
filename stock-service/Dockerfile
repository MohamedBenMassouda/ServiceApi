# Build context must be the repo root so proto/ is accessible.
# WORKDIR is /app/stock-service so that resolve(cwd, '..', 'proto', 'stock.proto')
# resolves to /app/proto/stock.proto at both build and runtime.
FROM node:20 AS builder
WORKDIR /app/stock-service
RUN npm install -g pnpm
COPY stock-service/package.json ./
RUN pnpm install --shamefully-hoist
COPY stock-service/tsconfig.json stock-service/nest-cli.json ./
COPY stock-service/src/ ./src/
COPY proto/ /app/proto/
RUN pnpm run build

FROM node:20-slim
WORKDIR /app/stock-service
COPY --from=builder /app/stock-service/node_modules ./node_modules
COPY --from=builder /app/stock-service/dist ./dist
COPY --from=builder /app/proto /app/proto
CMD ["node", "dist/main.js"]
