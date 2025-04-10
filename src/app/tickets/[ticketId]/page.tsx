import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import { Button } from "@/components/ui/button";
import { getTicket } from "@/features/queries/get-ticket";
import TicketItem from "@/features/ticket/components/ticket-item";
import { ticketsPath } from "@/path";

type TicketParams = {
  params: Promise<{
    ticketId: string;
  }>;
};

const Ticket = async ({ params }: TicketParams) => {
  const param = await params;

  const ticket = await getTicket(param.ticketId);

  if (!ticket)
    return (
      <Placeholder
        label="Ticket Not Found"
        button={
          <Button variant="outline">
            <Link href={ticketsPath()}>Go to tickets</Link>
          </Button>
        }
      />
    );
  return (
    <div className="flex justify-center animate-fade-from-top">
      <TicketItem ticket={ticket} isDetail={true} />
    </div>
  );
};

export default Ticket;
