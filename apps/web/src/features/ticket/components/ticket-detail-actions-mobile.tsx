import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { TicketActionsMobile } from "@/features/ticket/components/ticket-actions-mobile";
import type { BaseTicket } from "@/features/ticket/types";
import type { Maybe } from "@/types";

interface TicketDetailActionsMobileProps {
  user: Maybe<User>;
  ticket: Pick<
    BaseTicket,
    "userId" | "slug" | "id" | "status" | "organizationId"
  >;
}

const TicketDetailActionsMobile = async ({
  user,
  ticket,
}: TicketDetailActionsMobileProps) => {
  if (!(user && isOwner(user, { userId: ticket.userId }))) {
    return null;
  }

  const permission = await getMemberPermission(user.id, ticket.organizationId);
  const canUpdateTicket = permission?.canUpdateTicket ?? false;
  const canDeleteTicket = permission?.canDeleteTicket ?? false;

  return (
    <TicketActionsMobile
      canDeleteTicket={canDeleteTicket}
      canUpdateTicket={canUpdateTicket}
      isOwner={true}
      ticket={{ id: ticket.id, slug: ticket.slug, status: ticket.status }}
    />
  );
};

export { TicketDetailActionsMobile };
