import type { TicketModel } from "@firstroad/db/client-types";

type TicketSeedInput = Omit<TicketModel, "id" | "createdAt" | "updatedAt">;

import { createSlug } from "@firstroad/utils";

const getRandomUser = (users: SeedUser[]) =>
  users[Math.floor(Math.random() * users.length)];

const getRandomOrganisationId = (ids: string[]) =>
  ids[Math.floor(Math.random() * ids.length)];

interface TicketWithoutUserId
  extends Omit<
    TicketModel,
    "userId" | "id" | "createdAt" | "updatedAt" | "slug" | "organizationId"
  > {}

interface SeedUser {
  organizationIds: string[];
  userId: string;
}

// Base tickets list without userId assignment
const baseTickets: TicketWithoutUserId[] = [
  {
    bounty: 250_099,
    deadline: "2025-07-12T00:00:00.000Z",
    description: "Set up secure user authentication with Auth.js v5",
    status: "DONE",
    title: "Implement User Authentication",
  },
  {
    bounty: 120_099,
    deadline: "2025-09-12T00:00:00.000Z",
    description: "Build a comprehensive ticket management interface",
    status: "OPEN",
    title: "Create Ticket Management System",
  },
  {
    bounty: 25_099,
    deadline: "2025-06-28T00:00:00.000Z",
    description: "Implement WebSocket-based real-time notifications",
    status: "IN_PROGRESS",
    title: "Add Real-time Notifications",
  },
  {
    bounty: 75_000,
    deadline: "2025-08-15T00:00:00.000Z",
    description: "Improve database performance with query optimization",
    status: "OPEN",
    title: "Optimize Database Queries",
  },
  {
    bounty: 180_000,
    deadline: "2025-10-01T00:00:00.000Z",
    description: "Create responsive mobile app interface design",
    status: "OPEN",
    title: "Design Mobile App UI",
  },
  {
    bounty: 500_000,
    deadline: "2025-05-20T00:00:00.000Z",
    description: "Address SQL injection vulnerability in user input handling",
    status: "IN_PROGRESS",
    title: "Fix Critical Security Bug",
  },
  {
    bounty: 45_000,
    deadline: "2025-08-30T00:00:00.000Z",
    description:
      "Add theme switching functionality with persistent user preferences",
    status: "OPEN",
    title: "Implement Dark Mode Toggle",
  },
  {
    bounty: 85_000,
    deadline: "2025-09-15T00:00:00.000Z",
    description:
      "Generate comprehensive API documentation using OpenAPI/Swagger",
    status: "OPEN",
    title: "Create API Documentation",
  },
  {
    bounty: 95_000,
    deadline: "2025-06-10T00:00:00.000Z",
    description: "Increase test coverage to 80% for critical business logic",
    status: "DONE",
    title: "Add Unit Test Coverage",
  },
  {
    bounty: 150_000,
    deadline: "2025-10-20T00:00:00.000Z",
    description: "Add full-text search with filters and sorting options",
    status: "OPEN",
    title: "Implement Search Functionality",
  },
  {
    bounty: 120_000,
    deadline: "2025-07-25T00:00:00.000Z",
    description: "Configure automated testing and deployment workflow",
    status: "IN_PROGRESS",
    title: "Setup CI/CD Pipeline",
  },
  {
    bounty: 200_000,
    deadline: "2025-11-05T00:00:00.000Z",
    description:
      "Reduce page load times and improve overall application performance",
    status: "OPEN",
    title: "Performance Optimization",
  },
  {
    bounty: 175_000,
    deadline: "2025-12-01T00:00:00.000Z",
    description: "Implement internationalization (i18n) for multiple languages",
    status: "OPEN",
    title: "Add Multi-language Support",
  },
  {
    bounty: 300_000,
    deadline: "2025-11-15T00:00:00.000Z",
    description:
      "Build comprehensive admin panel for user and system management",
    status: "OPEN",
    title: "Create Admin Dashboard",
  },
  // Additional tickets for pagination testing
  {
    bounty: 125_000,
    deadline: "2025-09-20T00:00:00.000Z",
    description: "Add secure file upload functionality with image compression",
    status: "OPEN",
    title: "Implement File Upload System",
  },
  {
    bounty: 80_000,
    deadline: "2025-08-10T00:00:00.000Z",
    description: "Implement email notification system for ticket updates",
    status: "IN_PROGRESS",
    title: "Add Email Notifications",
  },
  {
    bounty: 95_000,
    deadline: "2025-10-15T00:00:00.000Z",
    description: "Build detailed user profile pages with activity history",
    status: "OPEN",
    title: "Create User Profile Pages",
  },
  {
    bounty: 65_000,
    deadline: "2025-09-05T00:00:00.000Z",
    description: "Add CSV/Excel export functionality for ticket data",
    status: "OPEN",
    title: "Implement Data Export",
  },
  {
    bounty: 110_000,
    deadline: "2025-08-25T00:00:00.000Z",
    description: "Implement advanced filtering and sorting for ticket lists",
    status: "IN_PROGRESS",
    title: "Add Advanced Filtering",
  },
  {
    bounty: 180_000,
    deadline: "2025-11-30T00:00:00.000Z",
    description: "Build analytics dashboard with charts and metrics",
    status: "OPEN",
    title: "Create Reporting Dashboard",
  },
  {
    bounty: 70_000,
    deadline: "2025-08-15T00:00:00.000Z",
    description: "Add API rate limiting to prevent abuse",
    status: "OPEN",
    title: "Implement Rate Limiting",
  },
  {
    bounty: 90_000,
    deadline: "2025-09-10T00:00:00.000Z",
    description: "Implement OAuth login with Facebook and Twitter",
    status: "IN_PROGRESS",
    title: "Add Social Login",
  },
  {
    bounty: 400_000,
    deadline: "2025-12-20T00:00:00.000Z",
    description: "Develop native mobile app for iOS and Android",
    status: "OPEN",
    title: "Create Mobile App",
  },
  {
    bounty: 130_000,
    deadline: "2025-10-05T00:00:00.000Z",
    description: "Add Redis caching for improved performance",
    status: "OPEN",
    title: "Implement Caching Layer",
  },
  {
    bounty: 220_000,
    deadline: "2025-11-25T00:00:00.000Z",
    description: "Implement voice command functionality for accessibility",
    status: "OPEN",
    title: "Add Voice Commands",
  },
  {
    bounty: 160_000,
    deadline: "2025-09-30T00:00:00.000Z",
    description: "Build REST API for third-party integrations",
    status: "IN_PROGRESS",
    title: "Create Integration API",
  },
  {
    bounty: 140_000,
    deadline: "2025-10-30T00:00:00.000Z",
    description: "Add automated backup and recovery system",
    status: "OPEN",
    title: "Implement Backup System",
  },
  {
    bounty: 280_000,
    deadline: "2025-12-10T00:00:00.000Z",
    description: "Integrate video conferencing for team collaboration",
    status: "OPEN",
    title: "Add Video Conferencing",
  },
];

// Factory to attach random user IDs and generate slugs; allows overriding tickets list
export const createTickets = (
  users: SeedUser[],
  tickets: TicketWithoutUserId[] = baseTickets,
): TicketSeedInput[] => {
  if (users.length === 0) {
    return [];
  }

  return tickets.map((ticket) => {
    const user = getRandomUser(users);
    return {
      ...ticket,
      organizationId: getRandomOrganisationId(user.organizationIds),
      slug: createSlug(ticket.title),
      userId: user.userId,
    };
  });
};
