import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { TicketActionsDesktop } from "@/features/ticket/components/ticket-actions-desktop";
import { TicketActionsMobile } from "@/features/ticket/components/ticket-actions-mobile";
import type { BaseTicket } from "@/features/ticket/types";
import type { Maybe } from "@/types";

interface TicketDetailActionsProps {
  ticket: Pick<
    BaseTicket,
    "userId" | "slug" | "id" | "status" | "organizationId"
  >;
  user: Maybe<User>;
  variant: "desktop" | "mobile";
}

const TicketDetailActions = async ({
  user,
  ticket,
  variant,
}: TicketDetailActionsProps) => {
  if (!(user && isOwner(user, { userId: ticket.userId }))) {
    return null;
  }

  const permission = await getMemberPermission(
    user.id,
    ticket.organizationId,
    "TICKET",
  );
  const canUpdate = permission?.canUpdate ?? false;
  const canDelete = permission?.canDelete ?? false;

  switch (variant) {
    case "desktop":
      return (
        <TicketActionsDesktop
          canDelete={canDelete}
          canUpdate={canUpdate}
          isOwner={true}
          ticket={{ id: ticket.id, slug: ticket.slug, status: ticket.status }}
          variant="detail"
        />
      );
    case "mobile":
      return (
        <TicketActionsMobile
          canDelete={canDelete}
          canUpdate={canUpdate}
          isOwner={true}
          ticket={{ id: ticket.id, slug: ticket.slug, status: ticket.status }}
        />
      );
    default:
      throw new Error(`Invalid variant: ${variant}`) as never;
  }
};

export { TicketDetailActions };
