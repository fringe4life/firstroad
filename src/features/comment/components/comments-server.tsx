import { connection } from "next/server";
import { getCommentsByTicketId } from "@/features/comment/queries/get-comments";
import Comments from "./comments";

type CommentsServerProps = {
  ticketId: string;
};

const CommentsServer = async ({ ticketId }: CommentsServerProps) => {
  await connection();
  const commentsData = await getCommentsByTicketId(ticketId);

  return (
    <Comments
      {...commentsData}
      loadMore={async (cursor: string) =>
        await getCommentsByTicketId(ticketId, cursor)
      }
      metadata={{
        count: commentsData.list.length,
        hasNextPage: commentsData.hasMore,
      }}
      ticketId={ticketId}
    />
  );
};

export default CommentsServer;
