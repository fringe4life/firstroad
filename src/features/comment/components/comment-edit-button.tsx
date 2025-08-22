"use client";

import { Button } from "@/components/ui/button";
import { LucidePencil } from "lucide-react";

type CommentEditButtonProps = {
  comment: {
    id: string;
    content: string;
  };
  onEdit: (commentId: string, content: string) => void;
};

const CommentEditButton = ({ comment, onEdit }: CommentEditButtonProps) => {
  const handleEdit = () => {
    onEdit(comment.id, comment.content);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleEdit}>
      <LucidePencil className="w-4 aspect-square" />
    </Button>
  );
};

export default CommentEditButton;
