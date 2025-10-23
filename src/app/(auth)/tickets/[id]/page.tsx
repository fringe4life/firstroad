import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { loadMoreComments } from "@/features/comment/actions/load-more-comments";
import CommentsServer from "@/features/comment/components/comments-server";
import TicketItem from "@/features/ticket/components/ticket-item";
import { getAllTicketIds } from "@/features/ticket/queries/get-all-ticket-ids";
import { getTicketById } from "@/features/ticket/queries/get-ticket";
import { homePath } from "@/path";

export async function generateStaticParams() {
  return await getAllTicketIds();
}

export const generateMetadata = async ({
  params,
}: PageProps<"/tickets/[id]">): Promise<Metadata> => {
  const { id } = await params;
  const ticket = await getTicketById(id);

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

const TicketDetailPage = async ({ params }: PageProps<"/tickets/[id]">) => {
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
          { title: ticket.title },
        ]}
      />
      <div className="flex justify-center">
        <TicketItem ticket={ticket}>
          <Suspense fallback={<div>Loading comments...</div>}>
            <CommentsServer
              loadMoreAction={loadMoreComments}
              ticketId={ticket.id}
            />
          </Suspense>
        </TicketItem>
      </div>
    </div>
  );
};

export default TicketDetailPage;
