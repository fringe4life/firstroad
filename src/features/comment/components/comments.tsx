import { getComments } from "@/features/comment/queries/get-comments";
import CommentItem from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import CommentCreateForm from "@/features/comment/components/comment-create-form";

type CommentsProps = {
    ticketId: string;
}

const Comments = async ({ ticketId }: CommentsProps) => {
  const comments = await getComments(ticketId);
  return (
    <>
    <CardCompact 
      title="Create Comment"
      description="Add a comment to the ticket"
      content={<CommentCreateForm ticketId={ticketId} />}
    />
      <div className="grid gap-y-2">
        {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
  </>
  );
};

export default Comments;