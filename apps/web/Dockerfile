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

# Railway injects project/service variables at build time
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG NEXT_PUBLIC_APP_URL
ARG RESEND_API_KEY
ARG NEXT_PUBLIC_RESEND_FROM
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_REGION
ARG S3_BUCKET
ENV DATABASE_URL=${DATABASE_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV NEXT_PUBLIC_RESEND_FROM=${NEXT_PUBLIC_RESEND_FROM}
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ENV S3_REGION=${S3_REGION}
ENV S3_BUCKET=${S3_BUCKET}

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
