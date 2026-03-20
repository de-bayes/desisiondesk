FROM node:22-alpine AS base

# Install deps
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL
ARG DIRECT_DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_DATABASE_URL=$DIRECT_DATABASE_URL
RUN npx prisma migrate deploy
RUN npm run build

# Run
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
