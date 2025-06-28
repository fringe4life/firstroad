import { notFound } from "next/navigation";
import { CardCompact } from "@/components/card-compact";
import { getTicket } from "@/features/queries/get-ticket";
import TicketUpsertForm from "@/features/ticket/ticket-upsert-form";

type TicketEditPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
  const param = await params;
  const ticket = await getTicket(param.ticketId);
  console.log(ticket);

  if (!ticket) notFound();
  return (
    <div className="flex-1 flex flex-col justfy-center items-center">
      <CardCompact
        title="Edit Ticket"
        description="Edit an existing ticket"
        className="w-full max-w-120 self-center animate-fade-from-top"
        content={<TicketUpsertForm ticket={ticket} />}
      />
    </div>
  );
};

export default TicketEditPage;
