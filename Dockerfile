# Build stage
FROM node:21-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci --only=production=false

COPY . .

RUN npm run build

# Production stage
FROM node:21-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
