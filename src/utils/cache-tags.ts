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

// Session cache tag
const sessionCache = (): string => {
  return "session";
};

export {
  ticketsCache,
  ticketCache,
  commentsCache,
  commentsForTicketCache,
  commentCache,
  sessionCache,
};
