"use client";

import ConfirmDeleteIcon from "@/components/confirm-delete-icon";
import useConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/features/comment/actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
  onDeleteComment: (commentId: string) => void;
};

const CommentDeleteButton = ({
  id,
  onDeleteComment,
}: CommentDeleteButtonProps) => {
  const [getDeleteButton, deleteDialog, isPending] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: ({ isPending: isPendingArg, onClick }) => (
      <Button
        disabled={isPendingArg}
        onClick={onClick}
        size="icon"
        variant="outline"
      >
        <ConfirmDeleteIcon isPending={isPendingArg} />
      </Button>
    ),
    title: "Delete comment",
    description:
      "Are you sure you want to delete this comment? This action cannot be undone.",
    closeOnSubmit: true, // Close dialog immediately for optimistic updates
    onSuccess: () => {
      onDeleteComment(id);
    },
    onError: () => {
      // Error is handled by the form's onError callback
    },
    onIsPending: () => {
      // Note: We don't need to handle toast management here since it's done in the action
      // This callback is mainly for the cleanup function when component unmounts
    },
  });

  return (
    <>
      {getDeleteButton(isPending)}
      {deleteDialog}
    </>
  );
};

export default CommentDeleteButton;
