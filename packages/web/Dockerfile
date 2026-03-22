FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY packages/web packages/web
WORKDIR /app/packages/web

RUN npm ci
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/packages/web/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
