import { HasAuthSuspense } from "src/features/auth/components/has-auth";
import { isOwner } from "@/features/auth/utils/owner";
import CommentDeleteButton from "@/features/comment/components/comment-delete-button";
import CommentEditButton from "@/features/comment/components/comment-edit-button";
import type { Comment } from "@/features/comment/types";

type CommentOwnerButtonsProps = {
  comment: Comment;
  onEdit: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
};

const CommentOwnerButtons = ({
  comment,
  onEdit,
  onDeleteComment,
}: CommentOwnerButtonsProps) => (
  <HasAuthSuspense
    fallback={
      <div className="flex flex-col gap-1">
        <button
          className="size-8 rounded border bg-background"
          disabled
          type="button"
        />
        <button
          className="size-8 rounded border bg-background"
          disabled
          type="button"
        />
      </div>
    }
  >
    {(session) => {
      if (!isOwner(session, comment)) {
        return null;
      }

      return (
        <div className="flex flex-col gap-1">
          <CommentEditButton comment={comment} onEdit={onEdit} />
          <CommentDeleteButton
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        </div>
      );
    }}
  </HasAuthSuspense>
);

export default CommentOwnerButtons;
