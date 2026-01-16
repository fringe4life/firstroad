import { LucideMoreVertical, LucidePencil } from "lucide-react";
import Link from "next/link";
import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Button } from "@/components/ui/button";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { isOwner } from "@/features/auth/utils/owner";
import { TicketMoreMenu } from "@/features/ticket/components/ticket-more-menu";
import type { TicketOwnerOptionsProps } from "@/features/ticket/types";
import { ticketEditPath } from "@/path";

const TicketOwnerOptions = ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsProps) => (
  <HasAuthSuspense
    fallback={
      <div className="grid gap-y-1">
        <IconButtonSkeleton />
        {isDetail && <IconButtonSkeleton />}
      </div>
    }
  >
    {(session) => {
      if (!isOwner(session, ticket)) {
        return null;
      }

      const editButton = (
        <Button asChild size="icon" variant="outline">
          <Link href={ticketEditPath(ticket.slug)} prefetch>
            <LucidePencil className="size-4" />
          </Link>
        </Button>
      );

      const moreMenu = isDetail ? (
        <TicketMoreMenu
          ticket={ticket}
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
    }}
  </HasAuthSuspense>
);

export { TicketOwnerOptions };
