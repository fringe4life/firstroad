import { LucideMoreVertical, LucidePencil } from "lucide-react";
import Link from "next/link";
import { IconButtonSkeleton } from "@/components/skeletons/icon-button-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { isOwner } from "@/features/auth/utils/owner";
import { TicketMoreMenu } from "@/features/ticket/components/ticket-more-menu";
import type { TicketOwnerOptionsProps } from "@/features/ticket/types";
import { selectDetailElement } from "@/features/ticket/utils/detail-element";
import { ticketEditPath } from "@/path";

const TicketOwnerOptions = ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsProps) => (
  <HasAuthSuspense
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
    {(user) => {
      if (!isOwner(user, ticket)) {
        return null;
      }

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
    }}
  </HasAuthSuspense>
);

export { TicketOwnerOptions };
