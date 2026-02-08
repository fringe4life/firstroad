"use client";

import { LucidePencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CommentEditButtonProps } from "@/features/comment/types";

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
