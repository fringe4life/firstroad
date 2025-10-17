import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { hasAuth } from "src/lib/auth-helpers";
import Breadcrumbs from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { getTicketById } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";

export async function generateMetadata({
  params,
}: PageProps<"/tickets/[ticketId]/edit">): Promise<Metadata> {
  const param = await params;
  const ticket = await hasAuth((session) =>
    getTicketById(session, param.ticketId),
  );

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
  await connection(); // Prevent static generation during build time
  const param = await params;
  const ticket = await hasAuth((session) =>
    getTicketById(session, param.ticketId),
  );

  if (!ticket?.isOwner) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath },
          { title: ticket.title, href: ticketPath(ticket.id) },
          { title: "Edit" },
        ]}
      />
      <Separator />
      <div className="justfy-center flex flex-1 flex-col items-center">
        <CardCompact
          className="w-full max-w-120 self-center"
          content={
            <TicketUpsertForm
              ticket={ticket}
              upsertTicketAction={upsertTicket}
            />
          }
          description="Edit an existing ticket"
          title="Edit Ticket"
        />
      </div>
    </>
  );
};

export default TicketEditPage;
