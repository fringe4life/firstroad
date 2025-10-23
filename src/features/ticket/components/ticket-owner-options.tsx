import { LucidePencil } from "lucide-react";
import Link from "next/link";
import { HasAuthSuspense } from "src/features/auth/components/has-auth";
import { Button } from "@/components/ui/button";
import { isOwner } from "@/features/auth/utils/owner";
import TicketMoreMenu from "@/features/ticket/components/ticket-more-menu";
import type { BaseTicket } from "@/features/ticket/types";
import { ticketEditPath } from "@/path";

type TicketOwnerOptionsProps = {
  ticket: BaseTicket;
  isDetail?: boolean;
};

const TicketOwnerOptions = ({
  ticket,
  isDetail = false,
}: TicketOwnerOptionsProps) => (
  <HasAuthSuspense
    fallback={
      <div className="flex flex-col gap-y-1">
        <Button disabled size="icon" variant="outline">
          <LucidePencil className="size-4" />
        </Button>
        {isDetail && (
          <Button disabled size="icon" variant="outline">
            <div className="size-4" />
          </Button>
        )}
      </div>
    }
  >
    {(session) => {
      if (!isOwner(session, ticket)) {
        return null;
      }

      const editButton = (
        <Button asChild size="icon" variant="outline">
          <Link href={ticketEditPath(ticket.id)} prefetch>
            <LucidePencil className="size-4" />
          </Link>
        </Button>
      );

      const moreMenu = isDetail ? (
        <TicketMoreMenu
          ticket={ticket}
          trigger={
            <Button size="icon" variant="outline">
              <div className="size-4" />
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

export default TicketOwnerOptions;
