"use cache";

const TicketControlsFallback = async () => (
  <div className="max-content-narrow grid grid-flow-col grid-cols-2 gap-x-2">
    <div className="h-9 animate-pulse bg-muted-foreground" />
    <div className="h-9 animate-pulse bg-muted-foreground" />
  </div>
);

export { TicketControlsFallback };
