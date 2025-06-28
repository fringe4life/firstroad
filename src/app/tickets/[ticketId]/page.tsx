import { notFound } from "next/navigation";
import { getTicket } from "@/features/queries/get-ticket";
import TicketItem from "@/features/ticket/ticket-item";

type TicketParams = {
  params: Promise<{
    ticketId: string;
  }>;
};

const Ticket = async ({ params }: TicketParams) => {
  const param = await params;

  const ticket = await getTicket(param.ticketId);

  if (!ticket) notFound();

  return (
    <>
      <div className="flex justify-center animate-fade-from-top">
        <TicketItem ticket={ticket} isDetail={true} />
      </div>
    </>
  );
};

// export async function generateStaticParams() {
//   const tickets = await getTickets();

//   return tickets.map((ticket) => ({
//     ticketId: ticket.id,
//   }));
// }

export default Ticket;
