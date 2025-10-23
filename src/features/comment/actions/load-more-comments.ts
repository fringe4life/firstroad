"use server";

import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";

export const loadMoreComments = async (ticketId: string, cursor: string) =>
  await getCommentsByTicketId(ticketId, cursor);
