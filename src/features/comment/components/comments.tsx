"use client";

import { CommentFormCard } from "@/features/comment/components/comment-form-card";
import { CommentList } from "@/features/comment/components/comment-list";
import { CommentPagination } from "@/features/comment/components/comment-pagination";
import {
  CommentsProvider,
  type CommentsProviderProps,
} from "@/features/comment/components/comments-store";

type CommentsProps = Omit<CommentsProviderProps, "children">;

const Comments = (props: CommentsProps) => (
  <CommentsProvider {...props}>
    <CommentFormCard />
    <div className="grid gap-y-2">
      <CommentList />
      <CommentPagination />
    </div>
  </CommentsProvider>
);

export { Comments };
