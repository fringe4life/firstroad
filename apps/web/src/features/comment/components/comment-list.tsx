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

  const renderProps = (item: (typeof optimisticComments)[number]) => {
    let buttons: React.ReactNode = null;
    if (userId === item.userId) {
      // Item may have canUpdate/canDelete from addCommentsAccess (server) or lack them (optimistic/new)
      const canUpdate = item?.canUpdate ?? false;
      const canDelete = item?.canDelete ?? false;
      if (canUpdate || canDelete) {
        buttons = (
          <CommentOwnerButtons
            canDelete={canDelete}
            canUpdate={canUpdate}
            comment={{ content: item.content, id: item.id }}
            createAttachmentAction={createAttachmentAction}
            onClientAttachmentCreated={handleClientAttachmentCreated}
            onDeleteComment={handleDelete}
            onEdit={handleEdit}
          />
        );
      }
    }

    return {
      buttons,
      comment: item,
    };
  };

  return (
    <GenericComponent
      Component={CommentItem}
      className="grid content-start gap-y-2"
      emptyStateMessage="No comments found"
      errorStateMessage="Failed to fetch comments"
      items={optimisticComments}
      renderProps={renderProps}
    />
  );
};

export { CommentList };
