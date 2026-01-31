import { LucideMoreVertical, LucidePencil } from "lucide-react";
import Link from "next/link";
import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Suspend } from "@/components/suspend";
import { Button, buttonVariants } from "@/components/ui/button";
import { getUser } from "@/features/auth/queries/get-user";
import type { User } from "@/features/auth/types";
import { isOwner } from "@/features/auth/utils/owner";
import { getMemberPermission } from "@/features/memberships/queries/get-member-permission";
import { TicketMoreMenu } from "@/features/ticket/components/ticket-more-menu";
import type { TicketOwnerOptionsProps } from "@/features/ticket/types";
import { selectDetailElement } from "@/features/ticket/utils/detail-element";
import { ticketEditPath } from "@/path";

// Inner async component that handles permission fetching
const TicketOwnerOptionsInner = async ({
  ticket,
  isDetail = false,
  user,
}: TicketOwnerOptionsProps & { user: User }) => {
  if (!isOwner(user, ticket)) {
    return null;
  }

  // Fetch the user's permission for this ticket's organization
  const permission = await getMemberPermission(user.id, ticket.organizationId);
  const canDeleteTicket = permission?.canDeleteTicket ?? false;

  const editButton = (
    <Link
      className={buttonVariants({ variant: "outline", size: "icon" })}
      href={ticketEditPath(ticket.slug)}
      prefetch
    >
      <LucidePencil className="aspect-square w-4" />
    </Link>
  );

  const moreMenu = selectDetailElement({
    isDetail,
    element: null,
    elementIfIsDetail: (
      <TicketMoreMenu
        canDeleteTicket={canDeleteTicket}
        ticket={{ id: ticket.id, status: ticket.status }}
        trigger={
          <Button size="icon" variant="outline">
            <LucideMoreVertical className="aspect-square w-4" />
          </Button>
        }
      />
    ),
  });

  return (
    <div className="flex flex-col gap-y-1">
      {editButton}
      {moreMenu}
    </div>
  );
};

// Async wrapper that fetches user and delegates to inner component
const TicketOwnerOptionsAsync = async ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsProps) => {
  const { user } = await getUser();

  if (!user) {
    return null;
  }

  return (
    <TicketOwnerOptionsInner isDetail={isDetail} ticket={ticket} user={user} />
  );
};

const TicketOwnerOptions = ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsProps) => (
  <Suspend
    fallback={
      <div className="grid gap-y-1">
        <IconButtonSkeleton />
        {selectDetailElement({
          isDetail,
          element: null,
          elementIfIsDetail: <IconButtonSkeleton />,
        })}
      </div>
    }
  >
    <TicketOwnerOptionsAsync isDetail={isDetail} ticket={ticket} />
  </Suspend>
);

export { TicketOwnerOptions };
