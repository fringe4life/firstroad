"use client";

import { LucidePencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/features/comment/types";

type CommentEditButtonProps = {
  comment: Comment;
  onEdit: (commentId: string, content: string) => void;
};

const CommentEditButton = ({ comment, onEdit }: CommentEditButtonProps) => {
  const handleEdit = () => {
    onEdit(comment.id, comment.content);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleEdit}>
      <LucidePencil className="aspect-square w-4" />
    </Button>
  );
};

export default CommentEditButton;
