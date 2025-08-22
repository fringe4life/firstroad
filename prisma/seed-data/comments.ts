export const createComments = (ticketIds: string[], userIds: string[]) => [
  // Comments for "Implement User Authentication" (DONE)
  {
    content: "Great work on the authentication implementation! The JWT tokens are working perfectly.",
    ticketId: ticketIds[0],
    userId: userIds[1],
  },
  {
    content: "The password hashing with bcrypt looks solid. Security is top-notch!",
    ticketId: ticketIds[0],
    userId: userIds[2],
  },
  {
    content: "Thanks everyone! The OAuth integration with Google and GitHub is now complete.",
    ticketId: ticketIds[0],
    userId: userIds[0],
  },

  // Comments for "Create Ticket Management System" (OPEN)
  {
    content: "I think we should add a priority field to help with ticket organization.",
    ticketId: ticketIds[1],
    userId: userIds[1],
  },
  {
    content: "Good idea! We could also add labels/tags for better categorization.",
    ticketId: ticketIds[1],
    userId: userIds[2],
  },
  {
    content: "I'll start working on the UI components for the ticket list view.",
    ticketId: ticketIds[1],
    userId: userIds[0],
  },

  // Comments for "Add Real-time Notifications" (IN_PROGRESS)
  {
    content: "The WebSocket connection is established. Working on the notification payload structure.",
    ticketId: ticketIds[2],
    userId: userIds[1],
  },
  {
    content: "Don't forget to handle connection errors and reconnection logic.",
    ticketId: ticketIds[2],
    userId: userIds[0],
  },
  {
    content: "I've added the notification sound effects. Should be ready for testing soon.",
    ticketId: ticketIds[2],
    userId: userIds[2],
  },

  // Comments for "Optimize Database Queries" (OPEN)
  {
    content: "I noticed some N+1 query issues in the ticket listing. We should add proper includes.",
    ticketId: ticketIds[3],
    userId: userIds[1],
  },
  {
    content: "Agreed. I'll analyze the query patterns and add database indexes where needed.",
    ticketId: ticketIds[3],
    userId: userIds[0],
  },

  // Comments for "Design Mobile App UI" (OPEN)
  {
    content: "I've created wireframes for the mobile interface. Should we go with a bottom navigation?",
    ticketId: ticketIds[4],
    userId: userIds[2],
  },
  {
    content: "Bottom navigation would work well for the main sections. What about the ticket details?",
    ticketId: ticketIds[4],
    userId: userIds[1],
  },

  // Comments for "Fix Critical Security Bug" (IN_PROGRESS)
  {
    content: "Found the SQL injection vulnerability in the search functionality. Working on parameterized queries.",
    ticketId: ticketIds[5],
    userId: userIds[0],
  },
  {
    content: "This is critical! Please prioritize this fix. I can help test once it's ready.",
    ticketId: ticketIds[5],
    userId: userIds[1],
  },
  {
    content: "I've added input validation middleware to prevent future issues.",
    ticketId: ticketIds[5],
    userId: userIds[2],
  },

  // Comments for "Implement Dark Mode Toggle" (OPEN)
  {
    content: "We should use CSS custom properties for the theme colors to make switching easier.",
    ticketId: ticketIds[6],
    userId: userIds[1],
  },
  {
    content: "Good approach! I'll create the theme context and provider components.",
    ticketId: ticketIds[6],
    userId: userIds[0],
  },

  // Comments for "Create API Documentation" (OPEN)
  {
    content: "I'll set up Swagger/OpenAPI documentation for all our endpoints.",
    ticketId: ticketIds[7],
    userId: userIds[2],
  },
  {
    content: "Make sure to include authentication examples and error responses.",
    ticketId: ticketIds[7],
    userId: userIds[1],
  },

  // Comments for "Add Unit Test Coverage" (DONE)
  {
    content: "Test coverage is now at 85%! All critical business logic is covered.",
    ticketId: ticketIds[8],
    userId: userIds[0],
  },
  {
    content: "Excellent work! The tests are well-structured and easy to maintain.",
    ticketId: ticketIds[8],
    userId: userIds[1],
  },

  // Comments for "Implement Search Functionality" (OPEN)
  {
    content: "I'm thinking we should use Elasticsearch for better search performance.",
    ticketId: ticketIds[9],
    userId: userIds[1],
  },
  {
    content: "Elasticsearch might be overkill for our current scale. Let's start with database full-text search.",
    ticketId: ticketIds[9],
    userId: userIds[0],
  },
  {
    content: "Agreed. We can always upgrade to Elasticsearch later if needed.",
    ticketId: ticketIds[9],
    userId: userIds[2],
  },

  // Comments for "Setup CI/CD Pipeline" (IN_PROGRESS)
  {
    content: "GitHub Actions workflow is configured. Tests run on every push.",
    ticketId: ticketIds[10],
    userId: userIds[2],
  },
  {
    content: "Great! When will the deployment to staging be ready?",
    ticketId: ticketIds[10],
    userId: userIds[1],
  },

  // Comments for "Performance Optimization" (OPEN)
  {
    content: "I've identified several bottlenecks in the image loading and API calls.",
    ticketId: ticketIds[11],
    userId: userIds[0],
  },
  {
    content: "We should implement lazy loading for images and add API response caching.",
    ticketId: ticketIds[11],
    userId: userIds[1],
  },

  // Comments for "Add Multi-language Support" (OPEN)
  {
    content: "I'll set up react-i18next for internationalization support.",
    ticketId: ticketIds[12],
    userId: userIds[1],
  },
  {
    content: "Which languages should we support initially? I suggest English, Spanish, and French.",
    ticketId: ticketIds[12],
    userId: userIds[2],
  },

  // Comments for "Create Admin Dashboard" (OPEN)
  {
    content: "I'll start with user management and system analytics panels.",
    ticketId: ticketIds[13],
    userId: userIds[2],
  },
  {
    content: "Don't forget to add role-based access control for admin features.",
    ticketId: ticketIds[13],
    userId: userIds[0],
  },
];
