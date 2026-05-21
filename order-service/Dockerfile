# Build context must be the repo root so proto/ is accessible.
# WORKDIR is /app/order-service so that resolve(cwd, '..', 'proto', 'stock.proto')
# resolves to /app/proto/stock.proto at both build and runtime.
FROM node:20 AS builder
WORKDIR /app/order-service
RUN npm install -g pnpm
COPY order-service/package.json ./
RUN pnpm install --shamefully-hoist
COPY order-service/tsconfig.json order-service/nest-cli.json ./
COPY order-service/src/ ./src/
COPY proto/ /app/proto/
RUN pnpm run build

FROM node:20-slim
WORKDIR /app/order-service
COPY --from=builder /app/order-service/node_modules ./node_modules
COPY --from=builder /app/order-service/dist ./dist
COPY --from=builder /app/proto /app/proto
CMD ["node", "dist/main.js"]
