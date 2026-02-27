# Firstroad Next.js app - Turborepo + Bun + standalone output
#
# Copies full monorepo (no turbo prune). transpilePackages bundles @firstroad/*; standalone at /app.
# Railway injects project/service variables automatically as build args.
#
# Local: docker build -f apps/web/Dockerfile . -t firstroad-web

FROM oven/bun:alpine AS base

# Step 1 - Install dependencies (full monorepo)
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock* turbo.json* ./
COPY apps ./apps
COPY packages ./packages
RUN bun install --frozen-lockfile

# Step 2 - Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages
COPY package.json bun.lock* turbo.json* ./

# Railway injects project/service variables at build time. Only non-secret values
# should be passed as build args; runtime secrets are supplied as container envs.

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_RESEND_FROM
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_RESEND_FROM=${NEXT_PUBLIC_RESEND_FROM}

COPY . .
RUN bun run build

# Step 3 - Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# HOSTNAME=0.0.0.0 required for container to accept external connections
# PORT: Railway injects PORT=8080 at runtime; do not hardcode
ENV HOSTNAME="0.0.0.0"

# Monorepo standalone: server.js is at apps/web/ (see vercel/next.js#78446)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 8080
CMD ["bun", "apps/web/server.js"]
