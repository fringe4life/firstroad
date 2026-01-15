import { CommentItemSkeleton } from "./comment-item-skeleton";

const CommentListSkeleton = () => (
  <div className="grid gap-y-2">
    <CommentItemSkeleton />
    <CommentItemSkeleton />
    <CommentItemSkeleton />
  </div>
);

export { CommentListSkeleton };
