import type { LoadMoreState } from "@/features/comment/actions/load-more-comments";
import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";
import Comments from "./comments";

type CommentsServerProps = {
  ticketId: string;
  loadMoreAction: (ticketId: string, cursor: string) => Promise<LoadMoreState>;
};

const CommentsServer = async ({
  ticketId,
  loadMoreAction,
}: CommentsServerProps) => {
  const commentsData = await getCommentsByTicketId(ticketId);

  return (
    <Comments
      {...commentsData}
      loadMoreAction={loadMoreAction}
      metadata={{
        count: commentsData.list.length,
        hasNextPage: commentsData.hasMore,
      }}
      ticketId={ticketId}
    />
  );
};

export default CommentsServer;
