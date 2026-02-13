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

  const permission = await getMemberPermission(
    user.id,
    ticket.organizationId,
    "TICKET",
  );
  const canUpdate = permission?.canUpdate ?? false;
  const canDelete = permission?.canDelete ?? false;

  return (
    <TicketActionsMobile
      canCreate={false}
      canDelete={canDelete}
      canUpdate={canUpdate}
      isOwner={true}
      ticket={{ id: ticket.id, slug: ticket.slug, status: ticket.status }}
    />
  );
};

export { TicketDetailActionsMobile };
