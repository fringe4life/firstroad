import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import type { User } from "@/features/auth/types";
import { findComment } from "@/features/comment/queries/find-comment";
import type { ResourceType } from "@/features/memberships/types";
import { findTicket } from "@/features/ticket/queries/find-ticket";
import type { Maybe } from "@/types";
import type { VerifiableItem } from "../types";

const getVerifiableItem = async (
  resourceType: ResourceType,
  ownerId: string,
  user: User,
): Promise<Maybe<VerifiableItem>> => {
  switch (resourceType) {
    case "TICKET": {
      const ticket = await itemWithOwnership(findTicket(ownerId), user);
      if (!ticket) {
        return null;
      }
      return {
        organizationId: ticket.organizationId,
        ownerId,
        ownerLabel: "ticket",
        isOwner: ticket.isOwner,
        resourceType: "TICKET",
        slug: ticket.slug,
      };
    }
    case "COMMENT": {
      const comment = await itemWithOwnership(findComment(ownerId), user);
      if (!comment) {
        return null;
      }
      return {
        organizationId: comment.organizationId,
        ownerId,
        ownerLabel: "comment",
        isOwner: comment.isOwner,
        commentId: comment.id,
        resourceType: "COMMENT",
      };
    }
    default:
      return null;
  }
};

export { getVerifiableItem };
