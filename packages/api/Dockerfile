FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY packages/api packages/api
WORKDIR /app/packages/api

RUN npm ci
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY packages/api/package*.json packages/api/
WORKDIR /app/packages/api
RUN npm ci --only=production

COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/src ./src
COPY --from=builder /app/packages/api/node_modules ./node_modules
COPY packages/api/tsconfig.json ./tsconfig.json

EXPOSE 3000

# Run from /app so that relative paths work correctly
WORKDIR /app
CMD ["node", "packages/api/dist/main.js"]
