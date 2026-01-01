import { notFound } from "next/navigation";
import { CardCompact } from "@/components/card-compact";
import { RequireAuthSuspense } from "@/features/auth/components/require-auth";
import { isOwner } from "@/features/auth/utils/owner";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { ticketEditPath } from "@/path";

const TicketEditFormPage = async ({ params }: PageProps<"/[slug]/edit">) => {
  const { slug } = await params;

  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    notFound();
  }

  const editPath = ticketEditPath(slug);

  return (
    <RequireAuthSuspense
      authorize={(user) => isOwner(user, ticket)}
      fallback={
        <CardCompact
          className="max-content-widest self-center"
          content={<div>Loading...</div>}
          description="Edit an existing ticket"
          title="Edit Ticket"
        />
      }
      redirectPath={editPath}
    >
      {() => (
        <CardCompact
          className="max-content-widest self-center"
          content={
            <TicketUpsertForm
              ticket={ticket}
              upsertTicketAction={upsertTicket}
            />
          }
          description="Edit an existing ticket"
          title="Edit Ticket"
        />
      )}
    </RequireAuthSuspense>
  );
};

export default TicketEditFormPage;
