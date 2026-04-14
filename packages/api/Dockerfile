FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY packages/api packages/api

RUN npm ci
RUN cd packages/api && npm ci

RUN cd packages/api && npm run build

RUN cd packages/api && npm ci --omit=dev

EXPOSE 3000

WORKDIR /app/packages/api

CMD ["node", "dist/main.js"]
