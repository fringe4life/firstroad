"use client";

import { CommentFormCard } from "@/features/comment/components/comment-form-card";
import { CommentList } from "@/features/comment/components/comment-list";
import { CommentPagination } from "@/features/comment/components/comment-pagination";
import { CommentsProvider } from "@/features/comment/components/comments-store";
import type { CommentsProps } from "@/features/comment/types";

const Comments = (props: CommentsProps) => (
  <CommentsProvider {...props}>
    <div className="grid h-full gap-y-2 has-card:grid-rows-[min-content_1fr_min-content]">
      <CommentFormCard />
      <div className="grid h-full grid-rows-[1fr_min-content] gap-y-2">
        <CommentList />
        <CommentPagination />
      </div>
    </div>
  </CommentsProvider>
);

export { Comments };
