import { updateTag } from "next/cache";
import {
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

const invalidateCommentsForTicket = (ticketSlug: string): void => {
  updateTag(commentsCache());
  updateTag(commentsForTicketCache(ticketSlug));
};

const invalidateComment = (commentId: string): void => {
  updateTag(commentCache(commentId));
};

// Attachment invalidation (ticket and comment scoped separately)
const invalidateAttachmentsForTicket = (ticketId: string): void => {
  updateTag(ticketAttachmentsCache());
  updateTag(attachmentsForTicketCache(ticketId));
};

const invalidateAttachmentsForComment = (commentId: string): void => {
  updateTag(commentAttachmentsCache());
  updateTag(attachmentsForCommentCache(commentId));
};

// Combined invalidation
const invalidateTicketWithComments = (
  slug: string,
  _ticketId: string,
): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(slug));
  updateTag(commentsCache());
  updateTag(commentsForTicketCache(slug));
};

const invalidateTicketAndAttachments = (
  slug: string,
  ticketId: string,
): void => {
  updateTag(ticketsCache());
  updateTag(ticketCache(slug));
  updateTag(ticketAttachmentsCache());
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
  invalidateAttachmentsForComment,
  invalidateAttachmentsForTicket,
  invalidateComment,
  invalidateComments,
  invalidateCommentsForTicket,
  invalidateInvitationsForOrganization,
  invalidateOrganisationsForUser,
  invalidateTicket,
  invalidateTicketAndAttachments,
  invalidateTicketAndList,
  invalidateTickets,
  invalidateTicketWithComments,
};
