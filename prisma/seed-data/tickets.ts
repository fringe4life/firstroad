import { createSlug } from "@/features/ticket/utils/slug";
import type { Prisma, Ticket } from "@/generated/prisma/client";

const getRandomUserId = (ids: string[]) =>
  ids[Math.floor(Math.random() * ids.length)];

type TicketWithoutUserId = Omit<
  Ticket,
  "userId" | "id" | "createdAt" | "updatedAt" | "slug"
>;

// Base tickets list without userId assignment
export const baseTickets: TicketWithoutUserId[] = [
  {
    title: "Implement User Authentication",
    description: "Set up secure user authentication with Auth.js v5",
    status: "DONE",
    bounty: 250_099,
    deadline: new Date("2025-07-12"),
  },
  {
    title: "Create Ticket Management System",
    description: "Build a comprehensive ticket management interface",
    status: "OPEN",
    bounty: 120_099,
    deadline: new Date("2025-09-12"),
  },
  {
    title: "Add Real-time Notifications",
    description: "Implement WebSocket-based real-time notifications",
    status: "IN_PROGRESS",
    bounty: 25_099,
    deadline: new Date("2025-06-28"),
  },
  {
    title: "Optimize Database Queries",
    description: "Improve database performance with query optimization",
    status: "OPEN",
    bounty: 75_000,
    deadline: new Date("2025-08-15"),
  },
  {
    title: "Design Mobile App UI",
    description: "Create responsive mobile app interface design",
    status: "OPEN",
    bounty: 180_000,
    deadline: new Date("2025-10-01"),
  },
  {
    title: "Fix Critical Security Bug",
    description: "Address SQL injection vulnerability in user input handling",
    status: "IN_PROGRESS",
    bounty: 500_000,
    deadline: new Date("2025-05-20"),
  },
  {
    title: "Implement Dark Mode Toggle",
    description:
      "Add theme switching functionality with persistent user preferences",
    status: "OPEN",
    bounty: 45_000,
    deadline: new Date("2025-08-30"),
  },
  {
    title: "Create API Documentation",
    description:
      "Generate comprehensive API documentation using OpenAPI/Swagger",
    status: "OPEN",
    bounty: 85_000,
    deadline: new Date("2025-09-15"),
  },
  {
    title: "Add Unit Test Coverage",
    description: "Increase test coverage to 80% for critical business logic",
    status: "DONE",
    bounty: 95_000,
    deadline: new Date("2025-06-10"),
  },
  {
    title: "Implement Search Functionality",
    description: "Add full-text search with filters and sorting options",
    status: "OPEN",
    bounty: 150_000,
    deadline: new Date("2025-10-20"),
  },
  {
    title: "Setup CI/CD Pipeline",
    description: "Configure automated testing and deployment workflow",
    status: "IN_PROGRESS",
    bounty: 120_000,
    deadline: new Date("2025-07-25"),
  },
  {
    title: "Performance Optimization",
    description:
      "Reduce page load times and improve overall application performance",
    status: "OPEN",
    bounty: 200_000,
    deadline: new Date("2025-11-05"),
  },
  {
    title: "Add Multi-language Support",
    description: "Implement internationalization (i18n) for multiple languages",
    status: "OPEN",
    bounty: 175_000,
    deadline: new Date("2025-12-01"),
  },
  {
    title: "Create Admin Dashboard",
    description:
      "Build comprehensive admin panel for user and system management",
    status: "OPEN",
    bounty: 300_000,
    deadline: new Date("2025-11-15"),
  },
  // Additional tickets for pagination testing
  {
    title: "Implement File Upload System",
    description: "Add secure file upload functionality with image compression",
    status: "OPEN",
    bounty: 125_000,
    deadline: new Date("2025-09-20"),
  },
  {
    title: "Add Email Notifications",
    description: "Implement email notification system for ticket updates",
    status: "IN_PROGRESS",
    bounty: 80_000,
    deadline: new Date("2025-08-10"),
  },
  {
    title: "Create User Profile Pages",
    description: "Build detailed user profile pages with activity history",
    status: "OPEN",
    bounty: 95_000,
    deadline: new Date("2025-10-15"),
  },
  {
    title: "Implement Data Export",
    description: "Add CSV/Excel export functionality for ticket data",
    status: "OPEN",
    bounty: 65_000,
    deadline: new Date("2025-09-05"),
  },
  {
    title: "Add Advanced Filtering",
    description: "Implement advanced filtering and sorting for ticket lists",
    status: "IN_PROGRESS",
    bounty: 110_000,
    deadline: new Date("2025-08-25"),
  },
  {
    title: "Create Reporting Dashboard",
    description: "Build analytics dashboard with charts and metrics",
    status: "OPEN",
    bounty: 180_000,
    deadline: new Date("2025-11-30"),
  },
  {
    title: "Implement Rate Limiting",
    description: "Add API rate limiting to prevent abuse",
    status: "OPEN",
    bounty: 70_000,
    deadline: new Date("2025-08-15"),
  },
  {
    title: "Add Social Login",
    description: "Implement OAuth login with Facebook and Twitter",
    status: "IN_PROGRESS",
    bounty: 90_000,
    deadline: new Date("2025-09-10"),
  },
  {
    title: "Create Mobile App",
    description: "Develop native mobile app for iOS and Android",
    status: "OPEN",
    bounty: 400_000,
    deadline: new Date("2025-12-20"),
  },
  {
    title: "Implement Caching Layer",
    description: "Add Redis caching for improved performance",
    status: "OPEN",
    bounty: 130_000,
    deadline: new Date("2025-10-05"),
  },
  {
    title: "Add Voice Commands",
    description: "Implement voice command functionality for accessibility",
    status: "OPEN",
    bounty: 220_000,
    deadline: new Date("2025-11-25"),
  },
  {
    title: "Create Integration API",
    description: "Build REST API for third-party integrations",
    status: "IN_PROGRESS",
    bounty: 160_000,
    deadline: new Date("2025-09-30"),
  },
  {
    title: "Implement Backup System",
    description: "Add automated backup and recovery system",
    status: "OPEN",
    bounty: 140_000,
    deadline: new Date("2025-10-30"),
  },
  {
    title: "Add Video Conferencing",
    description: "Integrate video conferencing for team collaboration",
    status: "OPEN",
    bounty: 280_000,
    deadline: new Date("2025-12-10"),
  },
];

// Factory to attach random user IDs and generate slugs; allows overriding tickets list
export const createTickets = (
  userIds: string[],
  tickets: TicketWithoutUserId[] = baseTickets,
): Prisma.TicketCreateManyInput[] =>
  tickets.map((t) => ({
    ...t,
    userId: getRandomUserId(userIds),
    slug: createSlug(t.title),
  }));
