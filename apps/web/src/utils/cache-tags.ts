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

const commentsForTicketCache = (ticketId: string): string => {
  return `comments-${ticketId}`;
};

const commentCache = (commentId: string): string => {
  return `comment-${commentId}`;
};

// Attachment cache tags
const attachmentCache = (): string => {
  return "attachments";
};

const attachmentsForTicketCache = (ticketId: string): string => {
  return `attachments-${ticketId}`;
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
  attachmentCache,
  attachmentsForTicketCache,
  invitationsForOrganizationCache,
  organisationCache,
  organisationsForUserCache,
  commentCache,
  commentsCache,
  commentsForTicketCache,
  ticketCache,
  ticketsCache,
};
