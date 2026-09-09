import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { itemWithPermissions } from "@/features/auth/dto/item-with-permissions";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { ticketPath, ticketsPath } from "@/path";

const EditTicketPage = async ({
  params,
}: PageProps<"/tickets/[slug]/edit">) => {
  // react-doctor-disable-next-line
  await connection();
  const user = await getUserOrRedirect();
  // react-doctor-disable-next-line
  const { slug } = await params;
  const ticket = await itemWithPermissions(
    getTicketBySlug(slug),
    user,
    "TICKET",
  );

  if (!ticket?.canUpdate) {
    throw notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { href: ticketsPath(), title: "Tickets" },
          { href: ticketPath(ticket.slug), title: ticket.title },
          { title: "Edit" },
        ]}
      />
      <CardCompact
        className="max-content-widest place-self-center"
        content={
          <TicketUpsertForm ticket={ticket} upsertTicketAction={upsertTicket} />
        }
        description="Edit your ticket"
        title="Edit Ticket"
      />
    </>
  );
};

export default EditTicketPage;
