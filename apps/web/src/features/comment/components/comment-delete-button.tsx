"use client";

import { ConfirmDeleteIcon } from "@/components/confirm-delete-icon";
import { ConfirmDialog } from "@/components/confirm-dialog/index";

import { Button } from "@/components/ui/button";
import type { CommentDeleteButtonProps } from "@/features/comment/types";

const CommentDeleteButton = ({
  id,
  onDeleteComment,
}: CommentDeleteButtonProps) => {
  return (
    <ConfirmDialog
      action={() => onDeleteComment(id)}
      closeOnSubmit
      description="Are you sure you want to delete this comment? This action cannot be undone."
      title="Delete comment"
    >
      {({ isPending }) => (
        <ConfirmDialog.Trigger>
          <Button size="icon" variant="outline">
            <ConfirmDeleteIcon isPending={isPending} />
          </Button>
        </ConfirmDialog.Trigger>
      )}
    </ConfirmDialog>
  );
};

export { CommentDeleteButton };
