# First Ticket - A Collaborative Ticket Management Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-8.0.0--rc.13-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.7.3-000000)](https://better-auth.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Biome](https://img.shields.io/badge/Biome-2.5.12-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)
[![nuqs](https://img.shields.io/badge/nuqs-2.10.1-000000)](https://nuqs.47ng.com/)
[![Valibot](https://img.shields.io/badge/Valibot-1.4.2-3E67B1?logo=valibot&logoColor=white)](https://valibot.dev/)
[![Elysia](https://img.shields.io/badge/Elysia-1.4.30-000000)](https://elysiajs.com/)
[![Inngest](https://img.shields.io/badge/Inngest-4.20.0-000000)](https://www.inngest.com/)
[![Resend](https://img.shields.io/badge/Resend-6.26.0-000000)](https://resend.com/)
[![Bun](https://img.shields.io/badge/Bun-1.4.2-FBF0DF?logo=bun&logoColor=FBF0DF)](https://bun.sh/)
[![Ultracite](https://img.shields.io/badge/Ultracite-7.11.0-000000)](https://ultracite.dev/)

</div>

A full-stack collaborative platform built with Next.js 16, featuring authentication, real-time updates, and a modern UI. Users can create, manage, and track tickets with comments and collaboration features.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Better Auth (email/password + OTP + GitHub OAuth) with email enumeration protection
- **🏢 Organization Management**: Create and manage organizations with membership and invitation systems, role-based access control (owner, admin, member), granular `MemberPermission` flags (`canCreate` / `canUpdate` / `canDelete` per TICKET and COMMENT), and admin tabs for managing members and invitations
- **🎫 Ticket Management**: Create, edit, and manage tickets with status tracking
- **🔗 Referenced Tickets**: Link tickets via `TicketReference` join table (shown on ticket detail)
- **📎 Ticket Attachments**: Owner-only file uploads with Bun S3, image previews before upload, and owner-only delete actions; presigned download URLs for all viewers (`Bun.s3` requires Bun — local `bun run dev` / Docker; this repo sets `bunVersion` in `apps/web/vercel.json` so Vercel builds run on Bun)
- **💬 Comments System**: Add, edit, and delete comments on tickets with infinite pagination and owner-only attachments
- **🌙 Dark Mode**: Beautiful light/dark theme with smooth transitions
- **📱 Responsive Design**: Optimized for desktop and mobile devices with PPR navigation and cached components
- **⚡ Real-time Updates**: Server-side rendering with React Suspense and PPR dynamic holes
- **🔍 Search & Filter**: Advanced search and filtering capabilities
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📊 Infinite Pagination**: Efficient cursor-based pagination for comments
- **🔒 Ownership System**: Users can only edit their own tickets and comments
- **🎯 Type Safety**: Full TypeScript support with typed routes
- **📧 Email Features**: Password reset, email verification, OTP authentication, and welcome emails with Resend templates
- **🔗 Slug Generation**: Human-readable URLs via shared `createSlug` in `@firstroad/utils` (packages/utils)
- **🔄 Parallel Routes**: Next.js parallel routes (@auth) for authentication modals with interception routes
- **⚡ React Compiler**: React 19 compiler for automatic performance optimization
- **📬 Background Jobs**: Inngest for async event handling and email processing
- **⚡ PPR Navigation**: Partial Prerendering with dynamic auth components
- **🔐 Session Management**: Cookie-based session caching with defensive expiration checks
- **🔗 Slug-based Routing**: Human-readable URLs using ticket slugs instead of IDs
- **📱 Responsive Controls**: Desktop button groups and mobile dropdowns for ticket filtering

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3 (App Router) with Turbopack
- **Language**: TypeScript 7.0 with strict type checking
- **Database**: PostgreSQL with Prisma 8 (`@prisma/orm-postgres`, contract in `packages/database/src/prisma/contract.prisma`; Neon or `pg` pool)
- **Authentication**: Better Auth 1.7.3 with email/password provider, `pg` pool, uuidv7 IDs, and session cookie caching
- **Styling**: Tailwind CSS v4.3 with shadcn/ui components and Tailwind v4 PostCSS pipeline
- **Icons**: Lucide React
- **Forms**: React `useActionState` + Server Actions with Valibot validation; `useActionStateWithFeedback` hook and `withActionFeedback` server wrapper for toast/error handling
- **Notifications**: Sonner toast notifications
- **Theme**: next-themes for dark/light mode
- **URL Search Params**: nuqs 2.10 for type-safe URL parameters
- **Email**: Resend 6.26 published templates for transactional emails
- **API Framework**: Elysia 1.4 with @elysiajs/cors for unified API routes
- **Background Jobs**: Inngest 4.20 for background tasks and event handling (Docker Dev Server locally)
- **Package Manager**: Bun (recommended)
- **Shared Utilities**: `@firstroad/utils` (packages/utils) for shared helpers (e.g. `createSlug`)
- **Linting**: Biome 2.5.12 for fast formatting and linting with Ultracite 7.11 rules
- **Type Checking**: TypeScript 7 (`useTypeScriptCli` in Next.js)
- **React Compiler**: React 19 compiler (`reactCompiler` + `turbopackRustReactCompiler`)

## ⚡ Next.js 16 Modern Features
  
This project leverages cutting-edge Next.js 16 features for optimal performance and developer experience:
  
### Core Features
  
- **Typed Routes**: Full type safety for all routes (`typedRoutes: true`)
- **Turbopack**: Fast bundling for development and production
- **React Compiler**: React 19 compiler for automatic performance optimization
- **Cache Components**: Function-level caching with `cacheComponents: true`
- **Parallel Routes**: Authentication modals with interception routes (`@auth`)
- **Interception Routes**: Modal overlays with graceful fallback on hard refresh
- **Experimental features** (see `apps/web/next.config.ts`):
  - `mcpServer`: Model Context Protocol server support
  - `typedEnv`: Type-safe environment variables
  - `useTypeScriptCli`: TypeScript 7 CLI for type checking
  - `optimizePackageImports`: tree-shake `valibot`
  - `serverActions.bodySizeLimit`: larger multipart payloads (attachments)
  - `turbopackFileSystemCacheForDev` / `turbopackFileSystemCacheForBuild`: faster Turbopack caches
  - `turbopackRustReactCompiler`: React Compiler via Turbopack
  - `partialPrefetching`: partial prefetch for navigations
  - `logging.browserToTerminal`: browser logs in the terminal during dev
  
### Cache Components & PPR
  
- **"use cache" Directive**: Function-level caching for data queries and static components
- **PPR (Partial Prerendering)**: Static shell with dynamic holes for optimal performance
- **Slug-based Routing**: Human-readable URLs with automatic slug generation
- **Type-safe Search Parameters**: [nuqs](https://nuqs.47ng.com/) integration for URL parameter management
  
### Performance Optimizations
  
- **Static Shell Prerendering**: Header and Sidebar components are prerendered for instant loading
- **Dynamic Streaming**: Auth-dependent components stream in with Suspense boundaries
- **Cache Lifecycle Management**: Strategic caching with `cacheLife()` for optimal performance
- **Background Rendering**: Lower-priority rendering for hidden content

## ⚛️ React 19 Modern Patterns

This project leverages cutting-edge React 19.3 features for optimal performance and developer experience:

### Activity Component

Pre-renders hidden content at lower priority for instant transitions:

```tsx
// Skeletons pre-render in background, ready before loading starts
<Activity mode={isPending ? "visible" : "hidden"}>
  <Skeleton />
  <Skeleton />
  <Skeleton />
</Activity>

// Comments component stays mounted when hidden, preserving state
<Activity mode={isDetail ? "visible" : "hidden"}>
  <Comments {...commentProps} />
</Activity>
```

**Benefits:**
- Instant visual feedback on state changes
- Preserves component state when hidden
- Reduces perceived latency
- Lower-priority background rendering

### useEffectEvent Hook

Prevents unnecessary effect re-runs by extracting non-reactive callbacks:

```tsx
// Callbacks no longer trigger effect re-synchronization
const handleSuccess = useEffectEvent(() => {
  onSuccess?.({ state });
});

useEffect(() => {
  if (state.status === "SUCCESS") {
    handleSuccess();
  }
}, [state]); // ✅ Callbacks not in dependencies
```

**Benefits:**
- Fewer effect re-runs and re-renders
- Always accesses latest callback values
- Prevents event listener re-attachment
- Cleaner dependency arrays

### Render Props Pattern

Modern alternative to `cloneElement` for explicit data flow:

```tsx
// Before: cloneElement (implicit prop injection)
<ConfirmDialog trigger={<Button>Delete</Button>} />

// After: Render props (explicit prop passing)
<ConfirmDialog
  trigger={({ isPending, onClick }) => (
    <Button onClick={onClick} disabled={isPending}>
      Delete
    </Button>
  )}
/>
```

**Benefits:**
- Explicit data flow
- Full TypeScript support
- Better component reusability
- React team recommended approach

### startTransition

Non-blocking state updates for smoother UX:

```tsx
startTransition(() => {
  setComments((prev) => [...prev, ...result.list]);
  setNextCursor(result.nextCursor);
  setHasMore(result.hasMore);
});
```

**Benefits:**
- UI stays responsive during updates
- Lower priority for non-urgent updates
- Better perceived performance
- Avoids blocking user interactions


## 📋 Prerequisites

- Bun 1.4.2+ recommended (root `packageManager` pins `bun@1.4.2`; use `bun -v` locally)
- Node.js 24+ (fallback for non-Bun tooling; Prisma Next expects Node 24 LTS)
- PostgreSQL database
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd firstroad
```

### 2. Install dependencies

```bash
# Using Bun (recommended)
bun install
```

### 3. Set up environment variables

Copy the web app example env and configure (from repo root):

```bash
cp apps/web/env.example apps/web/.env.local
```

Update `apps/web/.env.local` with your configuration:

```env
# Database (Docker Postgres maps host 5433 → container 5432:
# postgresql://postgres:postgres@localhost:5433/firstroad)
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Inngest (set INNGEST_DEV=1 for local dev with docker-compose inngest service)
# INNGEST_DEV=1
# When Inngest Dev Server runs in Docker and the app runs on the host, set so the dev server can sync:
# INNGEST_SERVE_ORIGIN=http://host.docker.internal:3000

# Auth (Better Auth; validated in apps/web/src/lib/env.ts)
BETTER_AUTH_SECRET="your-secret-key-here"
# Public app URL used for emails and redirects
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Session cookie name (Better Auth; must match auth — used by proxy for optimistic session checks)
# Local HTTP: better-auth.session_token — HTTPS production often uses __Secure-better-auth.session_token
NEXT_PUBLIC_SESSION_COOKIE_NAME="better-auth.session_token"

# Email (Resend)
# Docs: https://resend.com/
RESEND_API_KEY="your-resend-api-key"
# Resend Email Configuration
# NEXT_PUBLIC_RESEND_FROM should be an email address, not an HTTP URL
# Format: "Your App Name <your-email@domain.com>" or just "your-email@domain.com"
NEXT_PUBLIC_RESEND_FROM="Your App <onboarding@resend.dev>"
# Optional: Resend Full Access key for template scripts (resend:list, resend:download)
# RESEND_FULL_ACCESS="re_..."

# Social Authentication (GitHub)
# Docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# S3 (Bun runtime; used for ticket attachments — required, validated in env.ts)
# Docs: https://bun.sh/docs/runtime/s3
# Required for Bun.s3 attachments. Production on Vercel uses "bunVersion": "1.4.x" in apps/web/vercel.json (not "1.x" — that stays on Bun 1.3.14).
S3_ACCESS_KEY_ID="your-s3-access-key-id"
S3_SECRET_ACCESS_KEY="your-s3-secret-access-key"
S3_REGION="us-east-1"
S3_BUCKET="your-bucket-name"
# Optional: for non-AWS S3-compatible services (e.g. MinIO, R2)
# S3_ENDPOINT="https://s3.us-east-1.amazonaws.com"
```

### 4. Set up the database

**Option A: Docker Postgres (recommended for local dev)**

Start Postgres and Inngest Dev Server in Docker (or Podman):

```bash
docker compose up -d postgres inngest
# Podman: podman compose up -d postgres inngest
# Or with env file to avoid build-arg warnings: docker compose --env-file apps/web/.env up -d postgres inngest
```

Set in `apps/web/.env.local` (compose maps Postgres to **host port 5433**):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/firstroad"
INNGEST_DEV=1
```

This keeps all dev DB traffic local and avoids Neon free-tier limits. Inngest Dev Server UI: http://localhost:8288.

**Option B: External Postgres (e.g. Neon)**

Use your Neon or other Postgres URL for `DATABASE_URL`. Omit `INNGEST_DEV` if using Inngest Cloud; for local Inngest, keep the compose `inngest` service (or any Inngest Dev Server pointed at `http://localhost:3000/api/inngest`) and set `INNGEST_DEV=1`.

Prisma Next lives in `packages/database`. Contract: `src/prisma/contract.prisma`. Use `.env` for production/Neon; use `.env.local` for local Docker Postgres (copy from `packages/database/env.example`).

From repo root:

```bash
# Generate Prisma contract artifacts (also runs after bun install via postinstall)
bunx turbo run db:generate --filter=@firstroad/db

# First-time DB init (packages/database)
cd packages/database && bun run db:init

# Plan / apply migrations
cd packages/database && bun run db:migrate        # plan (uses .env)
cd packages/database && bun run db:migrate:local # plan (uses .env.local)
cd packages/database && bun run db:deploy        # apply planned migration (.env)

# Push schema (db update)
cd packages/database && bun run db:push           # uses .env
cd packages/database && bun run db:push:local     # uses .env.local

# Seed (from packages/database)
cd packages/database && bun run db:seed           # uses .env
cd packages/database && bun run db:seed:local     # uses .env.local
```

### 5. Start the development server

From repo root (runs Next.js in `apps/web` via Turborepo):

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

Turborepo monorepo: root workspace with `apps/*` and `packages/*`.

```
firstroad/
├── .dockerignore
├── docker-compose.yml
├── apps/
│   └── web/                  # Next.js app (main app)
│       ├── src/
│       │   ├── app/          # App Router: (auth), (password), @auth, api, onboarding, layout, page
│       │   ├── components/  # Shared UI, confirm-dialog, form, skeletons, theme, ui
│       │   ├── features/    # attachments, auth, comment, invitations, memberships, navigation, organisation, pagination, password, ticket
│       │   ├── lib/         # auth, env, inngest, email, app
│       │   ├── hooks/       # use-action-state-with-feedback, use-toggle
│       │   ├── utils/       # with-action-feedback, cache-tags, invalidate-cache, to-action-state, etc.
│       │   ├── shims/       # unused Kysely adapter stub (alias commented out in next.config)
│       │   ├── path.ts
│       │   └── proxy.ts
│       ├── Dockerfile
│       ├── env.example
│       ├── next.config.ts
│       └── vercel.json
├── packages/
│   ├── database/             # Prisma 8 / Prisma Next
│   │   ├── env.example       # Copy to .env or .env.local
│   │   ├── migrations/       # Prisma Next app migrations
│   │   ├── prisma/           # seed, scripts, leftover Prisma 7 models
│   │   ├── prisma.config.ts
│   │   └── src/              # contract.prisma, db.ts, client-types, index
│   └── utils/                # Shared utilities (e.g. createSlug for slugs)
│       └── src/              # index, slug
├── package.json              # Workspaces, turbo scripts
├── turbo.json
└── biome.jsonc
```

## 🔐 Authentication

The application uses Better Auth with multiple authentication methods:

- **Sign Up**: Create new accounts with email and password
- **Sign In**: Secure login with credential validation or OTP
- **Social Login**: GitHub OAuth authentication (working) with automatic redirect to tickets page
- **OTP Authentication**: One-time password authentication via email
  - **Sign-in OTP**: Alternative login method using one-time passwords
  - **Email Verification OTP**: Verify email addresses with OTP codes
- **Password Reset**: Built-in password reset functionality
- **Email Verification**: Automatic email verification on signup
- **Welcome Emails**: Delayed welcome emails sent 2 minutes after signup
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Sessions**: Secure session management

### Authentication Flow

1. **Registration**: Users sign up with email/password
2. **Email Verification**: Verification email sent automatically
3. **Welcome Email**: Delayed welcome email sent 2 minutes after signup
4. **Login**: Users sign in with verified credentials, OTP, or GitHub OAuth
5. **Social Login**: GitHub OAuth integration with automatic redirect to tickets page
6. **OTP Login**: Alternative login method using one-time passwords
7. **Password Reset**: Users can request password reset via email
8. **Session Management**: Secure sessions with cookie-based caching

### OTP Authentication Routes

- **Sign-in OTP**: `/sign-in/otp/send` → `/sign-in/otp/verify`
- **Email Verification OTP**: `/verify-email/otp/send` → `/verify-email/otp/verify`
- **Dedicated Server Actions**: Purpose-specific actions for each OTP flow
- **Reusable Components**: `OTPSendForm`, `OTPVerifyForm`, and `OtpVerifyFormWithConnection` (shared server form with redirect) for consistent UX
- **Skeleton Fallback**: `OtpVerifyFormSkeleton` replaces spinner on verify pages
- **InputOTP Component**: Enhanced OTP input with shadcn/ui
- **Suspense Patterns**: Proper suspension with `CardCompact` for optimal caching
- **Toast Notifications**: Success feedback for OTP sent

### Redirect Handling

- Framework redirects (e.g., `redirect()` from `next/navigation`) are preserved by rethrowing redirect errors.
- Helper: `unstable_rethrow` rethrows Next.js framework errors.
- Example usage: Sign-up action rethrows redirect errors to avoid surfacing `NEXT_REDIRECT` in UI and properly navigate to `/`.

## 🔄 Dynamic Rendering & Session Management

- **Dynamic Rendering**: Use of `connection()` from `next/server` opts routes/components into dynamic rendering
- **User Management**: Centralized `getUser()` in `src/features/auth/queries/get-user.ts` with defensive session expiration checking
- **HasAuthSuspense Pattern**: Suspense-wrapped session injection for auth-dependent components
- **Background Jobs**: Inngest handles async operations like password reset emails

### HasAuthSuspense Pattern

Components use the `HasAuthSuspense` pattern for session-dependent rendering:

```typescript
// In page components (e.g., ticket detail page)
<TicketItem
  comments={
    <HasAuthSuspense fallback={<div>Loading Comments...</div>}>
      {(user) => (
        <Comments
          deleteCommentAction={deleteComment}
          list={list}
          loadMoreAction={getCommentsByTicketSlug}
          metadata={metadata}
          ticketId={ticket.id}
          ticketSlug={ticket.slug}
          upsertCommentAction={upsertComment}
          userId={user?.id}
          userName={user?.name}
        />
      )}
    </HasAuthSuspense>
  }
  isDetail={true}
  ticket={ticket}
/>
```

This pattern enables:

- Suspense-based loading states for auth-dependent content
- Function-level caching with "use cache" for static components
- Proper authorization checks via session context
- Type-safe session handling with `MaybeServerSession`

## 🎫 Ticket System

### Features

- **Create Tickets**: Users can create tickets with title, description, and deadline
- **Attachments**: Ticket owners can upload files (Bun S3); presigned download URLs for all viewers; owner-gated upload form with HasAuthSuspense
- **Status Management**: Track ticket status (Open, In Progress, Done)
- **Ownership**: Users can only edit their own tickets
- **Search & Filter**: Find tickets by title, description, or status
- **Deadline Tracking**: Set and manage ticket deadlines
- **Slug-based URLs**: Human-readable URLs using ticket slugs (e.g., `/this-ticket-title`)
- **Referenced tickets**: Associate tickets via `TicketReference`; listed on the ticket detail view
- **Unified Ticket Pages**: Ticket creation form and list displayed on the same page
- **Responsive Controls**: Desktop button groups and mobile dropdowns for filtering
- **Batch Access Queries**: Ownership and permissions fetched in 1 batch query for list pages (vs N individual queries)

### Sample Data

The database is seeded with sample tickets and comments for existing users:

- **Seeding**: Only creates tickets and comments, preserves existing users
- **User Creation**: Users must be created through the application's sign-up flow

## 💬 Comment System

### Features

- **Add Comments**: Users can add comments to tickets with optimistic UI updates
- **Edit Comments**: Comment owners can edit their comments with optimistic UI updates
- **Delete Comments**: Comment owners can delete their comments with optimistic UI updates
- **Comment Attachments**: Owner-only file uploads on comments (Bun S3, same as ticket attachments); optimistic placeholders show real file names while uploading (valibot-free client parsing via `getFilesFromFormData`)
- **Infinite Pagination**: Efficient cursor-based pagination for large comment lists
- **Optimistic Updates**: Instant UI feedback using React 19's `useOptimistic` hook
- **State Management**: Context store for comments and pagination metadata
- **Real-time Updates**: Comments update immediately after actions with server reconciliation

## 🎨 UI Components

Built with shadcn/ui and Tailwind CSS:

- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Accessible**: WCAG compliant components
- **Customizable**: Easy to modify and extend
- **Loading States**: Skeleton components for better UX
- **Card Components**: Consistent card layouts for auth pages
- **Table Components**: shadcn Table component for data display (used in organisation list)

## 🚀 Available Scripts

All commands from **repo root**. Turborepo runs tasks in the right workspace; Next.js app is in `apps/web`.

```bash
# Development
bun run dev              # Start Next.js (Turbopack, apps/web)
bun run dev:inspect      # Start Next.js with inspector
bun run build            # Build (turbo; @firstroad/web + db:generate)
bun run build:debug      # Next.js build --debug
bun run start            # Start production server
bun run type             # TypeScript type check (turbo)
bun run typegen          # Next.js type definitions (apps/web)
bun run auth:schema      # Emit Better Auth schema (apps/web)
bun run postinstall      # Generate Prisma contract artifacts

# Resend template scripts (apps/web; needs RESEND_FULL_ACCESS)
bun run resend:list
bun run resend:download

# Database (packages/database via turbo)
bunx turbo run db:generate --filter=@firstroad/db   # prisma-cli contract emit
cd packages/database && bun run db:migrate:local     # Plan migration (local Docker)
cd packages/database && bun run db:push:local        # db update (local)
cd packages/database && bun run db:seed:local        # Seed local DB
bun run reset:tickets    # Reset ticket/comment data (preserves users)
bun run clear:non-auth   # Clear non-auth tables
bun run clear:attachments # Clear attachment records and S3 objects
bun run seed:members     # Seed org members

# Inngest (Docker; no apps/inngest package)
docker compose up -d inngest   # Dev Server UI: http://localhost:8288

# Code quality (Ultracite + Biome)
bun run check            # Ultracite check
bun run fix              # Ultracite fix (format + lint)
bun run doctor           # Ultracite doctor
bun run react-doctor     # React Doctor (component health scan)
bun run ultracite:upgrade

# Deployment (from repo root; Vercel Root Directory is apps/web)
bun run deploy:prod      # vercel deploy --prod
```

## 🔧 Configuration

### Build (Next.js + Bun)

Production builds run through Turborepo (`bun run build`) and use the `apps/web` build with Turbopack/Bun. `next.config.ts` externalizes `pg`, `@neondatabase/serverless`, and `@prisma/orm-postgres` via `serverExternalPackages`.

Root `turbo.json` passes required build env vars via `tasks.build.env`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_RESEND_FROM`, `NEXT_PUBLIC_APP_URL`, `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, and `S3_BUCKET`.

### Tailwind CSS

The project uses Tailwind CSS v4 with custom configuration for dark mode, theme variables, and custom variants:

- **CSS Variables**: Dynamic layout calculations with CSS custom properties
- **Layout Shift Prevention**: CSS-driven height consistency and responsive design

### Database

PostgreSQL with Prisma 8 (Prisma Next) using:

- **Contract-first schema** in `packages/database/src/prisma/contract.prisma` (`prisma-cli contract emit`)
- **`@prisma/orm-postgres`** typed client (`db` / `orm`) plus a shared **`pg` / Neon pool**
- **Neon serverless adapter** when `DATABASE_URL` contains `neon.tech`; otherwise `pg`
- uuidv7 primary keys (`@default(uuid(7))`)
- Join table **TicketReference** for ticket-to-ticket links

**Database Models:**

- **User**: Better Auth user model with direct relations to tickets and comments
- **Account**: Better Auth account model
- **Session**: Better Auth session model (includes `activeOrganizationId`)
- **Verification**: Better Auth verification tokens
- **Organization**: Organization management
- **Member**: Organization membership with role-based permissions (owner, admin, member)
- **MemberPermission**: Per-member, per-resource flags (`canCreate` / `canUpdate` / `canDelete` for TICKET and COMMENT)
- **Invitation**: Organization invitations with role assignment
- **Ticket**: Ticket management with unique slug field (direct relation to User)
- **TicketReference**: Join table for referenced tickets (`fromId` / `toId`)
- **TicketAttachment**: Ticket file attachments; S3 key convention `attachments/{ticketId}/{attachmentId}/{fileName}`
- **Comment**: Comment system (direct relation to User)
- **CommentAttachment**: Comment file attachments

### Authentication & Background Jobs

Better Auth configured with:

- Email/password authentication
- Password reset functionality with Resend templates via Inngest events
- Email verification
- GitHub OAuth
- Rate limiting for production security
  - Rejected requests are not counted; memory backend has expired-entry cleanup; built-in defaults cover sign-in/sign-up and password reset/OTP.
  - **Note**: Rate limiting uses in-memory storage, which does not persist across serverless function invocations on Vercel. For a portfolio project this is acceptable. A proper fix would use database or secondary storage for rate limits when supported. If using secondary storage (e.g. Redis), [GitHub issue #5452](https://github.com/better-auth/better-auth/issues/5452) is closed unresolved: custom `rateLimit.window` is not passed as TTL for some paths (hardcoded 10s), so the limitation still applies.
- Shared `pg` / Neon **pool** as Better Auth `database` (not the Kysely or Prisma adapters); IDs via `uuidv7()`
- Session cookie caching (5-minute cache duration)
- Session expiration (7 days) and update age (1 day)
- Production on Vercel uses `bunVersion: "1.4.x"` in `apps/web/vercel.json`

Inngest provides background job processing for:

- Password reset emails
- Email verification
- OTP authentication emails
- Welcome emails (2-minute delay)
- Async event handling

### Email Templates (Resend)

The application uses Resend 6.26 for transactional emails with published templates. All email sending functions use Resend's template API.

**Template IDs:**
- `email-otp-verification` - OTP codes for sign-in, email verification, and password reset
- `email-verification` - Email verification links
- `password-reset-email` - Password reset links
- `password-changed-email` - Password change confirmation
- `welcome-email` - Welcome message for new users
- `organization-invitation` - Organization membership invitations

**Template Variables:**

All templates use UPPERCASE_SNAKE_CASE variable names (Resend requirement). Variables are passed via the `template.variables` object in `resend.emails.send()`:

- **`email-otp-verification`**:
  - `TO_NAME` - Recipient name or email address
  - `OTP` - One-time password code
  - `TYPE` - Subject line text (computed from OTP type)

- **`email-verification`**:
  - `TO_NAME` - Recipient name or email address
  - `URL` - Email verification link

- **`password-reset-email`**:
  - `TO_NAME` - Recipient name or email address
  - `URL` - Password reset link

- **`password-changed-email`**:
  - `TO_NAME` - Recipient name or email address
  - `APP_URL` - Application base URL

- **`welcome-email`**:
  - `TO_NAME` - Recipient name or email address
  - `APP_URL` - Application base URL

- **`organization-invitation`**:
  - `TO_NAME` - Recipient name or email address
  - `ORGANIZATION_NAME` - Name of the organization
  - `INVITER_NAME` - Name of the person who sent the invitation
  - `ROLE` - Assigned role (member or admin)
  - `INVITE_URL` - Invitation acceptance link

**Usage in Templates:**

Variables are accessed in Resend template HTML using triple curly braces: `{{{VARIABLE_NAME}}}`. For example:

```html
<h1>Hello {{{TO_NAME}}}</h1>
<a href="{{{URL}}}">Verify Email</a>
```

**API Key Requirements:**

Resend templates require an API key with `full_access` permissions (not just `sending_access`) to create and manage templates. The `RESEND_API_KEY` environment variable must be configured with a full-access key.

### API Routes (Elysia)

The application uses Elysia 1.4 as a unified API framework for handling API routes through a single catch-all handler (`src/app/api/[[...slugs]]/route.ts`).

**Architecture:**
- **Centralized App Instance**: Elysia app created in `src/lib/app.ts` with `/api` prefix
- **Plugin Pattern**: Inngest handler implemented as Elysia plugin in `inngest-plugin.ts`
- **OpenAPI Support**: `@elysiajs/openapi` 1.4 enabled when `NODE_ENV === "development"` (Better Auth paths via `better-auth-openapi.ts`)

**Features:**
- **Unified API Handler**: Single Elysia instance handles API routes
- **CORS Support**: Configured with `@elysiajs/cors` 1.4 for cross-origin requests
- **Better Auth Integration**: Auth routes mounted at `/auth` via `auth.handler` (CORS-enabled)
- **Inngest Webhooks**: Background job webhooks handled at `/api/inngest` via Elysia plugin
- **Next.js Route Handlers**: Exports GET, POST, PUT, DELETE, OPTIONS handlers for Next.js App Router

**Route Structure:**
- `/api/auth/*` - Better Auth authentication endpoints
- `/api/inngest` - Inngest webhook endpoint for background jobs

**Configuration:**
- CORS origin: `process.env.NEXT_PUBLIC_APP_URL`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: enabled
- Allowed headers: Content-Type, Authorization

**Benefits:**
- Type-safe API routes with Elysia's TypeScript support
- Unified middleware and CORS configuration
- Better Auth and Inngest integration in a single handler
- Plugin-based architecture for modular route management
- OpenAPI documentation in development

### Type Safety

- Full TypeScript support with strict configuration
- Typed routes with Next.js 16 (`typedRoutes: true`)
- Type-safe URL search parameters with nuqs 2.10
- Centralized auth types in `src/features/auth/types.ts`:
  - `ServerSession`: Full session with user object
  - `User`: Session user plus `activeOrganizationId`
  - `UserProp` / `Maybe` session handling for DAL and UI
- Discriminated union types for compile-time prop validation (e.g., `TicketItemProps`)
- HasAuthSuspense pattern with session injection for auth-dependent components
- Shared utilities in `src/utils/` for better organization
- Type-safe link generation with `createTypedLink` for search parameters
- Slug-based routing with automatic generation and validation

### Path Management

Centralized type-safe route definitions in `src/path.ts`:

- Static routes with `Route` type
- Dynamic routes with `as Route` assertions
- Slug-based ticket routes (`ticketPath(slug)`, `ticketEditPath(slug)`)
- Consistent path usage across the application

### Cache Management

Centralized cache tag system for consistent cache invalidation:

- **`src/utils/cache-tags.ts`**: Centralized cache tag functions (similar to `path.ts`)
  - `ticketsCache()`, `ticketCache(slug)`, `commentsCache()`, `commentsForTicketCache(ticketSlug)`, `commentCache(commentId)`, `attachmentCache()`, `attachmentsForTicketCache(ticketId)`
- **`src/utils/invalidate-cache.ts`**: High-level invalidation functions
  - `invalidateTicketAndList(slug)`, `invalidateCommentsForTicket(ticketSlug)`, `invalidateAttachmentsForTicket(ticketId)`, `invalidateTicketAndAttachments(slug, ticketId)`, etc.
- Ensures consistency between `cacheTag()` and `updateTag()` calls
- All ticket-related cache operations use slugs (not IDs) for consistency
- Single source of truth for cache tag strings

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

Build the production image (requires Neon `DATABASE_URL` for `generateStaticParams` at build time):

```bash
docker build -f apps/web/Dockerfile \
  --build-arg DATABASE_URL="$NEON_DATABASE_URL" \
  -t firstroad-web .
```

Run the container (pass all required env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `RESEND_*`, `GITHUB_*`, `S3_*`, `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`):

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="$NEON_DATABASE_URL" \
  -e BETTER_AUTH_SECRET="..." \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  # ... other env vars
  firstroad-web
```

The app uses Bun runtime (required for `Bun.s3` attachments). For production, use Inngest Cloud (set `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY`; do not set `INNGEST_DEV`).

### Other Platforms

The application can be deployed to any platform that supports Next.js and Bun (or Node without `Bun.s3` attachment uploads):

- Netlify
- DigitalOcean App Platform
- AWS Amplify
- Self-hosted Docker (see `apps/web/Dockerfile`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Better Auth](https://better-auth.com/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [nuqs](https://nuqs.47ng.com/) - Type-safe URL search params
- [Biome](https://biomejs.dev/) - Fast formatting and linting
- [Ultracite](https://ultracite.ai/) - Biome rules enforcement
- [React Compiler](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024) - Performance optimization
- [Resend](https://resend.com/) - Transactional email
- [Inngest](https://www.inngest.com/) - Background job processing
- [Valibot](https://valibot.dev/) - Lightweight schema validation
- [Elysia](https://elysiajs.com/) - Typesafe, fast API management
