const TimeAgoFallback = () => (
  <div className="flex items-center gap-2 text-muted-foreground text-xs">
    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
    <span className="w-[1ch] animate-pulse rounded bg-muted" />
    <span className="w-[6ch] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded bg-muted" />
  </div>
);

export { TimeAgoFallback };
