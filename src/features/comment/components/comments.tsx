"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { CardCompact } from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LoadMoreState } from "@/features/comment/actions/load-more-comments";
import CommentCreateForm from "@/features/comment/components/comment-create-form";
import CommentItem from "@/features/comment/components/comment-item";
import CommentOwnerButtons from "@/features/comment/components/comment-owner-buttons";
import type { Comment } from "@/features/comment/types";
import type { PaginatedResult } from "@/features/types/pagination";

type CommentsProps = {
  ticketId: string;
  loadMoreAction: (ticketId: string, cursor: string) => Promise<LoadMoreState>;
} & PaginatedResult<Comment>;

const Comments = ({
  ticketId,
  list,
  metadata,
  loadMoreAction,
}: CommentsProps) => {
  const router = useRouter();

  // Use useActionState for the load more action with initial state
  const [loadMoreState, loadMoreActionState, isPending] = useActionState(
    async (prevState: LoadMoreState, formData: FormData) => {
      const cursor = formData.get("cursor") as string;
      const newData = await loadMoreAction(ticketId, cursor);

      // Merge previous state with new data
      return {
        list: [...prevState.list, ...newData.list],
        hasMore: newData.hasMore,
        nextCursor: newData.nextCursor,
      };
    },
    {
      list,
      hasMore: metadata?.hasNextPage ?? false,
      nextCursor: metadata?.nextCursor ?? null,
    },
  );

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
    startTransition(() => {
      const formData = new FormData();
      formData.append("cursor", loadMoreState.nextCursor ?? "");
      loadMoreActionState(formData);
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
        {loadMoreState.list.map((comment) => (
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
        <Activity mode={loadMoreState.hasMore ? "visible" : "hidden"}>
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
