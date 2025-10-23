# First Road - A Collaborative Ticket Management Platform

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18.0-2D3748?logo=prisma&logoColor=white)](https://prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.3.28-000000)](https://better-auth.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Biome](https://img.shields.io/badge/Biome-2.2.6-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Ultracite](https://img.shields.io/badge/Ultracite-5.6.4-000000)](https://ultracite.dev/)
[![nuqs](https://img.shields.io/badge/nuqs-2.7.2-000000)](https://nuqs.47ng.com/)
[![Zod](https://img.shields.io/badge/Zod-4.1.12-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Inngest](https://img.shields.io/badge/Inngest-3.44.3-000000)](https://www.inngest.com/)
[![Resend](https://img.shields.io/badge/Resend-6.2.2-000000)](https://resend.com/)
[![React Email](https://img.shields.io/badge/React%20Email-4.3.1-000000)](https://react.email/)

</div>

A full-stack collaborative platform built with Next.js 16, featuring authentication, real-time updates, and a modern UI. Users can create, manage, and track tickets with comments and collaboration features.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Better Auth (email/password + OTP)
- **🎫 Ticket Management**: Create, edit, and manage tickets with status tracking
- **💬 Comments System**: Add, edit, and delete comments on tickets with infinite pagination
- **🌙 Dark Mode**: Beautiful light/dark theme with smooth transitions
- **📱 Responsive Design**: Optimized for desktop and mobile devices with PPR navigation and cached components
- **⚡ Real-time Updates**: Server-side rendering with React Suspense and PPR dynamic holes
- **🔍 Search & Filter**: Advanced search and filtering capabilities
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📊 Infinite Pagination**: Efficient cursor-based pagination for comments
- **🔒 Ownership System**: Users can only edit their own tickets and comments
- **🎯 Type Safety**: Full TypeScript support with typed routes
- **📧 Email Features**: Password reset, email verification, OTP authentication, and welcome emails with React Email templates
- **🔄 Database Hooks**: Automatic UserInfo creation on user registration
- **🔄 Parallel Routes**: Next.js parallel routes for enhanced user experience
- **⚡ React Compiler**: React 19 compiler for automatic performance optimization
- **📬 Background Jobs**: Inngest for async event handling and email processing
- **⚡ PPR Navigation**: Partial Prerendering with cached header shell and dynamic auth components

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript 5.9 with strict type checking
- **Database**: PostgreSQL with Prisma Client (relationJoins preview, Neon adapter)
- **Authentication**: Better Auth 1.3+ with email/password provider
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod v4 validation
- **Notifications**: Sonner toast notifications
- **Theme**: next-themes for dark/light mode
- **URL Search Params**: nuqs for type-safe URL parameters
- **Email**: React Email with Resend for transactional emails
- **Background Jobs**: Inngest for background tasks and event handling
- **Package Manager**: Bun (recommended)
- **Linting**: Biome 2.2+ for fast formatting and linting with Ultracite rules
- **Type Checking**: TypeScript native preview for fast checking
- **React Compiler**: React 19 compiler for performance optimization

## ⚛️ React 19 Modern Patterns

This project leverages cutting-edge React 19.2 features for optimal performance and developer experience:

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
  <Comments ticketId={ticketId} />
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

- Node.js 18+ or Bun
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

# Or using npm
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
DIRECT_URL="postgresql://username:password@localhost:5432/your_database"

# Auth
AUTH_SECRET="your-secret-key-here"
# Public app URL used for emails and redirects
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Resend)
# Docs: https://resend.com/
RESEND_API_KEY="your-resend-api-key"
# Resend Email Configuration
# RESEND_FROM should be an email address, not an HTTP URL
# Format: "Your App Name <your-email@domain.com>" or just "your-email@domain.com"
RESEND_FROM="Your App <onboarding@resend.dev>"
```

### 4. Set up the database

```bash
# Generate Prisma client
bunx prisma generate

# Run database migrations (push schema to dev DB)
bunx prisma db push

# Seed the database with sample data
bunx prisma db seed
```

### 5. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Protected routes
│   │   ├── tickets/       # Ticket management pages
│   │   │   └── [[...ticketId]]/  # Optional catch-all route
│   │   │       ├── page.tsx      # Unified list/detail/edit page with Activity
│   │   │       ├── layout.tsx    # Layout wrapper
│   │   │       ├── error.tsx     # Error boundary
│   │   │       └── not-found.tsx # 404 page
│   │   └── account/        # User account pages
│   ├── (password)/         # Public auth routes
│   │   ├── sign-in/        # Sign in page (CardCompact)
│   │   ├── sign-up/        # Sign up page (CardCompact)
│   │   ├── forgot-password/ # Password reset request
│   │   ├── reset-password/  # Password reset confirmation
│   │   └── verify-email/   # Email verification
│   ├── @auth/              # Parallel route slot for auth modals
│   │   ├── (.)sign-in/     # Intercepted sign-in modal
│   │   ├── (.)sign-up/     # Intercepted sign-up modal
│   │   ├── (.)forgot-password/ # Intercepted forgot-password modal
│   │   ├── [...catchAll]/  # Catch-all for closing modals
│   │   └── default.tsx     # Default null state
│   ├── @tickets/           # Parallel route slot for tickets
│   │   ├── page.tsx        # Tickets list view
│   │   ├── [...catchAll]/  # Catch-all route
│   │   ├── default.tsx     # Default state
│   │   ├── error.tsx       # Error boundary
│   │   └── loading.tsx     # Loading state
│   ├── api/                # API routes
│   ├── _navigation/        # Navigation components
│   │   └── sidebar/        # Sidebar components
│   └── layout.tsx          # Root layout with parallel slots
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── form/              # Form components
│   └── theme/             # Theme configuration
├── features/              # Feature-based modules
│   ├── auth/              # Authentication logic
│   │   ├── actions/       # Server actions
│   │   ├── components/    # Auth components
│   │   ├── queries/       # Server-side queries (getSession)
│   │   ├── types.ts       # Centralized auth types (MaybeServerSession)
│   │   └── utils/         # Auth utilities (isOwner)
│   ├── ticket/            # Ticket management
│   │   ├── queries/       # Data queries with "use cache"
│   ├── comment/           # Comment system
│   ├── password/          # Password reset features
│   │   ├── components/    # Shared auth page content components
│   │   │   ├── sign-in-page-content.tsx     # Shared between modal & page
│   │   │   ├── sign-up-page-content.tsx     # Preserves state on refresh
│   │   │   └── forgot-password-page-content.tsx
│   └── types/             # Shared type definitions
├── lib/                   # Utility libraries
│   ├── auth.ts           # Better Auth configuration
│   ├── auth-client.ts    # Client-side auth instance
│   ├── auth-helpers.ts   # DAL helpers (hasAuth, requireAuth)
│   ├── email.ts          # Email utility with Resend
│   ├── env.ts            # Environment validation with Zod v4
│   ├── path.ts           # Type-safe route definitions
│   └── prisma.ts         # Database client with Neon adapter
├── utils/                 # Shared utilities
│   ├── cookies.ts        # Cookie management
│   ├── currency.ts       # Currency utilities
│   ├── get-active-path.ts # Path utilities
│   ├── is-redirect-error.ts # Redirect error detection
│   └── to-action-state.ts # Action state utilities
└── generated/            # Generated Prisma client (ignored by Git/Biome)
    └── prisma/           # Prisma Client with queryCompiler + driverAdapters
└── prisma/               # Database schema and migrations
    ├── models/           # Individual model files
    └── seed-data/        # Database seeding data
```

## 🔄 Optional Catch-All Routes with Activity

The project uses Next.js optional catch-all routes `[[...ticketId]]` combined with React 19's Activity component for optimal performance:

### Unified Tickets Route

```
/tickets              → List view (create + all tickets)
/tickets/abc123       → Detail view (specific ticket)
/tickets/abc123/edit  → Edit view (edit ticket)
```

All handled by a **single page component** at `tickets/[[...ticketId]]/page.tsx`

### How It Works

```tsx
// All views always render, Activity controls visibility
<ViewTransition>
  <Activity mode={isListView ? "visible" : "hidden"}>
    <TicketListView />
  </Activity>
  <Activity mode={isDetailView ? "visible" : "hidden"}>
    <TicketDetail ticketId={id} />
  </Activity>
  <Activity mode={isEditView ? "visible" : "hidden"}>
    <TicketEdit ticketId={id} />
  </Activity>
</ViewTransition>
```

### Benefits

- **Pre-rendering**: All views render in background at lower priority
- **Instant Transitions**: No loading spinners, just pure shared element morphing
- **State Preservation**: Components stay mounted when hidden
- **Shared Element Transitions**: Ticket cards smoothly morph between views
- **Clean URLs**: No query parameters needed

## 🔐 Authentication

The application uses Better Auth with multiple authentication methods:

- **Sign Up**: Create new accounts with email and password
- **Sign In**: Secure login with credential validation or OTP
- **OTP Authentication**: One-time password authentication via email
- **Password Reset**: Built-in password reset functionality
- **Email Verification**: Automatic email verification on signup
- **Welcome Emails**: Delayed welcome emails sent 2 minutes after signup
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Sessions**: Secure session management
- **Database Hooks**: Automatic UserInfo creation on user registration

### Authentication Flow

1. **Registration**: Users sign up with email/password
2. **Email Verification**: Verification email sent automatically
3. **Welcome Email**: Delayed welcome email sent 2 minutes after signup
4. **Login**: Users sign in with verified credentials or OTP
5. **OTP Login**: Alternative login method using one-time passwords
6. **Password Reset**: Users can request password reset via email
7. **Session Management**: Secure sessions with automatic UserInfo creation

### Redirect Handling

- Framework redirects (e.g., `redirect()` from `next/navigation`) are preserved by rethrowing redirect errors.
- Helper: `src/lib/is-redirect-error.ts` centralizes detection of Next.js redirect errors.
- Example usage: Sign-up action rethrows redirect errors to avoid surfacing `NEXT_REDIRECT` in UI and properly navigate to `/tickets`.

## 🔄 Dynamic Rendering & Session Management

- **Dynamic Rendering**: Use of `connection()` from `next/server` opts routes/components into dynamic rendering
- **Session Management**: Centralized `getSession()` in `src/features/auth/queries/get-session.ts`
- **DAL Pattern**: Session injection via `hasAuth()` helper for cacheable data queries
- **Background Jobs**: Inngest handles async operations like password reset emails

### DAL Pattern

Data queries use the DAL pattern with session injection:

```typescript
// In query files (e.g., get-ticket.ts)
export const getTicketById = async (
  session: MaybeServerSession,
  ticketId: string
) => {
  "use cache";
  // ... fetch and return data with isOwner checks
};

// In pages/components
const ticket = await hasAuth((session) => getTicketById(session, ticketId));
```

This pattern enables:

- Function-level caching with "use cache"
- Proper authorization checks via `isOwner(session, entity)`
- Type-safe session handling with `MaybeServerSession`

## 🎫 Ticket System

### Features

- **Create Tickets**: Users can create tickets with title, description, and deadline
- **Status Management**: Track ticket status (Open, In Progress, Done)
- **Ownership**: Users can only edit their own tickets
- **Search & Filter**: Find tickets by title, description, or status
- **Deadline Tracking**: Set and manage ticket deadlines
- **Parallel Display**: View ticket creation form and list simultaneously

### Sample Data

The database is seeded with sample tickets and comments for existing users:

- **Seeding**: Only creates tickets and comments, preserves existing users
- **User Creation**: Users must be created through the application's sign-up flow

## 💬 Comment System

### Features

- **Add Comments**: Users can add comments to tickets
- **Edit Comments**: Comment owners can edit their comments
- **Delete Comments**: Comment owners can delete their comments
- **Infinite Pagination**: Efficient cursor-based pagination for large comment lists
- **Real-time Updates**: Comments update immediately after actions

## 🎨 UI Components

Built with shadcn/ui and Tailwind CSS:

- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Accessible**: WCAG compliant components
- **Customizable**: Easy to modify and extend
- **Loading States**: Skeleton components for better UX
- **Card Components**: Consistent card layouts for auth pages

## 🚀 Available Scripts

```bash
# Development
bun run dev              # Start development server with Turbopack
bun run build            # Build for production with Turbopack
bun run build:debug      # Build with debug prerender info
bun run start            # Start production server
bun run lint             # Run Biome linting on src/
bun run lint:fix         # Fix linting issues automatically
bun run format           # Format code with Biome
bun run check            # Run linting and formatting together
bun run type             # Run TypeScript type checking
bun run typegen          # Generate Next.js type definitions

# Email Development
bun run email:dev        # Start React Email preview server
bun run email:build      # Build email templates
bun run email:export     # Export email templates to HTML

# Database
bunx prisma generate     # Generate Prisma client
bunx prisma db push      # Push schema to database
bunx prisma db seed      # Seed database with sample data

# Background Jobs (Inngest)
bunx inngest-cli dev     # Start Inngest dev server for local testing
```

## 🔧 Configuration

### Next.js 16 Features

- **Typed Routes**: Full type safety for all routes (`typedRoutes: true`)
- **Turbopack**: Fast bundling for development and production
- **React Compiler**: React 19 compiler for automatic performance optimization
- **Parallel Routes**: Enhanced routing with simultaneous route rendering (`@auth`, `@tickets`)
- **Interception Routes**: Modal overlays with graceful fallback on hard refresh
- **Client Segment Cache**: Improved caching for better performance
- **"use cache" Directive**: Function-level caching for data queries
- **PPR (Partial Prerendering)**: Static shell with dynamic holes for optimal performance

### Tailwind CSS

The project uses Tailwind CSS v4 with custom configuration for dark mode and theme variables.

### Database

PostgreSQL with Prisma Client using:

- **relationJoins** preview feature for optimized queries
- **Client-side engine** for edge compatibility
- **Neon serverless adapter** for efficient connections
- Custom output path: `src/generated/prisma/`

**Database Models:**

- **User**: Better Auth user model
- **Account**: Better Auth account model
- **Session**: Better Auth session model
- **Verification**: Better Auth verification tokens
- **UserInfo**: Extended user information
- **Ticket**: Ticket management
- **Comment**: Comment system

### Authentication & Background Jobs

Better Auth configured with:

- Email/password authentication
- Password reset functionality with React Email templates via Inngest events
- Email verification
- Rate limiting for production security
- Database hooks for UserInfo creation
- Prisma Client with Neon driver adapter

Inngest provides background job processing for:

- Password reset emails
- Email verification
- OTP authentication emails
- Welcome emails (2-minute delay)
- Async event handling

### Type Safety

- Full TypeScript support with strict configuration
- Typed routes with Next.js 16 (`typedRoutes: true`)
- Type-safe URL search parameters with nuqs
- Centralized auth types in `src/features/auth/types.ts`:
  - `ServerSession`: Full session with user object
  - `MaybeServerSession`: Session or null for DAL functions
  - `ClientSession`: Client-side session type
- DAL pattern with session injection via `hasAuth()` and `requireAuth()` helpers
- Shared utilities in `src/utils/` for better organization

### Path Management

Centralized type-safe route definitions in `src/path.ts`:

- Static routes with `Route` type
- Dynamic routes with `as Route` assertions
- Consistent path usage across the application

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

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
- [nuqs](https://nuqs.vercel.app/) - Type-safe URL search params
- [Biome](https://biomejs.dev/) - Fast formatting and linting
- [Ultracite](https://ultracite.ai/) - Biome rules enforcement
- [React Compiler](https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024) - Performance optimization
- [React Email](https://react.email/) - Email templates
- [Inngest](https://www.inngest.com/) - Background job processing
