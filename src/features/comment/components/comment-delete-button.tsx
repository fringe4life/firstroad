"use client";

import { Button } from "@/components/ui/button";
import { LucideTrash } from "lucide-react";
import useConfirmDialog from "@/components/confirm-dialog";
import { deleteComment } from "@/features/comment/actions/delete-comment";

type CommentDeleteButtonProps = {
  comment: {
    id: string;
  };
};

const CommentDeleteButton = ({ comment }: CommentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, comment.id),
    trigger: (
      <Button variant="outline" size="icon">
        <LucideTrash className="w-4 aspect-square" />
      </Button>
    ),
    title: "Delete comment",
    description: "Are you sure you want to delete this comment? This action cannot be undone.",
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default CommentDeleteButton;
