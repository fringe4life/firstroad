"use client";

import {
  Activity,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { CardCompact } from "@/components/card-compact";
import GenericComponent from "@/components/generic-component";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { deleteComment } from "@/features/comment/actions/delete-comment";

import type { upsertComment } from "@/features/comment/actions/upsert-comment";
import CommentCreateForm from "@/features/comment/components/comment-create-form";
import CommentOwnerButtons from "@/features/comment/components/comment-owner-buttons";
import type { Comment, CommentWithUserInfo } from "@/features/comment/types";
import { NO_PAGINATION } from "@/features/pagination/constants";
import type { PaginatedResult } from "@/features/pagination/types";
import type { Maybe } from "@/types";
import type { getCommentsByTicketId } from "../dal/get-comments";
import CommentItem from "./comment-item";

type CommentsProps = {
  ticketId: string;
  loadMoreAction: typeof getCommentsByTicketId;
  upsertCommentAction: typeof upsertComment;
  deleteCommentAction: typeof deleteComment;
  userId?: string;
} & PaginatedResult<Comment>;

const Comments = ({
  list,
  metadata,
  ticketId,
  loadMoreAction,
  upsertCommentAction,
  // deleteCommentAction,
  userId,
}: CommentsProps) => {
  // Use useActionState for the load more action with initial state
  const [loadMoreState, loadMoreActionState, isPending] = useActionState(
    async (prevState: PaginatedResult<CommentWithUserInfo>) => {
      const newData = await loadMoreAction(
        ticketId,
        prevState.metadata.nextCursor ?? "",
      );

      // Merge previous state with new data
      return {
        list: [...(prevState.list ?? []), ...(newData.list ?? [])],
        metadata: { ...prevState.metadata, ...newData.metadata },
      };
    },
    {
      list: list ?? [],
      metadata: metadata ?? NO_PAGINATION,
    },
  );

  const [editingCommentId, setEditingCommentId] = useState<Maybe<string>>(null);
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
      formData.append("cursor", loadMoreState.metadata.nextCursor ?? "");
      loadMoreActionState();
    });
  };

  const handleAfterMutation = (_commentId?: string) => {
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
              upsertCommentAction={upsertCommentAction}
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
        <GenericComponent
          Component={CommentItem}
          className="grid gap-y-2"
          emptyStateMessage="No Comments Found"
          items={loadMoreState.list}
          renderKey={(item) => item.id}
          renderProps={(item) => ({
            comment: item,
            buttons:
              userId === item.userInfo?.userId ? (
                <CommentOwnerButtons
                  comment={item}
                  onDeleteComment={() => handleAfterMutation(item.id)}
                  onEdit={(commentId, content) =>
                    handleEdit(commentId, content)
                  }
                />
              ) : null,
          })}
        />
        <Activity mode={isPending ? "visible" : "hidden"}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Activity>
        <Activity
          mode={loadMoreState.metadata.hasNextPage ? "visible" : "hidden"}
        >
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
