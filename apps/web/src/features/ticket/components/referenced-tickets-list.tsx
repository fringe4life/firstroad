import { CardCompact } from "@/components/card-compact";
import { Placeholder } from "@/components/placeholder";
import type { ReferencedTicketsProps } from "../types";
import { ReferencedTicketItem } from "./referenced-ticket-item";

const ReferencedTickets = ({ referencedTickets }: ReferencedTicketsProps) => {
  if (!referencedTickets || referencedTickets.length === 0) {
    return <Placeholder label="No referenced tickets found" />;
  }

  return (
    <CardCompact
      content={
        <div className="mx-2 mb-4">
          {referencedTickets.map((referencedTicket) => (
            <ReferencedTicketItem
              key={referencedTicket.slug}
              referencedTicket={referencedTicket}
            />
          ))}
        </div>
      }
      description="Tickets that have been referenced in comments"
      title="Referenced Tickets"
    />
  );
};

export { ReferencedTickets };
