FROM node:20 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install --shamefully-hoist
COPY tsconfig.json nest-cli.json ./
COPY src/ ./src/
RUN pnpm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
