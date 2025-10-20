# Vercel Manual Deployment Guide

This project is configured to **disable automatic deployments** on git push. Use the Vercel CLI for manual, controlled deployments.

## Configuration

The `vercel.json` file disables automatic deployments:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

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
```bash
vercel link
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

### Prebuilt Deployment (Local Build)
```bash
# 1. Build locally
vercel build --prod

# 2. Deploy the prebuilt output
vercel deploy --prebuilt --prod
```

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

