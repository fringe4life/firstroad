import { updateTag } from "next/cache";
import {
  commentCache,
  commentsCache,
  commentsForTicketCache,
  ticketCache,
  ticketsCache,
} from "./cache-tags";

// Ticket invalidation
const invalidateTickets = (): void => {
  updateTag(ticketsCache());
};

const invalidateTicket = (slug: string): void => {
  updateTag(ticketCache(slug));
};

const invalidateTicketAndList = (slug: string): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(slug));
};

// Comment invalidation
const invalidateComments = (): void => {
  updateTag(commentsCache());
};

const invalidateCommentsForTicket = (ticketId: string): void => {
  updateTag(commentsCache());
  updateTag(commentsForTicketCache(ticketId));
};

const invalidateComment = (commentId: string): void => {
  updateTag(commentCache(commentId));
};

const invalidateCommentAndTicketComments = (
  commentId: string,
  ticketId: string,
  ticketSlug: string,
): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(ticketSlug));
  updateTag(commentsCache());
  updateTag(commentsForTicketCache(ticketId));
  updateTag(commentCache(commentId));
};

// Combined invalidation
const invalidateTicketWithComments = (slug: string, ticketId: string): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(slug));
  updateTag(commentsCache());
  updateTag(commentsForTicketCache(ticketId));
};

export {
  invalidateTickets,
  invalidateTicket,
  invalidateTicketAndList,
  invalidateComments,
  invalidateCommentsForTicket,
  invalidateComment,
  invalidateCommentAndTicketComments,
  invalidateTicketWithComments,
};
