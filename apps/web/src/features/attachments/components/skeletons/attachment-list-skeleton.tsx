import { Skeleton } from "@/components/ui/skeleton";

const AttachmentListSkeleton = () => (
  <ul className="grid gap-y-2">
    {[1, 2, 3].map((i) => (
      <li className="flex items-center gap-x-2" key={i}>
        <Skeleton className="aspect-square h-4 shrink-0" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="aspect-square h-8 shrink-0 rounded-sm bg-destructive/50" />
      </li>
    ))}
  </ul>
);

export { AttachmentListSkeleton };
