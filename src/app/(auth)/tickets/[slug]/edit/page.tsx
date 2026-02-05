import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { itemWithOwnership } from "@/features/auth/dto/item-with-ownership";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { ticketPath, ticketsPath } from "@/path";

const EditTicketPage = async ({
  params,
}: PageProps<"/tickets/[slug]/edit">) => {
  const user = await getUserOrRedirect();
  const { slug } = await params;
  const ticket = await itemWithOwnership(getTicketBySlug(slug), user);
  // TODO: add ticket fine grained permissions check
  if (!ticket?.isOwner) {
    throw notFound();
  }

  return (
    <div className="grid h-full grid-rows-[min-content_1fr] gap-y-4">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: ticketsPath() },
          { title: ticket.title, href: ticketPath(ticket.slug) },
          { title: "Edit" },
        ]}
      />
      <CardCompact
        className="max-content-widest place-self-center"
        content={
          <TicketUpsertForm ticket={ticket} upsertTicketAction={upsertTicket} />
        }
        description="A new ticket will be created"
        title="Edit Ticket"
      />
    </div>
  );
};

export default EditTicketPage;
