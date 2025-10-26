import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { getAllTicketSlugs } from "@/features/ticket/queries/get-all-ticket-slugs";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";

export async function generateStaticParams() {
  return await getAllTicketSlugs();
}

export const generateMetadata = async ({
  params,
}: PageProps<"/[slug]/edit">): Promise<Metadata> => {
  const { slug } = await params;
  const ticket = await getTicketBySlug(slug);

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

const TicketEditPage = async ({ params }: PageProps<"/[slug]/edit">) => {
  const { slug } = await params;

  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="grid gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath },
          { title: ticket.title, href: ticketPath(slug) },
          { title: "Edit" },
        ]}
      />
    </div>
  );
};

export default TicketEditPage;
