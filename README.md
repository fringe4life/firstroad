# First Road - A Collaborative Ticket Management Platform

A full-stack collaborative platform built with Next.js 15, featuring authentication, real-time updates, and a modern UI. Users can create, manage, and track tickets with comments and collaboration features.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Auth.js (NextAuth v5)
- **🎫 Ticket Management**: Create, edit, and manage tickets with status tracking
- **💬 Comments System**: Add, edit, and delete comments on tickets with infinite pagination
- **🌙 Dark Mode**: Beautiful light/dark theme with smooth transitions
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **⚡ Real-time Updates**: Server-side rendering with React Suspense
- **🔍 Search & Filter**: Advanced search and filtering capabilities
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📊 Infinite Pagination**: Efficient cursor-based pagination for comments
- **🔒 Ownership System**: Users can only edit their own tickets and comments
- **🎯 Type Safety**: Full TypeScript support with typed routes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript with strict type checking
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth v5) with credential provider
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack React Query for server state
- **Notifications**: Sonner toast notifications
- **Theme**: next-themes for dark/light mode
- **URL Search Params**: nuqs for type-safe URL parameters
- **Package Manager**: Bun (recommended)
- **Linting**: Biome for fast formatting and linting

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

# Auth.js
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma client
bun run prisma generate

# Run database migrations
bun run prisma db push

# Seed the database with sample data
bun run prisma db seed
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
│   │   └── account/       # User account pages
│   ├── api/               # API routes
│   ├── _navigation/       # Navigation components
│   ├── _providers/        # React providers
│   └── auth.ts            # Auth.js configuration
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── form/             # Form components
│   └── theme/            # Theme configuration
├── features/             # Feature-based modules
│   ├── auth/             # Authentication logic
│   │   ├── actions/      # Server actions
│   │   └── components/   # Auth components
│   ├── ticket/           # Ticket management
│   ├── comment/          # Comment system
│   └── utils/            # Shared utilities
├── lib/                  # Utility libraries
└── prisma/              # Database schema and migrations
    ├── models/          # Individual model files
    └── seed-data/       # Database seeding data
```

## 🔐 Authentication

The application uses Auth.js (NextAuth v5) with credential authentication:

- **Sign Up**: Create new accounts with username, email, and password
- **Sign In**: Secure login with credential validation
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Sessions**: JWT-based session management
- **Password Hashing**: Argon2 for secure password storage

## 🎫 Ticket System

### Features
- **Create Tickets**: Users can create tickets with title, description, and deadline
- **Status Management**: Track ticket status (Open, In Progress, Done)
- **Ownership**: Users can only edit their own tickets
- **Search & Filter**: Find tickets by title, description, or status
- **Deadline Tracking**: Set and manage ticket deadlines

### Sample Data
The database is seeded with sample users and tickets for testing:
- **Users**: john@example.com, jane@example.com, bob@example.com
- **Password**: password123 (for all test accounts)

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

## 🚀 Available Scripts

```bash
# Development
bun run dev              # Start development server with Turbopack
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run Biome linting
bun run format           # Format code with Biome
bun run type             # Run TypeScript type checking with tsgo

# Database
bun run prisma generate  # Generate Prisma client
bun run prisma db push   # Push schema to database
bun run prisma db seed   # Seed database with sample data
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration for dark mode and theme variables.

### Database
PostgreSQL with Prisma ORM for type-safe database operations. The schema is split into individual model files for better organization.

### Authentication
Auth.js configured with credential provider and Prisma adapter.

### Type Safety
- Full TypeScript support with strict configuration
- Typed routes with Next.js 15
- Type-safe URL search parameters with nuqs
- Generic type utilities for better code reuse

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
- [Auth.js](https://authjs.dev/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TanStack Query](https://tanstack.com/query) - Server state management
- [nuqs](https://nuqs.vercel.app/) - Type-safe URL search params
