import { Skeleton } from "@/components/ui/skeleton";

const AttachmentListSkeleton = () => (
  <ul className="grid gap-y-2">
    {[1, 2, 3].map((i) => (
      <li className="flex items-center gap-x-2" key={i}>
        <Skeleton className="h-4 w-4 shrink-0" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      </li>
    ))}
  </ul>
);

export { AttachmentListSkeleton };
