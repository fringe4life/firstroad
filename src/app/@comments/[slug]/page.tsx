import { notFound } from "next/navigation";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { deleteComment } from "@/features/comment/actions/delete-comment";
import { upsertComment } from "@/features/comment/actions/upsert-comment";
import Comments from "@/features/comment/components/comments";
import { getCommentsByTicketId } from "@/features/comment/dal/get-comments";
import { getTicketBySlug } from "@/features/ticket/queries/get-ticket";

const INITIAL_COMMENTS_COUNT = 3;

const CommentsPage = async ({ params }: PageProps<"/[slug]">) => {
  const { slug } = await params;

  const ticket = await getTicketBySlug(slug);

  if (!ticket) {
    notFound();
  }

  // Prerender the first 3 comments
  const { list, metadata } = await getCommentsByTicketId(
    ticket.id,
    undefined,
    INITIAL_COMMENTS_COUNT,
  );

  return (
    <HasAuthSuspense fallback={<div>Loading auth...</div>}>
      {(user) => (
        <Comments
          deleteCommentAction={deleteComment}
          list={list}
          loadMoreAction={getCommentsByTicketId}
          metadata={{ ...metadata }}
          ticketId={ticket.id}
          upsertCommentAction={upsertComment}
          userId={user?.id}
        />
      )}
    </HasAuthSuspense>
  );
};

export default CommentsPage;
