"use client";

import { CommentFormCard } from "@/features/comment/components/comment-form-card";
import { CommentList } from "@/features/comment/components/comment-list";
import { CommentPagination } from "@/features/comment/components/comment-pagination";
import { CommentsProvider } from "@/features/comment/components/comments-store";
import type { CommentsProps } from "@/features/comment/types";

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
