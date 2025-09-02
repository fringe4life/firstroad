import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";

export async function generateMetadata({
  params,
}: PageProps<"/tickets/[ticketId]/edit">): Promise<Metadata> {
  const param = await params;
  const ticket = await getTicket(param.ticketId);

  if (!ticket) {
    return {
      title: "Ticket Not Found",
      description: "The requested ticket could not be found.",
    };
  }

  return {
    title: `Edit ${ticket.title}`,
    description: `Edit ticket: ${ticket.title}`,
  };
}

const TicketEditPage = async ({
  params,
}: PageProps<"/tickets/[ticketId]/edit">) => {
  const param = await params;
  const ticket = await getTicket(param.ticketId);

  if (!ticket || !ticket.isOwner) notFound();

  return (
    <>
      <div className="flex flex-1 flex-col gap-y-8">
        <Breadcrumbs
          breadcrumbs={[
            { title: "Tickets", href: homePath },
            { title: ticket.title, href: ticketPath(ticket.id) as Route },
            { title: "Edit" },
          ]}
        />
      </div>
      <Separator />
      <div className="justfy-center flex flex-1 flex-col items-center">
        <CardCompact
          title="Edit Ticket"
          description="Edit an existing ticket"
          className="w-full max-w-120 animate-fade-from-top self-center"
          content={<TicketUpsertForm ticket={ticket} />}
        />
      </div>
    </>
  );
};

export default TicketEditPage;
