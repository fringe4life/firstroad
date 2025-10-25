"use cache";

const TicketControlsFallback = async () => (
  <>
    {/* Desktop: Stacked skeleton */}
    <div className="max-content-narrow hidden gap-y-2 sm:grid">
      <div className="grid grid-flow-col grid-cols-2 gap-x-2">
        <div className="h-9 w-full animate-pulse bg-muted" />
        <div className="h-9 w-full animate-pulse bg-muted" />
      </div>
      <div className="h-9 w-full animate-pulse bg-muted" />
    </div>

    {/* Mobile: Two-column skeleton */}
    <div className="max-content-narrow grid gap-y-2 sm:hidden">
      <div className="grid grid-flow-col grid-cols-2 gap-x-2">
        <div className="h-9 w-full animate-pulse bg-muted" />
        <div className="h-9 w-full animate-pulse bg-muted" />
      </div>
    </div>
  </>
);

export default TicketControlsFallback;
