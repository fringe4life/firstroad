import { Skeleton } from "@/components/ui/skeleton";

const TimeAgoFallback = () => (
  <div className="flex items-center gap-2 text-muted-foreground text-xs">
    <Skeleton className="h-4 w-16 bg-muted" />
    <Skeleton className="h-4 w-[1ch] bg-muted" />
    <Skeleton className="h-4 w-[6ch] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] bg-muted" />
  </div>
);

export { TimeAgoFallback };
