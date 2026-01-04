import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { isOwner } from "@/features/auth/utils/owner";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { ticketPath, ticketsPath } from "@/path";

const EditTicketPage = async ({
  params,
}: PageProps<"/tickets/[slug]/edit">) => {
  const user = await getUserOrRedirect();
  const { slug } = await params;
  const ticket = await getTicketBySlug(slug);
  if (!ticket) {
    throw notFound();
  }
  const ticketIsOwner = isOwner(user, ticket);
  // TODO consider using authInterrupts and the unauthorised route file.
  if (!ticketIsOwner) {
    throw notFound();
  }
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: ticket.title, href: ticketPath(ticket.slug) },
          { title: "Edit" },
        ]}
      />
      <CardCompact
        className="max-content-widest self-center"
        content={
          <TicketUpsertForm ticket={ticket} upsertTicketAction={upsertTicket} />
        }
        description="A new ticket will be created"
        title="Edit Ticket"
      />
    </>
  );
};

export default EditTicketPage;
