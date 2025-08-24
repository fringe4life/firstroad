"use client";

import { useState, useRef } from "react";
import CommentItem from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import CommentCreateForm from "@/features/comment/components/comment-create-form";
import CommentEditButton from "@/features/comment/components/comment-edit-button";
import CommentDeleteButton from "@/features/comment/components/comment-delete-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PaginationMetadata } from "@/features/types/pagination";
import { getMoreComments } from "@/features/ticket/queries/get-ticket";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  ticketId: string;
  isOwner: boolean;
  isDeleting?: boolean;
  userInfo?: {
    userId: string;
    user: {
      name: string | null;
    };
  } | null;
};



type CommentsProps = {
    ticketId: string;
    comments: Comment[];
    commentMetadata?: PaginationMetadata;
}

const CommentSkeleton = () => (
  <div className="flex gap-2">
    <div className="w-full max-w-105">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

const Comments = ({ ticketId, comments: initialComments, commentMetadata }: CommentsProps) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [hasMore, setHasMore] = useState(commentMetadata?.hasNextPage ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(3);
  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };



  const createOptimisticDeleteAction = (commentId: string) => {
    return async () => {
      console.log("🎯 createOptimisticDeleteAction - Starting action for commentId:", commentId);
      
      // Optimistically update the UI
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, isDeleting: true }
          : comment
      ));
      
      // Show loading toast
      const loadingToastId = toast.loading('Deleting comment...');
      
      try {
        // Call the server action
        const { deleteComment } = await import('@/features/comment/actions/delete-comment');
        console.log("🎯 createOptimisticDeleteAction - Calling deleteComment");
        const result = await deleteComment(commentId);
        console.log("🎯 createOptimisticDeleteAction - deleteComment result:", result);
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        if (result.status === 'SUCCESS') {
          toast.success('Comment deleted successfully');
          // Remove the comment from the list
          setComments(prev => prev.filter(comment => comment.id !== commentId));
        } else {
          toast.error(result.message || 'Failed to delete comment');
          // Revert optimistic update on error
          setComments(prev => prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, isDeleting: false }
              : comment
          ));
        }
        
        return result;
      } catch (error) {
        console.error('Failed to delete comment:', error);
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        toast.error('Failed to delete comment');
        // Revert optimistic update on error
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, isDeleting: false }
            : comment
        ));
        throw error;
      }
    };
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const result = await getMoreComments(ticketId, skip);
      // Add new comments to the state
      setComments(prev => [...prev, ...result.comments]);
      setHasMore(result.hasMore);
      setSkip(prev => prev + 3);
    } catch (error) {
      console.error('Failed to load more comments:', error);
    } finally {
      setIsLoading(false);
    }
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
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              buttons={
                comment.isOwner && !comment.isDeleting ? [
                  <CommentEditButton
                    key="edit"
                    comment={comment}
                    onEdit={handleEdit}
                  />,
                  <CommentDeleteButton 
                    key="delete" 
                    deleteAction={createOptimisticDeleteAction(comment.id)}
                  />
                ] : []
              }
            />
          );
        })}
        {isLoading && (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        )}
        {hasMore && (
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Loading..." : "Load More Comments"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Comments;