# Vercel Manual Deployment Guide

This project is configured to **disable automatic deployments** on git push. Use the Vercel CLI for manual, controlled deployments.

## Configuration

The `vercel.json` file in `apps/web` disables automatic deployments and sets the build command for the Turborepo + Prisma monorepo:

- **Root Directory**: In the Vercel project settings, set **Root Directory** to `apps/web` so Vercel runs the build from the web app directory.
- **Build command** (in `apps/web/vercel.json`): `cd ../.. && bunx turbo run build --filter=@firstroad/web` — runs from repo root so Turbo can run `db:generate` in `packages/database` before building the Next.js app.

Ensure `DATABASE_URL` is set in the Vercel project’s environment variables (Production and Preview as needed).

### Local production builds and env vars
When you run `vercel build --prod` locally, the build is not on Vercel, so Vercel's project environment variables are not injected (you'll see: "Build not running on Vercel. System environment variables will not be available"). To use production-like values for that local build, add **`.env.production`** in `apps/web/`. Next.js loads it when `NODE_ENV=production` and it overrides `.env` for the same keys. You do not need to rename `.env` to `.env.local`. Keep `.env` for dev defaults and put production-only values (e.g. production `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, secrets) in `.env.production`; both are gitignored via `.env*`.

## Setup Vercel CLI

### Install Vercel CLI Globally
```bash
bun install -g vercel
# or
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Link Project (First Time Only)
Run from **`apps/web`** so the CLI links this directory as the project root. In the Vercel dashboard, set **Root Directory** to `apps/web` (Settings → General → Root Directory). This is required for `vercel build` and prebuilt deploys to detect Next.js correctly in the monorepo.
```bash
cd apps/web && vercel link
```

## Deployment Commands

### 1. Preview Deployment (Staging)
Deploy to a preview URL without affecting production:
```bash
vercel
# or explicitly:
vercel deploy
```

**What happens:**
- Creates a unique preview URL: `project-name-<hash>-<scope>.vercel.app`
- Does NOT affect production
- Perfect for testing before going live

### 2. Production Deployment
Deploy directly to production domain:
```bash
vercel --prod
```

**What happens:**
- Deploys to your production domain
- Becomes the live site immediately
- Assigns all production domains

### 3. Staged Production Deployment
Create a production build WITHOUT assigning domains:
```bash
vercel --prod --skip-domain
```

**What happens:**
- Builds for production environment
- Does NOT become live
- Can be promoted later with `vercel promote`

### 4. Promote Staged Deployment
Make a staged deployment live:
```bash
vercel promote <deployment-url>
```

**Example:**
```bash
vercel promote https://project-abc123.vercel.app
```

## Advanced Options

### Force New Build (Skip Cache)
```bash
vercel --force
# or for production:
vercel --prod --force
```

### Deploy with Build Logs
```bash
vercel --logs
```

### Deploy Without Waiting
```bash
vercel --no-wait
```

### Production deploy from CLI
From repo root:
```bash
bun run deploy:prod
```

This runs **`cd apps/web && vercel deploy --prod`**: source is uploaded and **Vercel builds on their side** using Root Directory `apps/web` and the `buildCommand` in `vercel.json`. No local build; Next.js is detected correctly.

Manual: `cd apps/web && vercel deploy --prod`

### Prebuilt deployment (optional)
Prebuilt uses **`vercel build`** locally then **`vercel deploy --prebuilt`**. In monorepos the CLI can fail to detect Next.js when running `vercel build` locally; the standard deploy above avoids that. If you need prebuilt: from `apps/web`, run `vercel build --prod` then `vercel deploy --prebuilt --archive=tgz --prod`. See [Build Output API](https://vercel.com/docs/build-output-api/v3).

<details>
<summary>Previous prebuilt details</summary>

- **`vercel build --prod`** runs your `vercel.json` build command (`cd ../.. && bunx turbo run build --filter=@firstroad/web`), then produces `.vercel/output` in `apps/web`.
- **`vercel deploy --prebuilt --archive=tgz`** uploads that output as a single archive. Using `--prebuilt` avoids the CLI walking `node_modules` (which with Bun’s layout can cause ENOENT errors e.g. for `@opentelemetry/api` when archiving from the app directory).

Manual equivalent from `apps/web`:
```bash
# 1. Build (uses buildCommand from vercel.json; creates .vercel/output)
vercel build --prod

# 2. Deploy the prebuilt output (optionally with archive to reduce file count)
vercel deploy --prebuilt --archive=tgz --prod
```
</details>

## Workflow Recommendations

### For Feature Development
```bash
# 1. Work on feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub (no deployment triggered)
git push origin feature/new-feature

# 4. Deploy preview for testing
vercel

# 5. Share preview URL with team
```

### For Production Releases
```bash
# 1. Merge to main
git checkout main
git merge feature/new-feature

# 2. Push to GitHub (no deployment triggered)
git push origin main

# 3. Create staged production build
vercel --prod --skip-domain

# 4. Test the deployment URL

# 5. Promote to production when ready
vercel promote <deployment-url>
```

### Quick Production Deploy
```bash
# Deploy directly to production (use with caution)
vercel --prod
```

## Benefits of Manual Deployments

1. ✅ **Cost Savings** - No unnecessary builds for WIP commits
2. ✅ **Control** - Deploy only when ready
3. ✅ **Testing** - Preview deployments before going live
4. ✅ **Flexibility** - Stage, test, then promote
5. ✅ **Efficiency** - Multiple commits, one deployment

## Checking Deployments

### List All Deployments
```bash
vercel list
```

### Inspect a Deployment
```bash
vercel inspect <deployment-url>
```

### View Build Logs
```bash
vercel inspect <deployment-url> --logs
```

## Alternative: Selective Auto-Deploy

If you want automatic deployments only for specific branches:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,      // Auto-deploy main branch
      "dev": false,      // Don't deploy dev branch
      "feature/*": false // Don't deploy feature branches
    }
  }
}
```

## Troubleshooting

### Build Failures
```bash
# Force rebuild without cache
vercel --force

# View detailed logs
vercel inspect <url> --logs --wait
```

### Environment Variables
```bash
# Deploy with custom build env vars
vercel --build-env KEY=value
```

## References

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Git Configuration](https://vercel.com/docs/project-configuration/git-configuration)
- [Deployment Overview](https://vercel.com/docs/deployments)

