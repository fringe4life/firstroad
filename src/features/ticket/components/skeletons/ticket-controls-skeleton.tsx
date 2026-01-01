"use cache";

const TicketControlsFallback = async () => (
  <div className="max-content-narrow grid gap-y-2">
    {/* Search and Sort/Filter row - single div with shadow creating second element */}

    <div className="h-9 w-1/2 animate-pulse bg-muted-foreground shadow-[calc(var(--max-content-narrow)/2-0.25rem)_0_0_0_var(--muted)]" />

    {/* Scope toggle row - only visible on desktop, single div with shadow creating second button */}
    <div className="hidden h-9 w-1/2 animate-pulse bg-muted-foreground shadow-[calc(var(--max-content-narrow)/2)_0_0_0_var(--muted)] sm:block" />
  </div>
);

export { TicketControlsFallback };
