import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HasAuthSuspense } from "src/features/auth/components/has-auth";
import Breadcrumbs from "@/components/breadcrumbs";
import { CardCompact } from "@/components/card-compact";
import { isOwner } from "@/features/auth/utils/owner";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import { getAllTicketIds } from "@/features/ticket/queries/get-all-ticket-ids";
import { getTicketById } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";

export async function generateStaticParams() {
  return await getAllTicketIds();
}

export const generateMetadata = async ({
  params,
}: PageProps<"/tickets/[id]/edit">): Promise<Metadata> => {
  const { id } = await params;
  const ticket = await getTicketById(id);

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
};

const TicketEditPage = async ({ params }: PageProps<"/tickets/[id]/edit">) => {
  const { id } = await params;

  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath },
          { title: ticket.title, href: ticketPath(id) },
          { title: "Edit" },
        ]}
      />
      <div className="flex flex-1 flex-col items-center justify-center">
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
      </div>
    </div>
  );
};

export default TicketEditPage;
