# Firstroad Next.js app - Turborepo + Bun + standalone output
#
# Build args:
#   BUN_VARIANT=avx2    - Production (Railway, CI). Uses AVX2-optimized Bun. Default.
#   BUN_VARIANT=baseline - Local build on CPU without AVX.
#   DATABASE_URL        - Required for generateStaticParams at build time (Neon).
#
# Local (no AVX):  docker build -f apps/web/Dockerfile --build-arg BUN_VARIANT=baseline --build-arg DATABASE_URL=$NEON_URL .
# Production:      docker build -f apps/web/Dockerfile --build-arg DATABASE_URL=$NEON_URL .

ARG BUN_VERSION=1.3.9
ARG BUN_VARIANT=avx2

# Custom Bun install (avx2 or baseline) - oven/bun image is baseline-only
FROM debian:bookworm-slim AS bun-base
ARG BUN_VERSION
ARG BUN_VARIANT
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
    ca-certificates curl unzip \
    && rm -rf /var/lib/apt/lists/*
RUN case "${BUN_VARIANT}" in \
      baseline) build="x64-baseline";; \
      *) build="x64";; \
    esac \
    && case "${BUN_VERSION}" in \
      latest) release="latest/download";; \
      canary) release="latest/download";; \
      *) release="download/bun-v${BUN_VERSION}";; \
    esac \
    && curl -fsSL "https://github.com/oven-sh/bun/releases/${release}/bun-linux-${build}.zip" -o bun.zip \
    && unzip bun.zip \
    && mv bun-linux-${build}/bun /usr/local/bin/bun \
    && chmod +x /usr/local/bin/bun \
    && rm -rf bun.zip bun-linux-${build}
WORKDIR /app

# ---
FROM bun-base AS builder
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy package manifests first for install layer cache
COPY package.json bun.lock* turbo.json* ./
COPY apps ./apps
COPY packages ./packages
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ---
FROM debian:bookworm-slim AS runner
RUN apt-get update -qq && apt-get install -qq --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --gid 1001 nextjs
USER nextjs

COPY --from=builder /usr/local/bin/bun /usr/local/bin/bun
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["bun", "run", "apps/web/server.js"]
