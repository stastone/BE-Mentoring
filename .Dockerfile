FROM node:20-alpine AS builder
WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY server.ts ./
COPY src ./src

RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY --from=builder /build/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
