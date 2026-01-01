import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/path";

const BreadcrumbsPage = async ({ params }: PageProps<"/[slug]">) => {
  const { slug } = await params;

  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    notFound();
  }

  return (
    <Breadcrumbs
      breadcrumbs={[
        { title: "Tickets", href: homePath },
        { title: ticket.title },
      ]}
    />
  );
};
export default BreadcrumbsPage;
