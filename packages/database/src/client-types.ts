/**
 * Client-safe enums and row types. No runtime DB client.
 * Use "@firstroad/db/client-types" in client components.
 */

export const TicketStatus = {
  DONE: "DONE",
  IN_PROGRESS: "IN_PROGRESS",
  OPEN: "OPEN",
} as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const MemberRole = {
  admin: "admin",
  member: "member",
  owner: "owner",
} as const;
export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

export const ResourceType = {
  COMMENT: "COMMENT",
  TICKET: "TICKET",
} as const;
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];

export type SortOrder = "asc" | "desc";

export interface TicketModel {
  bounty: number;
  createdAt: string;
  deadline: string;
  description: string;
  id: string;
  organizationId: string;
  slug: string;
  status: TicketStatus;
  title: string;
  updatedAt: string;
  userId: string;
}

export interface CommentModel {
  content: string;
  createdAt: string;
  id: string;
  ticketId: string;
  updatedAt: string;
  userId: string;
}

export interface MemberModel {
  createdAt: string;
  id: string;
  organizationId: string;
  role: MemberRole;
  userId: string;
}

export interface TicketWithUserName extends TicketModel {
  user: { name: string };
}

export interface CommentWithUserName extends CommentModel {
  user: { name: string };
}

export interface TicketListFilter {
  organizationId?: string;
  search?: string;
  sortKey: "bounty" | "createdAt" | "deadline";
  sortValue: SortOrder;
  userId?: string;
}
