"use client";

import {
  createContext,
  use,
  useActionState,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import type { deleteComment } from "@/features/comment/actions/delete-comment";
import type { upsertComment } from "@/features/comment/actions/upsert-comment";
import { commentReducer } from "@/features/comment/hooks/use-comment-optimistic";
import type {
  Comment,
  CommentState,
  CommentWithUserInfo,
  EditingState,
} from "@/features/comment/types";
import { NO_PAGINATION } from "@/features/pagination/constants";
import type { PaginatedResult } from "@/features/pagination/types";
import type { ActionState } from "@/utils/to-action-state";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { INITIAL_EDITING_STATE } from "../constants";
import type { getCommentsByTicketSlug } from "../dal/get-comments";

type CommentsProviderProps = {
  ticketSlug: string;
  loadMoreAction: typeof getCommentsByTicketSlug;
  upsertCommentAction: typeof upsertComment;
  deleteCommentAction: typeof deleteComment;
  userId?: string;
  userName?: string;
  ticketId: string;
  children: React.ReactNode;
} & PaginatedResult<Comment>;

interface CommentsContextValue {
  formRef: React.RefObject<HTMLDivElement | null>;
  optimisticComments: CommentWithUserInfo[];
  editingState: EditingState;
  upsertState: ActionState<CommentWithUserInfo>;
  upsertAction: (formData: FormData) => void;
  userId?: string;
  isPending: boolean;
  hasNextPage: boolean;
  handleUpsertSuccess: (state: ActionState<CommentWithUserInfo>) => void;
  handleEdit: (commentId: string, content: string) => void;
  handleCancelEdit: () => void;
  handleLoadMore: () => void;
  handleDelete: (commentId: string) => Promise<ActionState<string>>;
}

const CommentsContext = createContext<CommentsContextValue | null>(null);

const CommentsProvider = ({
  list,
  metadata,
  ticketSlug,
  loadMoreAction,
  upsertCommentAction,
  deleteCommentAction,
  userId,
  userName,
  ticketId,
  children,
}: CommentsProviderProps) => {
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

  const formRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const [upsertState, upsertAction] = useActionState(
    async (
      _prevState: ActionState<CommentWithUserInfo>,
      formData: FormData,
    ): Promise<ActionState<CommentWithUserInfo>> => {
      const content = formData.get("content") as string;
      const commentId = editingState.commentId;

      if (commentId) {
        startTransition(() => {
          addOptimisticUpdate({ type: "edit", commentId, content });
        });
      } else if (userId && userName && ticketId) {
        startTransition(() => {
          addOptimisticUpdate({
            type: "add",
            comment: {
              content,
              ticketId,
              userId,
              user: {
                name: userName,
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

  const handleUpsertSuccess = (state: ActionState<CommentWithUserInfo>) => {
    const { data: comment } = state;
    if (!comment) {
      return;
    }

    setCommentsState((prev) => ({
      ...prev,
      list: (() => {
        if (editingState.commentId) {
          return prev.list.map((c) => (c.id === comment.id ? comment : c));
        }
        const exists = prev.list.some((c) => c.id === comment.id);
        if (exists) {
          return prev.list.map((c) => (c.id === comment.id ? comment : c));
        }
        return [comment, ...prev.list];
      })(),
    }));

    setEditingState(INITIAL_EDITING_STATE);
  };

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
    startTransition(() => {
      (async () => {
        const newData = await loadMoreAction(
          ticketSlug,
          commentsState.metadata.nextCursor ?? "",
          3,
        );
        setCommentsState((prev) => ({
          list: [...prev.list, ...(newData.list ?? [])],
          metadata: newData.metadata,
        }));
      })();
    });
  };

  const handleDelete = async (
    commentId: string,
  ): Promise<ActionState<string>> => {
    startTransition(() => {
      addOptimisticUpdate({ type: "delete", commentId });
    });

    const result = (await deleteCommentAction(
      commentId,
    )) as ActionState<string>;

    if (result.status === "SUCCESS") {
      setCommentsState((prev) => ({
        ...prev,
        list: prev.list.filter((c) => c.id !== commentId),
      }));
    }

    return result;
  };

  const value: CommentsContextValue = {
    formRef,
    optimisticComments,
    editingState,
    upsertState,
    upsertAction,
    userId,
    isPending,
    hasNextPage: commentsState.metadata.hasNextPage,
    handleUpsertSuccess,
    handleEdit,
    handleCancelEdit,
    handleLoadMore,
    handleDelete,
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};

const useComments = () => {
  const context = use(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within CommentsProvider");
  }
  return context;
};

export type { CommentsProviderProps };
export { CommentsProvider, useComments };
