"use client";

import { Activity } from "react";
import { Button } from "@/components/ui/button";
import { useComments } from "@/features/comment/components/comments-store";
import { CommentListSkeleton } from "@/features/comment/components/skeletons/comment-list-skeleton";

const CommentPagination = () => {
  const { isPending, hasNextPage, handleLoadMore } = useComments();

  return (
    <>
      <Activity mode={isPending ? "visible" : "hidden"}>
        <CommentListSkeleton />
      </Activity>
      <Activity mode={hasNextPage ? "visible" : "hidden"}>
        <div className="flex justify-center pt-2">
          <Button
            className="w-full text-right italic"
            disabled={isPending}
            onClick={handleLoadMore}
            variant="ghost"
          >
            {isPending ? "Loading..." : "Load More Comments"}
          </Button>
        </div>
      </Activity>
    </>
  );
};

export { CommentPagination };
