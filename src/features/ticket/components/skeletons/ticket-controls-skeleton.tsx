"use cache";

const TicketControlsFallback = async () => (
  <div className="max-content-narrow mx-auto grid grid-flow-col grid-cols-2 gap-x-2 justify-self-center">
    <div className="h-9 animate-pulse rounded-lg bg-muted-foreground" />
    <div className="h-9 animate-pulse rounded-lg bg-muted-foreground" />
  </div>
);

export { TicketControlsFallback };
