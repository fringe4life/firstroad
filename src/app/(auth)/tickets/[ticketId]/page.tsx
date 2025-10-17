import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { hasAuth } from "src/lib/auth-helpers";
import Breadcrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getTicketById } from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/path";

export const generateMetadata = async ({
  params,
}: PageProps<"/tickets/[ticketId]">): Promise<Metadata> => {
  const { ticketId } = await params;
  const ticket = await hasAuth((session) => getTicketById(session, ticketId));

  if (!ticket) {
    return {
      title: "Ticket Not Found",
      description: "The requested ticket could not be found.",
    };
  }

  return {
    title: ticket.title,
    description:
      ticket.description || "View ticket details and collaborate with others.",
  };
};

type TicketItemProps = { ticketIdPromise: Promise<{ ticketId: string }> };

const SuspendedTicketItem = async (params: TicketItemProps) => {
  const { ticketId } = await params.ticketIdPromise;
  const ticket = await hasAuth((session) => getTicketById(session, ticketId));
  if (!ticket) {
    notFound();
  }
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath },
          { title: ticket.title },
        ]}
      />
      <Separator />
      <div className="flex justify-center">
        <TicketItem isDetail={true} ticket={ticket} />
      </div>
    </>
  );
};

const Ticket = (props: PageProps<"/tickets/[ticketId]">) => (
  <ViewTransition>
    <SuspendedTicketItem ticketIdPromise={props.params} />
  </ViewTransition>
);

export default Ticket;
