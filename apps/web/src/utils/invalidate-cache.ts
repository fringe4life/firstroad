import { updateTag } from "next/cache";
import {
  attachmentCache,
  attachmentsForTicketCache,
  commentCache,
  commentsCache,
  commentsForTicketCache,
  invitationsForOrganizationCache,
  organisationCache,
  organisationsForUserCache,
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

// Attachment invalidation
const invalidateAttachmentsForTicket = (ticketId: string): void => {
  updateTag(attachmentCache());
  updateTag(attachmentsForTicketCache(ticketId));
};

// Combined invalidation
const invalidateTicketWithComments = (slug: string, ticketId: string): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(slug));
  updateTag(commentsCache());
  updateTag(commentsForTicketCache(ticketId));
};

const invalidateTicketAndAttachments = (
  slug: string,
  ticketId: string,
): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(slug));
  updateTag(attachmentCache());
  updateTag(attachmentsForTicketCache(ticketId));
};

// Organisation invalidation
const invalidateOrganisationsForUser = (userId: string): void => {
  updateTag(organisationCache());
  updateTag(organisationsForUserCache(userId));
};

// Invitation invalidation
const invalidateInvitationsForOrganization = (organizationId: string): void => {
  updateTag(invitationsForOrganizationCache(organizationId));
};

export {
  invalidateAttachmentsForTicket,
  invalidateComment,
  invalidateCommentAndTicketComments,
  invalidateComments,
  invalidateCommentsForTicket,
  invalidateInvitationsForOrganization,
  invalidateTicket,
  invalidateTicketAndAttachments,
  invalidateTicketAndList,
  invalidateTicketWithComments,
  invalidateOrganisationsForUser,
  invalidateTickets,
};
