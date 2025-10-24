"use cache";

const TicketControlsFallback = async () => (
  <div className="max-content-narrow grid grid-flow-col grid-cols-2 gap-x-2">
    {/* Single div with box-shadow creating the second element */}
    <div className="h-9 w-full animate-pulse bg-muted shadow-[calc(100%+0.5rem)_0_0_0_var(--muted)]" />
  </div>
);

export default TicketControlsFallback;
