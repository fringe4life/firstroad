# Docker Setup & Deployment Guide

This document covers local development with Docker, the database adapter strategy, and production deployment for the firstroad project.

## Table of Contents

- [Benefits of This Setup](#benefits-of-this-setup)
- [Local Development](#local-development)
- [Database Strategy: Dev vs Prod](#database-strategy-dev-vs-prod)
- [Prisma Environment Files](#prisma-environment-files)
- [Inngest: Dev vs Prod](#inngest-dev-vs-prod)
- [Production Deployment](#production-deployment)
- [Railway Deployment](#railway-deployment)
- [Troubleshooting](#troubleshooting)

---

## Benefits of This Setup

| Benefit | Description |
|---------|-------------|
| **Consistent dev environment** | Postgres 15 and Inngest run in containers; everyone gets the same versions |
| **Isolation** | Services run in containers instead of polluting the host system |
| **Local dev without cloud limits** | Docker Postgres avoids Neon free-tier limits during development |
| **Production parity** | Same Postgres version as production; Inngest Dev Server mirrors prod behavior |
| **Simple onboarding** | One command to start services: `docker compose up -d postgres inngest` |
| **Data persistence** | Postgres data in a Docker volume survives container restarts |
| **Portability** | Same setup works on Linux, macOS, and Windows (with Docker) |

---

## Local Development

### Prerequisites

- Docker and Docker Compose (or `docker compose` as a plugin)
- Bun
- Git

### 1. Start Docker services

```bash
docker compose up -d postgres inngest
```

This starts:

- **Postgres** on port 5432 (`postgresql://postgres:postgres@localhost:5432/firstroad`)
- **Inngest Dev Server** on port 8288 (UI at http://localhost:8288)

### 2. Configure environment

**`apps/web/.env.local`** (for the Next.js app):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/firstroad"
INNGEST_DEV=1
# ... other vars from apps/web/env.example
```

**`packages/database/.env.local`** (for Prisma CLI commands):

```bash
cp packages/database/env.example packages/database/.env.local
# Default is already Docker Postgres URL
```

### 3. Run migrations and seed

```bash
cd packages/database && bun run db:migrate:local
cd packages/database && bun run db:seed:local
```

### 4. Start the dev server

Because Inngest runs in Docker, run only the web app to avoid port 8288 conflicts:

```bash
bun run dev --filter=@firstroad/web
```

Or add a `dev:web` script to root `package.json` if preferred.

### 5. Access the app

- App: http://localhost:3000
- Inngest Dev Server UI: http://localhost:8288

---

## Database Strategy: Dev vs Prod

| Context | Database | Purpose |
|---------|----------|---------|
| **Local dev** | Docker Postgres | `bun run dev` connects to `localhost:5432`; avoids Neon free-tier limits |
| **Docker build** | Neon (build arg) | `generateStaticParams` in `tickets/[slug]/page.tsx` needs DB at build time |
| **Production runtime** | Neon | Container receives Neon `DATABASE_URL` at runtime |

### Prisma adapter selection

The app uses **conditional adapters** based on `DATABASE_URL`:

| `DATABASE_URL` contains | Adapter | Use case |
|-------------------------|---------|----------|
| `neon.tech` | `PrismaNeon` | Neon serverless HTTP/WebSocket |
| Anything else (e.g. `localhost`) | `PrismaPg` | Standard TCP (local Docker Postgres) |

See `packages/database/src/adapter.ts` and `packages/database/src/client.ts`.

---

## Prisma Environment Files

Prisma lives in `packages/database` and uses its own env files (not `apps/web/.env.local`).

| File | Purpose |
|------|---------|
| `.env` | Production/Neon (used by `db:migrate`, `db:deploy`, `db:seed`) |
| `.env.local` | Local Docker Postgres (used by `db:migrate:local`, `db:push:local`, `db:seed:local`) |

### Scripts

| Command | Env file | Use case |
|---------|----------|----------|
| `bun run db:migrate` | `.env` | Production/Neon |
| `bun run db:migrate:local` | `.env.local` | Local Docker |
| `bun run db:push` | `.env` | Push schema (prod) |
| `bun run db:push:local` | `.env.local` | Push schema (local) |
| `bun run db:seed` | `.env` | Seed (prod) |
| `bun run db:seed:local` | `.env.local` | Seed (local) |

### Syncing data from Neon to local

Neon allows `pg_dump` on all plans (including free). To seed local from Neon:

```bash
# 1. Dump from Neon (use unpooled connection string)
pg_dump -Fc -v -d "YOUR_NEON_UNPOOLED_URL" -f neon-backup.dump

# 2. Restore to local
pg_restore -v -d "postgresql://postgres:postgres@localhost:5432/firstroad" --clean --if-exists neon-backup.dump
```

---

## Inngest: Dev vs Prod

| Context | Inngest Server | App env vars |
|---------|----------------|--------------|
| **Dev (app on host)** | `inngest/inngest` container with `-u http://host.docker.internal:3000/api/inngest` | `INNGEST_DEV=1`, `INNGEST_BASE_URL=http://localhost:8288` |
| **Dev (app in Docker)** | `inngest/inngest` with `-u http://web:3000/api/inngest` | `INNGEST_DEV=1`, `INNGEST_BASE_URL=http://inngest:8288` |
| **Prod** | Inngest Cloud (no container) | `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`; do **not** set `INNGEST_DEV` |

---

## Production Deployment

### Build the image

```bash
docker build -f apps/web/Dockerfile \
  --build-arg DATABASE_URL="$NEON_DATABASE_URL" \
  -t firstroad-web .
```

`--build-arg DATABASE_URL` is required because `generateStaticParams` connects to the database at build time.

### Run the container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="$NEON_DATABASE_URL" \
  -e BETTER_AUTH_SECRET="..." \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  -e RESEND_API_KEY="..." \
  -e NEXT_PUBLIC_RESEND_FROM="..." \
  -e GITHUB_CLIENT_ID="..." \
  -e GITHUB_CLIENT_SECRET="..." \
  -e S3_ACCESS_KEY_ID="..." \
  -e S3_SECRET_ACCESS_KEY="..." \
  -e S3_REGION="..." \
  -e S3_BUCKET="..." \
  -e INNGEST_SIGNING_KEY="..." \
  -e INNGEST_EVENT_KEY="..." \
  firstroad-web
```

Or use an env file:

```bash
docker run -p 3000:3000 --env-file .env.production firstroad-web
```

### Production differences

| Aspect | Dev | Prod |
|--------|-----|------|
| **Database** | Local Postgres in Docker | Neon (or hosted Postgres) |
| **Inngest** | Inngest Dev Server in Docker | Inngest Cloud |
| **App** | `bun run dev` on host | Container runs `bun run apps/web/server.js` |
| **Env** | `INNGEST_DEV=1` | `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY` |

### Where to deploy

- **VPS** (DigitalOcean, Linode, etc.): `docker run` or `docker compose`
- **Railway / Render / Fly.io**: Connect repo, set env vars, they build and run the image
- **AWS ECS / Fargate**: Push image to ECR, run as a service
- **Google Cloud Run**: Push to Artifact Registry, deploy as a service
- **Kubernetes**: Deploy the image as a Deployment/Service

---

## Railway Deployment

The Dockerfile uses **AVX2-optimized Bun** by default (`BUN_VARIANT=avx2`), which runs faster on Railway's build and runtime infrastructure.

### 1. Connect your repository

1. Go to [Railway](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your firstroad repository
3. Railway will detect the Dockerfile via `railway.json` (which points to `apps/web/Dockerfile`)

### 2. Configure the service

**Root Directory**: Leave empty (default). The build context must be the repo root for Turborepo.

**Service variables** (Settings → Variables): Add all required env vars. Railway passes these to the build and runtime. For the build, `DATABASE_URL` is required (Neon URL for `generateStaticParams`).

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Neon URL. Used at build time and runtime. |
| `BETTER_AUTH_SECRET` | Yes | |
| `NEXT_PUBLIC_APP_URL` | Yes | e.g. `https://your-app.up.railway.app` |
| `RESEND_API_KEY` | Yes | |
| `NEXT_PUBLIC_RESEND_FROM` | Yes | |
| `GITHUB_CLIENT_ID` | Yes | |
| `GITHUB_CLIENT_SECRET` | Yes | |
| `S3_ACCESS_KEY_ID` | Yes | |
| `S3_SECRET_ACCESS_KEY` | Yes | |
| `S3_REGION` | Yes | |
| `S3_BUCKET` | Yes | |
| `INNGEST_SIGNING_KEY` | Yes | From Inngest Cloud dashboard |
| `INNGEST_EVENT_KEY` | Yes | From Inngest Cloud dashboard |

**Optional**: `RAILWAY_DOCKERFILE_PATH=apps/web/Dockerfile` — only needed if `railway.json` is not used.

### 3. Deploy

Push to your connected branch. Railway will:

1. Build using `apps/web/Dockerfile` with the repo root as context
2. Use AVX2 Bun (default `BUN_VARIANT=avx2`)
3. Pass `DATABASE_URL` and other variables as build args and runtime env
4. Deploy the container

### 4. Custom domain (optional)

In the service → **Settings** → **Networking** → add a custom domain. Update `NEXT_PUBLIC_APP_URL` and Better Auth callback URLs accordingly.

### 5. Migrations

Run migrations before or after deploy:

```bash
cd packages/database && DATABASE_URL="$NEON_URL" bun run db:deploy
```

Or use Railway's **Pre-deploy command** (if supported) or a one-off job.

### Migrations

Run migrations before or when starting the app:

```bash
cd packages/database && bun run db:deploy
```

Or add an entrypoint script that runs migrations before `server.js`.

---

## Troubleshooting

### `docker-compose: command not found`

Use `docker compose` (with a space) instead of `docker-compose`. Docker Compose V2 is a plugin.

### `Unit docker.service not found`

Docker daemon may not be installed. On Fedora, install Docker Engine:

```bash
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

### `address already in use` (port 8288)

Both Docker Inngest and `apps/inngest` (from `bun run dev`) try to bind to 8288. Use:

```bash
bun run dev --filter=@firstroad/web
```

to run only the web app when using Docker Inngest.

### `NeonDbError` / `ConnectionRefused` with local Postgres

The app was using `PrismaNeon` for all connections. It now uses `PrismaPg` when `DATABASE_URL` does not contain `neon.tech`. Ensure `apps/web/.env.local` has:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/firstroad"
```

### `database "dummy"` or `User was denied access`

Prisma in `packages/database` uses its own `.env` or `.env.local`. Ensure `packages/database/.env.local` exists with the correct `DATABASE_URL`, or use the `:local` scripts which load `.env.local` automatically.

### `host.docker.internal` not resolving (Linux)

The `docker-compose.yml` includes `extra_hosts: host.docker.internal:host-gateway` for Linux. If Inngest cannot reach the app, verify this is present.
