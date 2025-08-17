import { getTickets } from "@/features/queries/get-tickets";
import TicketItem from "./ticket-item";

interface TicketListProps {
  userId?: string;
}

const TicketList = async ({ userId }: TicketListProps) => {
  const tickets = await getTickets(userId);
  return (
    <>
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </>
  );
};

export default TicketList;
