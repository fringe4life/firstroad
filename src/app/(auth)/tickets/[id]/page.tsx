import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { loadMoreComments } from "@/features/comment/actions/load-more-comments";
import { upsertComment } from "@/features/comment/actions/upsert-comment";
import Comments from "@/features/comment/components/comments";
import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";
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

const INITIAL_COMMENTS_COUNT = 3;

const TicketDetailPage = async ({ params }: PageProps<"/tickets/[id]">) => {
  const { id } = await params;

  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  // Prerender the first 3 comments
  const commentsData = await getCommentsByTicketId(
    id,
    undefined,
    INITIAL_COMMENTS_COUNT,
  );

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
          <HasAuthSuspense fallback={<div>Loading auth...</div>}>
            {(session) => (
              <Comments
                deleteCommentAction={deleteComment}
                list={commentsData.list}
                loadMoreAction={loadMoreComments}
                metadata={{
                  count: commentsData.list.length,
                  hasNextPage: commentsData.hasMore,
                  nextCursor: commentsData.nextCursor,
                }}
                ticketId={id}
                upsertCommentAction={upsertComment}
                userId={session?.user?.id}
              />
            )}
          </HasAuthSuspense>
        </TicketItem>
      </div>
    </div>
  );
};

export default TicketDetailPage;
