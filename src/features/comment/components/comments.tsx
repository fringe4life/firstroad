"use client";

import { useRouter } from "next/navigation";
import { Activity, useRef, useState, useTransition } from "react";
import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CommentCreateForm from "@/features/comment/components/comment-create-form";
import CommentItem from "@/features/comment/components/comment-item";
import CommentOwnerButtons from "@/features/comment/components/comment-owner-buttons";
// Removed server function import - will be passed as props
import type { Comment } from "@/features/comment/types";
import type { PaginatedResult } from "@/features/types/pagination";

type CommentsProps = {
  ticketId: string;
  loadMore: (cursor: string) => Promise<{
    list: Comment[];
    hasMore: boolean;
    nextCursor: string | null;
  }>;
} & PaginatedResult<Comment>;

const Comments = ({ ticketId, list, metadata, loadMore }: CommentsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState(list);
  const [nextCursor, setNextCursor] = useState<string | null>(
    metadata?.nextCursor ?? null,
  );
  const [hasMore, setHasMore] = useState(metadata?.hasNextPage ?? false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await loadMore(nextCursor ?? "");
      startTransition(() => {
        setComments((prev) => [...prev, ...result.list]);
        setNextCursor(result.nextCursor ?? null);
        setHasMore(result.hasMore);
      });
    });
  };

  const handleAfterMutation = () => {
    // Refresh the page data to get updated comments from the server
    router.refresh();
    setEditingCommentId(null);
    setEditingContent("");
  };

  return (
    <>
      <CardCompact
        content={
          <div ref={formRef}>
            <CommentCreateForm
              commentId={editingCommentId || undefined}
              initialContent={editingContent}
              onCancel={handleCancelEdit}
              onSuccess={handleAfterMutation}
              ticketId={ticketId}
            />
          </div>
        }
        description={
          editingCommentId
            ? "Update your comment"
            : "Add a comment to the ticket"
        }
        title={editingCommentId ? "Edit Comment" : "Create Comment"}
      />
      <div className="grid gap-y-2">
        {comments.map((comment) => (
          <CommentItem
            buttons={
              <CommentOwnerButtons
                comment={comment}
                onDeleteComment={handleAfterMutation}
                onEdit={handleEdit}
              />
            }
            comment={comment}
            key={comment.id}
          />
        ))}
        <Activity mode={isPending ? "visible" : "hidden"}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Activity>
        <Activity mode={hasMore ? "visible" : "hidden"}>
          <div className="flex justify-center pt-2">
            <Button
              className="w-full"
              disabled={isPending}
              onClick={handleLoadMore}
              variant="ghost"
            >
              {isPending ? "Loading..." : "Load More Comments"}
            </Button>
          </div>
        </Activity>
      </div>
    </>
  );
};

export default Comments;
