import { AddCommentAttachmentButton } from "@/features/comment/components/add-comment-attachment-button";
import { CommentDeleteButton } from "@/features/comment/components/comment-delete-button";
import { CommentEditButton } from "@/features/comment/components/comment-edit-button";
import type { CommentOwnerButtonsProps } from "@/features/comment/types";

const CommentOwnerButtons = ({
  comment,
  onEdit,
  onDeleteComment,
  createAttachmentAction,
}: CommentOwnerButtonsProps) => (
  <div className="grid gap-1">
    <CommentEditButton comment={comment} onEdit={onEdit} />
    {createAttachmentAction ? (
      <AddCommentAttachmentButton
        commentId={comment.id}
        createAttachmentAction={createAttachmentAction}
      />
    ) : null}
    <CommentDeleteButton id={comment.id} onDeleteComment={onDeleteComment} />
  </div>
);

export { CommentOwnerButtons };
