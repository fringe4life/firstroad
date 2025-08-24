"use client";

import { Button } from "@/components/ui/button";
import { LucideTrash, LucideLoaderCircle } from "lucide-react";
import useConfirmDialog from "@/components/confirm-dialog";
import { ActionState } from "@/features/utils/to-action-state";

type CommentDeleteButtonProps = {
  deleteAction: () => Promise<ActionState>;
};

const CommentDeleteButton = ({ deleteAction }: CommentDeleteButtonProps) => {
  console.log("🔄 CommentDeleteButton rendered");

  const [getDeleteButton, deleteDialog, isPending] = useConfirmDialog({
    action: deleteAction,
    trigger: (isPending: boolean) => (
      <Button variant="outline" size="icon" disabled={isPending}>
        {isPending ? (
          <LucideLoaderCircle className="w-4 aspect-square animate-spin" />
        ) : (
          <LucideTrash className="w-4 aspect-square" />
        )}
      </Button>
    ),
    title: "Delete comment",
    description: "Are you sure you want to delete this comment? This action cannot be undone.",
    closeOnSubmit: true, // Close dialog immediately for optimistic updates
    onSuccess: () => {
      console.log("✅ onSuccess called - dialog should close");
    },
    onError: (result) => {
      console.log("❌ onError called with result:", result);
    },
    onIsPending: (isPending) => {
      console.log("⏳ CommentDeleteButton - onIsPending called with:", isPending);
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
