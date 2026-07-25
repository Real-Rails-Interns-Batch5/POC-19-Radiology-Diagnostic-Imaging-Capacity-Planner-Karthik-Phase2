# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies strictly from package-lock.json
# Use npm ci only — do NOT fall back to npm install (that ignores the lockfile)
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_API_URL is NOT used — see next.config.ts rewrites() for the proxy pattern.
# BACKEND_URL is read by the /api route handler at runtime.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Public directory (static assets — no special ownership needed)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Leverage Next.js output file tracing for minimal runtime image
# https://nextjs.org/docs/advanced-features/output-file-tracing
# Requires: next.config output: "standalone"
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Use sh -c so $PORT is expanded by the shell at container startup.
# Render injects PORT as a runtime env var; Next.js standalone server.js reads it.
CMD ["sh", "-c", "node server.js"]
