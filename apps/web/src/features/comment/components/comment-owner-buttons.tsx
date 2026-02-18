import { AddCommentAttachmentButton } from "@/features/comment/components/add-comment-attachment-button";
import { CommentDeleteButton } from "@/features/comment/components/comment-delete-button";
import { CommentEditButton } from "@/features/comment/components/comment-edit-button";
import type { CommentOwnerButtonsProps } from "@/features/comment/types";

const CommentOwnerButtons = ({
  comment,
  onEdit,
  onDeleteComment,
  createAttachmentAction,
  onClientAttachmentCreated,
  canUpdate = false,
  canDelete = false,
}: CommentOwnerButtonsProps) => (
  <div className="grid gap-1">
    {canUpdate ? <CommentEditButton comment={comment} onEdit={onEdit} /> : null}
    {createAttachmentAction && canUpdate ? (
      <AddCommentAttachmentButton
        commentId={comment.id}
        createAttachmentAction={createAttachmentAction}
        onClientAttachmentCreated={onClientAttachmentCreated}
      />
    ) : null}
    {canDelete ? (
      <CommentDeleteButton id={comment.id} onDeleteComment={onDeleteComment} />
    ) : null}
  </div>
);

export { CommentOwnerButtons };
