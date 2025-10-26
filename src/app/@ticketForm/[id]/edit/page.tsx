import { notFound } from "next/navigation";
import { CardCompact } from "@/components/card-compact";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { isOwner } from "@/features/auth/utils/owner";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { getTicketById } from "@/features/ticket/queries/get-ticket";

const TicketEditFormPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <HasAuthSuspense
      fallback={
        <CardCompact
          className="max-content-widest self-center"
          content={<div>Loading...</div>}
          description="Edit an existing ticket"
          title="Edit Ticket"
        />
      }
    >
      {(session) => {
        if (!isOwner(session, ticket)) {
          notFound();
        }

        return (
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
        );
      }}
    </HasAuthSuspense>
  );
};

export default TicketEditFormPage;
