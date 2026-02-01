import { GenericComponent } from "@/components/generic-component";
import type { TicketListProps } from "@/features/ticket/types";
import { TicketItem } from "./ticket-item";

const TicketList = ({ tickets }: TicketListProps) => {
  return (
    <GenericComponent
      Component={TicketItem}
      className="grid h-full content-start justify-items-center gap-y-4 self-start justify-self-stretch"
      emptyStateMessage="No tickets found"
      errorStateMessage="Failed to fetch tickets"
      items={tickets}
      renderProps={(ticket) => ({
        isDetail: false as const,
        ticket,
        isOwner: ticket.isOwner,
        canDeleteTicket: ticket.canDeleteTicket,
        canUpdateTicket: ticket.canUpdateTicket,
      })}
    />
  );
};

export { TicketList };
