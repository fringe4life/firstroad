const TicketListSkeleton = () => (
  <div className="grid h-full justify-items-center">
    <div className="max-content-narrow grid grid-cols-[1fr_36px] justify-center gap-x-2 gap-y-4">
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <div className="aspect-square h-10 animate-pulse rounded-sm bg-muted-foreground/50" />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <div className="aspect-square h-10 animate-pulse rounded-sm bg-muted-foreground/50" />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <div className="aspect-square h-10 animate-pulse rounded-sm bg-muted-foreground/50" />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <div className="aspect-square h-10 animate-pulse rounded-sm bg-muted-foreground/50" />
      <div className="h-55 animate-pulse rounded-lg bg-muted-foreground/50" />
      <div className="aspect-square h-10 animate-pulse rounded-sm bg-muted-foreground/50" />
    </div>
  </div>
);

export { TicketListSkeleton };
