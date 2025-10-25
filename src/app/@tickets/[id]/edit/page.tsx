import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { getAllTicketIds } from "@/features/ticket/queries/get-all-ticket-ids";
import { getTicketById } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";

export async function generateStaticParams() {
  return await getAllTicketIds();
}

export const generateMetadata = async ({
  params,
}: PageProps<"/[id]/edit">): Promise<Metadata> => {
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

const TicketEditPage = async ({ params }: PageProps<"/[id]/edit">) => {
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
    </div>
  );
};

export default TicketEditPage;
