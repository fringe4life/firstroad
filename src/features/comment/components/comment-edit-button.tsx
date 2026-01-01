"use client";

import { LucidePencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/features/comment/types";

interface CommentEditButtonProps {
  comment: Comment;
  onEdit: (commentId: string, content: string) => void;
}

const CommentEditButton = ({ comment, onEdit }: CommentEditButtonProps) => {
  const handleEdit = () => {
    onEdit(comment.id, comment.content);
  };

  return (
    <Button onClick={handleEdit} size="icon" variant="outline">
      <LucidePencil className="aspect-square w-4" />
    </Button>
  );
};

export { CommentEditButton };
