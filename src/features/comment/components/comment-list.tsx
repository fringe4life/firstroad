"use client";

import {
  Activity,
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { CardCompact } from "@/components/card-compact";
import { GenericComponent } from "@/components/generic-component";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { deleteComment } from "@/features/comment/actions/delete-comment";

import type { upsertComment } from "@/features/comment/actions/upsert-comment";
import { CommentCreateForm } from "@/features/comment/components/comment-create-form";
import { CommentOwnerButtons } from "@/features/comment/components/comment-owner-buttons";
import { commentReducer } from "@/features/comment/hooks/use-comment-optimistic";
import type {
  Comment,
  CommentState,
  CommentWithUserInfo,
  EditingState,
} from "@/features/comment/types";
import { NO_PAGINATION } from "@/features/pagination/constants";
import type { PaginatedResult } from "@/features/pagination/types";
import type { Maybe } from "@/types";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { INITIAL_EDITING_STATE } from "../constants";
import type { getCommentsByTicketSlug } from "../dal/get-comments";
import { CommentItem } from "./comment-item";

type CommentsProps = {
  ticketSlug: string;
  loadMoreAction: typeof getCommentsByTicketSlug;
  upsertCommentAction: typeof upsertComment;
  deleteCommentAction: typeof deleteComment;
  userId?: string;
  userName?: string;
  ticketId: string;
} & PaginatedResult<Comment>;

const CommentList = ({
  list,
  metadata,
  ticketSlug,
  loadMoreAction,
  upsertCommentAction,
  deleteCommentAction,
  userId,
  userName,
  ticketId,
}: CommentsProps) => {
  // Maintain a local state that combines list with pagination metadata
  const [commentsState, setCommentsState] = useState<CommentState>(() => ({
    list: list ?? [],
    metadata: metadata ?? NO_PAGINATION.metadata,
  }));

  const [optimisticComments, addOptimisticUpdate] = useOptimistic(
    commentsState.list,
    commentReducer,
  );

  const [editingState, setEditingState] = useState<EditingState>(
    () => INITIAL_EDITING_STATE,
  );

  const editingCommentIdRef = useRef<Maybe<string>>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Sync ref with state
  useEffect(() => {
    editingCommentIdRef.current = editingState.commentId;
  }, [editingState.commentId]);

  // Use useActionState for upsertComment to access returned comment data
  const [upsertState, upsertAction] = useActionState(
    async (
      _prevState: ActionState<CommentWithUserInfo>,
      formData: FormData,
    ): Promise<ActionState<CommentWithUserInfo>> => {
      const content = formData.get("content") as string;
      const commentId = editingState.commentId;

      // Trigger optimistic updates before calling server action
      if (commentId) {
        // Edit: trigger optimistic edit
        startTransition(() => {
          addOptimisticUpdate({ type: "edit", commentId, content });
        });
      } else if (userId && userName && ticketId) {
        // Add: create optimistic comment
        startTransition(() => {
          addOptimisticUpdate({
            type: "add",
            comment: {
              content,
              ticketId,
              userId,
              userInfo: {
                userId,
                user: {
                  name: userName,
                },
              },
            },
          });
        });
      }

      return await upsertCommentAction(
        commentId,
        ticketId,
        _prevState as ActionState<CommentWithUserInfo>,
        formData,
      );
    },
    EMPTY_ACTION_STATE as ActionState<CommentWithUserInfo>,
  );

  // Handle successful upsert - receives ActionState with returned comment
  const handleUpsertSuccess = (state: ActionState<CommentWithUserInfo>) => {
    const { data: comment } = state;
    if (!comment) {
      return;
    }

    setCommentsState((prev) => ({
      ...prev,
      list: (() => {
        if (editingState.commentId) {
          // Edit: replace existing comment
          return prev.list.map((c) => (c.id === comment.id ? comment : c));
        }
        // Add: check if comment already exists (from optimistic add), otherwise add
        const exists = prev.list.some((c) => c.id === comment.id);
        if (exists) {
          // Replace optimistic comment with real one
          return prev.list.map((c) => (c.id === comment.id ? comment : c));
        }
        // Add new comment at the beginning
        return [comment, ...prev.list];
      })(),
    }));

    // Reset editing state
    setEditingState(INITIAL_EDITING_STATE);
  };

  const [isPending, startTransition] = useTransition();

  const handleEdit = (commentId: string, content: string) => {
    setEditingState({ commentId, content });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCancelEdit = () => {
    setEditingState(INITIAL_EDITING_STATE);
  };

  const handleLoadMore = () => {
    startTransition(async () => {
      const newData = await loadMoreAction(
        ticketSlug,
        commentsState.metadata.nextCursor ?? "",
        3,
      );
      setCommentsState((prev) => ({
        list: [...prev.list, ...(newData.list ?? [])],
        metadata: newData.metadata,
      }));
    });
  };

  const handleDelete = async (
    commentId: string,
  ): Promise<ActionState<string>> => {
    // Trigger optimistic delete immediately
    startTransition(() => {
      addOptimisticUpdate({ type: "delete", commentId });
    });

    // Call server action and return result
    const result = (await deleteCommentAction(
      commentId,
    )) as ActionState<string>;

    // Update commentsState after successful delete
    if (result.status === "SUCCESS") {
      setCommentsState((prev) => ({
        ...prev,
        list: prev.list.filter((c) => c.id !== commentId),
      }));
    }

    // Error handling is done by the Form component's useActionFeedback hook
    // which shows toasts. The optimistic update will be automatically corrected
    // when component re-renders with fresh data after cache invalidation.
    return result;
  };

  return (
    <>
      <CardCompact
        content={
          <div ref={formRef}>
            <CommentCreateForm
              action={upsertAction}
              commentId={editingState.commentId}
              initialContent={editingState.content}
              onCancel={handleCancelEdit}
              onSuccessState={handleUpsertSuccess}
              state={upsertState as ActionState<CommentWithUserInfo>}
            />
          </div>
        }
        description={
          editingState.commentId
            ? "Update your comment"
            : "Add a comment to the ticket"
        }
        title={editingState.commentId ? "Edit Comment" : "Create Comment"}
      />
      <div className="grid gap-y-2">
        <GenericComponent
          Component={CommentItem}
          className="grid gap-y-2"
          emptyStateMessage="No Comments Found"
          items={optimisticComments}
          renderKey={(item) => item.id}
          renderProps={(item) => ({
            comment: item,
            buttons:
              userId === item.userInfo?.userId ? (
                <CommentOwnerButtons
                  comment={item}
                  onDeleteComment={handleDelete}
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
          mode={commentsState.metadata.hasNextPage ? "visible" : "hidden"}
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

export { CommentList };
