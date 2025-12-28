const TicketListSkeleton = () => (
  <div className="max-content-widest grid grid-cols-[1fr_36px] gap-x-2 gap-y-4">
    <div className="h-49 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="aspect-square h-4 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="h-49 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="aspect-square h-4 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="h-49 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="aspect-square h-4 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="h-49 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="aspect-square h-4 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="h-49 animate-pulse rounded-lg bg-muted-foreground/50" />
    <div className="aspect-square h-4 animate-pulse rounded-lg bg-muted-foreground/50" />
  </div>
);

export default TicketListSkeleton;
