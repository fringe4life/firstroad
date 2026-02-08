import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TicketCard } from "@/features/ticket/components/ticket-card";
import { TicketOwnerOptionsContent } from "@/features/ticket/components/ticket-owner-options";
import type { BaseTicket, TicketAccess } from "@/features/ticket/types";
import { ticketPath } from "@/path";

interface TicketListItemProps extends TicketAccess {
  ticket: BaseTicket;
}

/**
 * Ticket component for list views
 * Displays ticket card with link button and owner options
 */
const TicketListItem = ({
  ticket,
  isOwner,
  canDeleteTicket,
  canUpdateTicket,
}: TicketListItemProps) => {
  const { slug, id, status } = ticket;

  return (
    <div className="max-content-narrow self-start justify-self-center">
      <TicketCard
        actions={
          <>
            <Link
              className={buttonVariants({ variant: "outline", size: "icon" })}
              href={ticketPath(slug)}
              prefetch
            >
              <SquareArrowOutUpRight className="aspect-square w-10" />
            </Link>
            <TicketOwnerOptionsContent
              canDeleteTicket={canDeleteTicket}
              canUpdateTicket={canUpdateTicket}
              isDetail={false}
              isOwner={isOwner}
              ticket={{ slug, id, status }}
            />
          </>
        }
        ticket={ticket}
        variant="list"
      />
    </div>
  );
};

export { TicketListItem };
