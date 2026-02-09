"use client";

import { GenericComponent } from "@/components/generic-component";
import { CommentItem } from "@/features/comment/components/comment-item";
import { CommentOwnerButtons } from "@/features/comment/components/comment-owner-buttons";
import { useComments } from "@/features/comment/components/comments-store";

const CommentList = () => {
  const {
    optimisticComments,
    userId,
    handleDelete,
    handleEdit,
    createAttachmentAction,
  } = useComments();

  return (
    <GenericComponent
      Component={CommentItem}
      className="grid gap-y-2"
      emptyStateMessage="No comments found"
      errorStateMessage="Failed to fetch comments"
      items={optimisticComments}
      renderProps={(item) => ({
        comment: item,
        buttons:
          userId === item.userId ? (
            <CommentOwnerButtons
              comment={{ id: item.id, content: item.content }}
              createAttachmentAction={createAttachmentAction}
              onDeleteComment={handleDelete}
              onEdit={(commentId, content) => handleEdit(commentId, content)}
            />
          ) : null,
      })}
    />
  );
};

export { CommentList };
