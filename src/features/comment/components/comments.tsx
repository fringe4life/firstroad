"use client";

import { useState, useRef } from "react";
import { getComments } from "@/features/comment/queries/get-comments";
import CommentItem from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import CommentCreateForm from "@/features/comment/components/comment-create-form";
import CommentEditButton from "@/features/comment/components/comment-edit-button";
import CommentDeleteButton from "@/features/comment/components/comment-delete-button";
import { useSession } from "next-auth/react";
import { isOwner } from "@/features/auth/utils/owner";

type CommentsProps = {
    ticketId: string;
    comments: Awaited<ReturnType<typeof getComments>>;
}

const Comments = ({ ticketId, comments }: CommentsProps) => {
  const { data: session } = useSession();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    // Scroll to the form using ref
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  return (
    <>
      <CardCompact 
        title={editingCommentId ? "Edit Comment" : "Create Comment"}
        description={editingCommentId ? "Update your comment" : "Add a comment to the ticket"}
        content={
          <div ref={formRef}>
            <CommentCreateForm 
              ticketId={ticketId} 
              commentId={editingCommentId || undefined}
              initialContent={editingContent}
              onCancel={handleCancelEdit}
            />
          </div>
        }
      />
      <div className="grid gap-y-2">
        {comments.map((comment) => {
          const isCommentOwner = isOwner(session, comment);
          
          return (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              buttons={
                isCommentOwner ? [
                  <CommentEditButton
                    key="edit"
                    comment={comment}
                    onEdit={handleEdit}
                  />,
                  <CommentDeleteButton key="delete" comment={comment} />
                ] : []
              }
            />
          );
        })}
      </div>
    </>
  );
};

export default Comments;