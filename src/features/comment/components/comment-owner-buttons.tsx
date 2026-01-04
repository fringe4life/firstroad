import { CommentDeleteButton } from "@/features/comment/components/comment-delete-button";
import { CommentEditButton } from "@/features/comment/components/comment-edit-button";
import type { Comment } from "@/features/comment/types";
import type { ActionState } from "@/utils/to-action-state";

interface CommentOwnerButtonsProps {
  comment: Comment;
  onEdit: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => Promise<ActionState<string>>;
}

const CommentOwnerButtons = ({
  comment,
  onEdit,
  onDeleteComment,
}: CommentOwnerButtonsProps) => (
  <div className="grid gap-1">
    <CommentEditButton comment={comment} onEdit={onEdit} />
    <CommentDeleteButton id={comment.id} onDeleteComment={onDeleteComment} />
  </div>
);

export { CommentOwnerButtons };
