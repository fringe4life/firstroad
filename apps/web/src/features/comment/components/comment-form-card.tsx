"use client";

import { CardCompact } from "@/components/card-compact";
import { CommentCreateForm } from "@/features/comment/components/comment-create-form";
import { useComments } from "@/features/comment/components/comments-store";

const CommentFormCard = () => {
  const {
    formRef,
    editingState,
    upsertAction,
    handleCancelEdit,
    handleUpsertSuccess,
    upsertState,
  } = useComments();

  return (
    <CardCompact
      content={
        <div ref={formRef}>
          <CommentCreateForm
            action={upsertAction}
            commentId={editingState.commentId}
            initialContent={editingState.content}
            onCancel={handleCancelEdit}
            onSuccessState={handleUpsertSuccess}
            state={upsertState}
          />
        </div>
      }
      description={
        editingState.commentId
          ? "Update your comment"
          : "Add a comment to the ticket"
      }
      title={editingState.commentId ? "Edit Comment" : "Create Comment"}
    />
  );
};

export { CommentFormCard };
