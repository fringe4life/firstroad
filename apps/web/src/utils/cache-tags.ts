// Ticket cache tags
const ticketsCache = (): string => "tickets";

const ticketCache = (slug: string): string => `ticket-${slug}`;

// Comment cache tags
const commentsCache = (): string => "comments";

const commentsForTicketCache = (ticketSlug: string): string =>
  `comments-${ticketSlug}`;

const commentCache = (commentId: string): string => `comment-${commentId}`;

// Attachment cache tags (ticket and comment scoped separately)
const ticketAttachmentsCache = (): string => "ticket-attachments";

const attachmentsForTicketCache = (ticketId: string): string =>
  `ticket-attachments-${ticketId}`;

const commentAttachmentsCache = (): string => "comment-attachments";

const attachmentsForCommentCache = (commentId: string): string =>
  `comment-attachments-${commentId}`;

// Organisation cache tags
const organisationCache = (): string => "organisations";

const organisationsForUserCache = (userId: string): string =>
  `organisations-${userId}`;

// Invitation cache tags
const invitationsForOrganizationCache = (organizationId: string): string =>
  `invitations-${organizationId}`;

export {
  attachmentsForCommentCache,
  attachmentsForTicketCache,
  commentAttachmentsCache,
  commentCache,
  commentsCache,
  commentsForTicketCache,
  invitationsForOrganizationCache,
  organisationCache,
  organisationsForUserCache,
  ticketAttachmentsCache,
  ticketCache,
  ticketsCache,
};
