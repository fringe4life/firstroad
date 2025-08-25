"use client";

import { useState, useRef } from "react";
import CommentItem from "@/features/comment/components/comment-item";
import { CardCompact } from "@/components/card-compact";
import CommentCreateForm from "@/features/comment/components/comment-create-form";
import CommentEditButton from "@/features/comment/components/comment-edit-button";
import CommentDeleteButton from "@/features/comment/components/comment-delete-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { getMoreComments } from "@/features/ticket/queries/get-ticket";
import type { Comment } from "@/features/comment/types";
import type { PaginatedResult } from "@/features/types/pagination";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

type CommentsProps = {
  ticketId: string;
} & PaginatedResult<Comment>;

const Comments = ({ ticketId, list, metadata }: CommentsProps) => {
  const queryKey = ['comments', ticketId];
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getMoreComments(ticketId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [{
        list,
        hasMore: metadata?.hasNextPage ?? false,
        nextCursor: metadata?.nextCursor ?? null,
      }],
      pageParams: [undefined],
    },
  });

  const queryClient = useQueryClient()

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  // Flatten all comments from all pages
  const allComments = data.pages.flatMap(page => page.list);

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

  const deleteAction = () => queryClient.invalidateQueries({queryKey});

  if (error) {
    return <div>Error loading comments: {error.message}</div>;
  }

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
        {allComments.map((comment) => {
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              buttons={
                comment.isOwner ? [
                  <CommentEditButton
                    key="edit"
                    comment={comment}
                    onEdit={handleEdit}
                  />,
                  <CommentDeleteButton 
                    key="delete" 
                    id={comment.id}
                    onDeleteComment={deleteAction}
                  />
                ] : []
              }
            />
          );
        })}
        {isFetchingNextPage && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
        {hasNextPage && (
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full"
            >
              {isFetchingNextPage ? "Loading..." : "Load More Comments"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Comments;