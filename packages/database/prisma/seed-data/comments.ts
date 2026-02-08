export const createComments = (ticketIds: string[], userIds: string[]) => [
  // Comments for "Implement User Authentication" (DONE) - 3 comments
  {
    content:
      "Great work on the authentication implementation! The JWT tokens are working perfectly.",
    ticketId: ticketIds[0],
    userId: userIds[1],
  },
  {
    content:
      "The password hashing with bcrypt looks solid. Security is top-notch!",
    ticketId: ticketIds[0],
    userId: userIds[2],
  },
  {
    content:
      "Thanks everyone! The OAuth integration with Google and GitHub is now complete.",
    ticketId: ticketIds[0],
    userId: userIds[0],
  },

  // Comments for "Create Ticket Management System" (OPEN) - 8 comments to test pagination
  {
    content:
      "I think we should add a priority field to help with ticket organization.",
    ticketId: ticketIds[1],
    userId: userIds[1],
  },
  {
    content:
      "Good idea! We could also add labels/tags for better categorization.",
    ticketId: ticketIds[1],
    userId: userIds[2],
  },
  {
    content:
      "I'll start working on the UI components for the ticket list view.",
    ticketId: ticketIds[1],
    userId: userIds[0],
  },
  {
    content:
      "The drag-and-drop functionality for reordering tickets would be really useful.",
    ticketId: ticketIds[1],
    userId: userIds[1],
  },
  {
    content:
      "Agreed! We should also add bulk actions for multiple ticket selection.",
    ticketId: ticketIds[1],
    userId: userIds[2],
  },
  {
    content:
      "I've started working on the ticket detail view with all the metadata.",
    ticketId: ticketIds[1],
    userId: userIds[0],
  },
  {
    content: "Don't forget to add keyboard shortcuts for power users.",
    ticketId: ticketIds[1],
    userId: userIds[1],
  },
  {
    content: "The search and filter functionality is coming along nicely.",
    ticketId: ticketIds[1],
    userId: userIds[2],
  },

  // Comments for "Add Real-time Notifications" (IN_PROGRESS) - 6 comments
  {
    content:
      "The WebSocket connection is established. Working on the notification payload structure.",
    ticketId: ticketIds[2],
    userId: userIds[1],
  },
  {
    content: "Don't forget to handle connection errors and reconnection logic.",
    ticketId: ticketIds[2],
    userId: userIds[0],
  },
  {
    content:
      "I've added the notification sound effects. Should be ready for testing soon.",
    ticketId: ticketIds[2],
    userId: userIds[2],
  },
  {
    content: "The notification preferences panel is now functional.",
    ticketId: ticketIds[2],
    userId: userIds[1],
  },
  {
    content:
      "We should add notification history so users can see what they missed.",
    ticketId: ticketIds[2],
    userId: userIds[0],
  },
  {
    content: "The mobile push notifications are working great!",
    ticketId: ticketIds[2],
    userId: userIds[2],
  },

  // Comments for "Optimize Database Queries" (OPEN) - 5 comments
  {
    content:
      "I noticed some N+1 query issues in the ticket listing. We should add proper includes.",
    ticketId: ticketIds[3],
    userId: userIds[1],
  },
  {
    content:
      "Agreed. I'll analyze the query patterns and add database indexes where needed.",
    ticketId: ticketIds[3],
    userId: userIds[0],
  },
  {
    content:
      "The query performance has improved significantly with the new indexes.",
    ticketId: ticketIds[3],
    userId: userIds[2],
  },
  {
    content:
      "We should implement query result caching to reduce database load.",
    ticketId: ticketIds[3],
    userId: userIds[1],
  },
  {
    content: "The connection pooling configuration looks good now.",
    ticketId: ticketIds[3],
    userId: userIds[0],
  },

  // Comments for "Design Mobile App UI" (OPEN) - 4 comments
  {
    content:
      "I've created wireframes for the mobile interface. Should we go with a bottom navigation?",
    ticketId: ticketIds[4],
    userId: userIds[2],
  },
  {
    content:
      "Bottom navigation would work well for the main sections. What about the ticket details?",
    ticketId: ticketIds[4],
    userId: userIds[1],
  },
  {
    content: "The gesture-based interactions are working smoothly on mobile.",
    ticketId: ticketIds[4],
    userId: userIds[0],
  },
  {
    content: "We should add haptic feedback for better user experience.",
    ticketId: ticketIds[4],
    userId: userIds[2],
  },

  // Comments for "Fix Critical Security Bug" (IN_PROGRESS) - 7 comments
  {
    content:
      "Found the SQL injection vulnerability in the search functionality. Working on parameterized queries.",
    ticketId: ticketIds[5],
    userId: userIds[0],
  },
  {
    content:
      "This is critical! Please prioritize this fix. I can help test once it's ready.",
    ticketId: ticketIds[5],
    userId: userIds[1],
  },
  {
    content: "I've added input validation middleware to prevent future issues.",
    ticketId: ticketIds[5],
    userId: userIds[2],
  },
  {
    content:
      "The security audit is complete. All vulnerabilities have been addressed.",
    ticketId: ticketIds[5],
    userId: userIds[0],
  },
  {
    content:
      "We should implement rate limiting to prevent brute force attacks.",
    ticketId: ticketIds[5],
    userId: userIds[1],
  },
  {
    content: "The penetration testing results look good now.",
    ticketId: ticketIds[5],
    userId: userIds[2],
  },
  {
    content: "Security headers have been properly configured.",
    ticketId: ticketIds[5],
    userId: userIds[0],
  },

  // Comments for "Implement Dark Mode Toggle" (OPEN) - 3 comments
  {
    content:
      "We should use CSS custom properties for the theme colors to make switching easier.",
    ticketId: ticketIds[6],
    userId: userIds[1],
  },
  {
    content:
      "Good approach! I'll create the theme context and provider components.",
    ticketId: ticketIds[6],
    userId: userIds[0],
  },
  {
    content: "The theme persistence is working well with localStorage.",
    ticketId: ticketIds[6],
    userId: userIds[2],
  },

  // Comments for "Create API Documentation" (OPEN) - 4 comments
  {
    content: "I'll set up Swagger/OpenAPI documentation for all our endpoints.",
    ticketId: ticketIds[7],
    userId: userIds[2],
  },
  {
    content:
      "Make sure to include authentication examples and error responses.",
    ticketId: ticketIds[7],
    userId: userIds[1],
  },
  {
    content: "The interactive API docs are now live and working great!",
    ticketId: ticketIds[7],
    userId: userIds[0],
  },
  {
    content: "We should add code examples in multiple programming languages.",
    ticketId: ticketIds[7],
    userId: userIds[2],
  },

  // Comments for "Add Unit Test Coverage" (DONE) - 3 comments
  {
    content:
      "Test coverage is now at 85%! All critical business logic is covered.",
    ticketId: ticketIds[8],
    userId: userIds[0],
  },
  {
    content:
      "Excellent work! The tests are well-structured and easy to maintain.",
    ticketId: ticketIds[8],
    userId: userIds[1],
  },
  {
    content: "The integration tests are passing consistently now.",
    ticketId: ticketIds[8],
    userId: userIds[2],
  },

  // Comments for "Implement Search Functionality" (OPEN) - 5 comments
  {
    content:
      "I'm thinking we should use Elasticsearch for better search performance.",
    ticketId: ticketIds[9],
    userId: userIds[1],
  },
  {
    content:
      "Elasticsearch might be overkill for our current scale. Let's start with database full-text search.",
    ticketId: ticketIds[9],
    userId: userIds[0],
  },
  {
    content: "Agreed. We can always upgrade to Elasticsearch later if needed.",
    ticketId: ticketIds[9],
    userId: userIds[2],
  },
  {
    content:
      "The search filters are working well with the current implementation.",
    ticketId: ticketIds[9],
    userId: userIds[1],
  },
  {
    content: "We should add search result highlighting for better UX.",
    ticketId: ticketIds[9],
    userId: userIds[0],
  },

  // Comments for "Setup CI/CD Pipeline" (IN_PROGRESS) - 4 comments
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
  {
    content: "The automated deployment to production is now working smoothly.",
    ticketId: ticketIds[10],
    userId: userIds[0],
  },
  {
    content: "We should add performance monitoring to the pipeline.",
    ticketId: ticketIds[10],
    userId: userIds[2],
  },

  // Comments for "Performance Optimization" (OPEN) - 6 comments
  {
    content:
      "I've identified several bottlenecks in the image loading and API calls.",
    ticketId: ticketIds[11],
    userId: userIds[0],
  },
  {
    content:
      "We should implement lazy loading for images and add API response caching.",
    ticketId: ticketIds[11],
    userId: userIds[1],
  },
  {
    content: "The bundle size has been reduced by 30% with code splitting.",
    ticketId: ticketIds[11],
    userId: userIds[2],
  },
  {
    content:
      "Database query optimization has improved response times significantly.",
    ticketId: ticketIds[11],
    userId: userIds[0],
  },
  {
    content: "We should implement service workers for offline functionality.",
    ticketId: ticketIds[11],
    userId: userIds[1],
  },
  {
    content: "The CDN integration is working well for static assets.",
    ticketId: ticketIds[11],
    userId: userIds[2],
  },

  // Comments for "Add Multi-language Support" (OPEN) - 4 comments
  {
    content: "I'll set up react-i18next for internationalization support.",
    ticketId: ticketIds[12],
    userId: userIds[1],
  },
  {
    content:
      "Which languages should we support initially? I suggest English, Spanish, and French.",
    ticketId: ticketIds[12],
    userId: userIds[2],
  },
  {
    content: "The translation files are organized and ready for review.",
    ticketId: ticketIds[12],
    userId: userIds[0],
  },
  {
    content:
      "We should add language detection based on user's browser settings.",
    ticketId: ticketIds[12],
    userId: userIds[1],
  },

  // Comments for "Create Admin Dashboard" (OPEN) - 5 comments
  {
    content: "I'll start with user management and system analytics panels.",
    ticketId: ticketIds[13],
    userId: userIds[2],
  },
  {
    content:
      "Don't forget to add role-based access control for admin features.",
    ticketId: ticketIds[13],
    userId: userIds[0],
  },
  {
    content: "The admin dashboard is looking great with all the metrics.",
    ticketId: ticketIds[13],
    userId: userIds[1],
  },
  {
    content: "We should add audit logs for admin actions.",
    ticketId: ticketIds[13],
    userId: userIds[2],
  },
  {
    content: "The user management interface is now fully functional.",
    ticketId: ticketIds[13],
    userId: userIds[0],
  },

  // Comments for new tickets (ticketIds[14] to ticketIds[29])

  // "Implement File Upload System" - 6 comments
  {
    content:
      "I'll start with the basic file upload functionality using multer.",
    ticketId: ticketIds[14],
    userId: userIds[0],
  },
  {
    content: "We should add file type validation and size limits.",
    ticketId: ticketIds[14],
    userId: userIds[1],
  },
  {
    content: "The image compression is working well with sharp library.",
    ticketId: ticketIds[14],
    userId: userIds[2],
  },
  {
    content: "We should implement cloud storage integration for scalability.",
    ticketId: ticketIds[14],
    userId: userIds[0],
  },
  {
    content: "The drag-and-drop upload interface is user-friendly.",
    ticketId: ticketIds[14],
    userId: userIds[1],
  },
  {
    content: "File preview functionality is now working for images and PDFs.",
    ticketId: ticketIds[14],
    userId: userIds[2],
  },

  // "Add Email Notifications" - 5 comments
  {
    content: "I'll set up nodemailer for sending email notifications.",
    ticketId: ticketIds[15],
    userId: userIds[1],
  },
  {
    content: "The email templates look professional and responsive.",
    ticketId: ticketIds[15],
    userId: userIds[0],
  },
  {
    content: "We should add email preference settings for users.",
    ticketId: ticketIds[15],
    userId: userIds[2],
  },
  {
    content: "The email queue system is working well with Redis.",
    ticketId: ticketIds[15],
    userId: userIds[1],
  },
  {
    content: "Email delivery tracking is now implemented.",
    ticketId: ticketIds[15],
    userId: userIds[0],
  },

  // "Create User Profile Pages" - 4 comments
  {
    content:
      "I'll start with the basic profile layout and user information display.",
    ticketId: ticketIds[16],
    userId: userIds[2],
  },
  {
    content: "The activity timeline is showing user actions chronologically.",
    ticketId: ticketIds[16],
    userId: userIds[0],
  },
  {
    content: "We should add profile picture upload functionality.",
    ticketId: ticketIds[16],
    userId: userIds[1],
  },
  {
    content: "The user statistics and achievements are displaying correctly.",
    ticketId: ticketIds[16],
    userId: userIds[2],
  },

  // "Implement Data Export" - 3 comments
  {
    content: "I'll use a library like exceljs for generating Excel files.",
    ticketId: ticketIds[17],
    userId: userIds[0],
  },
  {
    content: "The CSV export is working well for large datasets.",
    ticketId: ticketIds[17],
    userId: userIds[1],
  },
  {
    content: "We should add export scheduling for regular reports.",
    ticketId: ticketIds[17],
    userId: userIds[2],
  },

  // "Add Advanced Filtering" - 5 comments
  {
    content: "I'll implement filter components with multiple criteria support.",
    ticketId: ticketIds[18],
    userId: userIds[1],
  },
  {
    content: "The date range picker is working well for time-based filtering.",
    ticketId: ticketIds[18],
    userId: userIds[0],
  },
  {
    content: "We should add saved filter presets for common queries.",
    ticketId: ticketIds[18],
    userId: userIds[2],
  },
  {
    content: "The filter UI is intuitive and easy to use.",
    ticketId: ticketIds[18],
    userId: userIds[1],
  },
  {
    content: "Advanced search with boolean operators is now functional.",
    ticketId: ticketIds[18],
    userId: userIds[0],
  },

  // "Create Reporting Dashboard" - 4 comments
  {
    content: "I'll use Chart.js for creating interactive charts and graphs.",
    ticketId: ticketIds[19],
    userId: userIds[2],
  },
  {
    content: "The real-time metrics are updating automatically.",
    ticketId: ticketIds[19],
    userId: userIds[0],
  },
  {
    content: "We should add customizable dashboard widgets.",
    ticketId: ticketIds[19],
    userId: userIds[1],
  },
  {
    content: "The export functionality for reports is working well.",
    ticketId: ticketIds[19],
    userId: userIds[2],
  },

  // "Implement Rate Limiting" - 3 comments
  {
    content: "I'll use express-rate-limit for API rate limiting.",
    ticketId: ticketIds[20],
    userId: userIds[0],
  },
  {
    content:
      "The rate limiting is working well with different tiers for users.",
    ticketId: ticketIds[20],
    userId: userIds[1],
  },
  {
    content: "We should add rate limit monitoring and alerts.",
    ticketId: ticketIds[20],
    userId: userIds[2],
  },

  // "Add Social Login" - 4 comments
  {
    content: "I'll integrate Facebook OAuth using Passport.js.",
    ticketId: ticketIds[21],
    userId: userIds[1],
  },
  {
    content: "Twitter OAuth is now working alongside Facebook login.",
    ticketId: ticketIds[21],
    userId: userIds[0],
  },
  {
    content: "The social login UI is consistent with our design system.",
    ticketId: ticketIds[21],
    userId: userIds[2],
  },
  {
    content: "We should add account linking for existing users.",
    ticketId: ticketIds[21],
    userId: userIds[1],
  },

  // "Create Mobile App" - 5 comments
  {
    content: "I'll use React Native for cross-platform mobile development.",
    ticketId: ticketIds[22],
    userId: userIds[2],
  },
  {
    content: "The iOS app is ready for App Store submission.",
    ticketId: ticketIds[22],
    userId: userIds[0],
  },
  {
    content: "Android app testing is going well on various devices.",
    ticketId: ticketIds[22],
    userId: userIds[1],
  },
  {
    content: "We should add offline functionality for the mobile app.",
    ticketId: ticketIds[22],
    userId: userIds[2],
  },
  {
    content: "The mobile app UI is optimized for touch interactions.",
    ticketId: ticketIds[22],
    userId: userIds[0],
  },

  // "Implement Caching Layer" - 4 comments
  {
    content: "I'll set up Redis for caching frequently accessed data.",
    ticketId: ticketIds[23],
    userId: userIds[0],
  },
  {
    content: "The cache invalidation strategy is working well.",
    ticketId: ticketIds[23],
    userId: userIds[1],
  },
  {
    content: "We should add cache warming for critical data.",
    ticketId: ticketIds[23],
    userId: userIds[2],
  },
  {
    content: "The cache hit rate is above 80% which is excellent.",
    ticketId: ticketIds[23],
    userId: userIds[0],
  },

  // "Add Voice Commands" - 3 comments
  {
    content: "I'll use the Web Speech API for voice command recognition.",
    ticketId: ticketIds[24],
    userId: userIds[1],
  },
  {
    content: "The voice commands are working well for basic navigation.",
    ticketId: ticketIds[24],
    userId: userIds[0],
  },
  {
    content: "We should add voice feedback for better accessibility.",
    ticketId: ticketIds[24],
    userId: userIds[2],
  },

  // "Create Integration API" - 4 comments
  {
    content:
      "I'll design the REST API with proper authentication and documentation.",
    ticketId: ticketIds[25],
    userId: userIds[2],
  },
  {
    content: "The API rate limiting and throttling are implemented.",
    ticketId: ticketIds[25],
    userId: userIds[0],
  },
  {
    content: "We should add webhook support for real-time integrations.",
    ticketId: ticketIds[25],
    userId: userIds[1],
  },
  {
    content: "The API versioning strategy is working well.",
    ticketId: ticketIds[25],
    userId: userIds[2],
  },

  // "Implement Backup System" - 3 comments
  {
    content: "I'll set up automated daily backups to cloud storage.",
    ticketId: ticketIds[26],
    userId: userIds[0],
  },
  {
    content: "The backup verification process is working correctly.",
    ticketId: ticketIds[26],
    userId: userIds[1],
  },
  {
    content: "We should add point-in-time recovery capabilities.",
    ticketId: ticketIds[26],
    userId: userIds[2],
  },

  // "Add Video Conferencing" - 4 comments
  {
    content: "I'll integrate WebRTC for peer-to-peer video conferencing.",
    ticketId: ticketIds[27],
    userId: userIds[1],
  },
  {
    content: "The video quality is excellent with adaptive bitrate.",
    ticketId: ticketIds[27],
    userId: userIds[0],
  },
  {
    content: "We should add screen sharing functionality.",
    ticketId: ticketIds[27],
    userId: userIds[2],
  },
  {
    content: "The conference room management is working well.",
    ticketId: ticketIds[27],
    userId: userIds[1],
  },
];
