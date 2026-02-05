import { Bug, CircleSlash2 } from "lucide-react";
import { Placeholder } from "@/components/placeholder";
import type { TicketListProps } from "@/features/ticket/types";
import { TicketListItem } from "./ticket-list-item";

const TicketList = ({ tickets }: TicketListProps) => {
  // Handle error state
  if (!tickets) {
    return <Placeholder icon={<Bug />} label="Failed to fetch tickets" />;
  }

  // Handle empty state
  if (tickets.length === 0) {
    return <Placeholder icon={<CircleSlash2 />} label="No tickets found" />;
  }

  return (
    <div className="grid h-full content-start justify-items-center gap-y-4 self-start justify-self-stretch">
      {tickets.map((ticket) => (
        <TicketListItem
          canDeleteTicket={ticket.canDeleteTicket}
          canUpdateTicket={ticket.canUpdateTicket}
          isOwner={ticket.isOwner}
          key={ticket.id}
          ticket={ticket}
        />
      ))}
    </div>
  );
};

export { TicketList };
