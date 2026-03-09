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
    handleClientAttachmentCreated,
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
        buttons: (() => {
          if (userId !== item.userId) {
            return null;
          }
          // Item may have canUpdate/canDelete from addCommentsAccess (server) or lack them (optimistic/new)
          const canUpdate = item?.canUpdate ?? false;
          const canDelete = item?.canDelete ?? false;
          if (!(canUpdate || canDelete)) {
            return null;
          }
          return (
            <CommentOwnerButtons
              canDelete={canDelete}
              canUpdate={canUpdate}
              comment={{ id: item.id, content: item.content }}
              createAttachmentAction={createAttachmentAction}
              onClientAttachmentCreated={handleClientAttachmentCreated}
              onDeleteComment={handleDelete}
              onEdit={(commentId, content) => handleEdit(commentId, content)}
            />
          );
        })(),
      })}
    />
  );
};

export { CommentList };
