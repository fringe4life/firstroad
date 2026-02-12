"use client";

import { LucideTrash } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/index";
import { PendingIconButton } from "@/components/pending-icon-button";
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
          <PendingIconButton
            disabled={isPending}
            icon={<LucideTrash />}
            size="icon"
            variant="destructive"
          />
        </ConfirmDialog.Trigger>
      )}
    </ConfirmDialog>
  );
};

export { CommentDeleteButton };
