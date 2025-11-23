import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getAllTicketSlugs } from "@/features/ticket/queries/get-all-ticket-slugs";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";

export const generateStaticParams = async () => await getAllTicketSlugs();

export const generateMetadata = async ({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const ticket = await getTicketBySlug(slug);

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

const TicketDetailPage = async ({ params }: PageProps<"/[slug]">) => {
  const { slug } = await params;

  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    notFound();
  }

  return <TicketItem isDetail={true} ticket={ticket} />;
};

export default TicketDetailPage;
