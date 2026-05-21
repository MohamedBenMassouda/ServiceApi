FROM node:20 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install --shamefully-hoist
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
