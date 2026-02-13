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
import type {
  TicketOwnerOptionsFetchProps,
  TicketOwnerOptionsWithAccessProps,
} from "@/features/ticket/types";
import { ticketEditPath } from "@/path";

/**
 * Pure presentational component - used when access is pre-computed (list pages)
 */
const TicketOwnerOptionsContent = ({
  ticket,
  isDetail = false,
  isOwner: ticketIsOwner,
  canDelete,
  canUpdate,
}: TicketOwnerOptionsWithAccessProps) => {
  if (!ticketIsOwner) {
    return null;
  }

  const editButton = canUpdate ? (
    <Link
      className={buttonVariants({ variant: "outline", size: "icon" })}
      href={ticketEditPath(ticket.slug)}
      prefetch
    >
      <LucidePencil className="aspect-square w-4" />
    </Link>
  ) : null;

  const moreMenu = isDetail ? (
    <TicketMoreMenu
      canDelete={canDelete}
      canUpdate={canUpdate}
      ticket={{ id: ticket.id, status: ticket.status }}
      trigger={
        <Button size="icon" variant="outline">
          <LucideMoreVertical className="aspect-square w-4" />
        </Button>
      }
    />
  ) : null;

  return (
    <div className="flex flex-col gap-y-1">
      {editButton}
      {moreMenu}
    </div>
  );
};

/**
 * Async component that fetches access - used for detail pages
 */
const TicketOwnerOptionsFetchInner = async ({
  ticket,
  isDetail = false,
  user,
}: TicketOwnerOptionsFetchProps & { user: User }) => {
  if (!isOwner(user, ticket)) {
    return null;
  }

  // Fetch the user's permission for this ticket's organization
  const permission = await getMemberPermission(
    user.id,
    ticket.organizationId,
    "TICKET",
  );
  const canDelete = permission?.canDelete ?? false;
  const canUpdate = permission?.canUpdate ?? false;

  return (
    <TicketOwnerOptionsContent
      canCreate={false}
      canDelete={canDelete}
      canUpdate={canUpdate}
      isDetail={isDetail}
      isOwner={true}
      ticket={ticket}
    />
  );
};

/**
 * Async wrapper that fetches user and delegates to inner component
 */
const TicketOwnerOptionsFetchAsync = async ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsFetchProps) => {
  const { user } = await getUser();

  if (!user) {
    return null;
  }

  return (
    <TicketOwnerOptionsFetchInner
      isDetail={isDetail}
      ticket={ticket}
      user={user}
    />
  );
};

/**
 * Suspense wrapper for fetching access (detail pages)
 */
const TicketOwnerOptionsFetch = ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsFetchProps) => (
  <Suspend
    fallback={
      <div className="grid gap-y-1">
        <IconButtonSkeleton />
        {isDetail && <IconButtonSkeleton />}
      </div>
    }
  >
    <TicketOwnerOptionsFetchAsync isDetail={isDetail} ticket={ticket} />
  </Suspend>
);

export { TicketOwnerOptionsContent, TicketOwnerOptionsFetch };
