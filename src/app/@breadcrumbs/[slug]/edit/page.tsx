import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/path";

const BreadcrumbsEditPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    notFound();
  }

  return (
    <Breadcrumbs
      breadcrumbs={[
        { title: "Tickets", href: homePath },
        { title: ticket.title, href: ticketPath(ticket.slug) },
        { title: "Edit" },
      ]}
    />
  );
};

export default BreadcrumbsEditPage;
