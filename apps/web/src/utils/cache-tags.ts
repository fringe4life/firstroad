// Ticket cache tags
const ticketsCache = (): string => {
  return "tickets";
};

const ticketCache = (slug: string): string => {
  return `ticket-${slug}`;
};

// Comment cache tags
const commentsCache = (): string => {
  return "comments";
};

const commentsForTicketCache = (ticketSlug: string): string => {
  return `comments-${ticketSlug}`;
};

const commentCache = (commentId: string): string => {
  return `comment-${commentId}`;
};

// Attachment cache tags (ticket and comment scoped separately)
const ticketAttachmentsCache = (): string => {
  return "ticket-attachments";
};

const attachmentsForTicketCache = (ticketId: string): string => {
  return `ticket-attachments-${ticketId}`;
};

const commentAttachmentsCache = (): string => {
  return "comment-attachments";
};

const attachmentsForCommentCache = (commentId: string): string => {
  return `comment-attachments-${commentId}`;
};

// Organisation cache tags
const organisationCache = (): string => {
  return "organisations";
};

const organisationsForUserCache = (userId: string): string => {
  return `organisations-${userId}`;
};

// Invitation cache tags
const invitationsForOrganizationCache = (organizationId: string): string => {
  return `invitations-${organizationId}`;
};

export {
  attachmentsForCommentCache,
  attachmentsForTicketCache,
  commentAttachmentsCache,
  invitationsForOrganizationCache,
  organisationCache,
  organisationsForUserCache,
  commentCache,
  commentsCache,
  commentsForTicketCache,
  ticketAttachmentsCache,
  ticketCache,
  ticketsCache,
};
