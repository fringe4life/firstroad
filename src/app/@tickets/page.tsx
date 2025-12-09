import type { SearchParams } from "nuqs/server";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import TicketList from "@/features/ticket/components/ticket-list";

type TicketsProps = {
  searchParams: Promise<SearchParams>;
};

const TicketsPage = ({ searchParams }: TicketsProps) => (
  <HasAuthSuspense fallback={<TicketListSkeleton />}>
    {(session) => (
      <TicketList searchParams={searchParams} userId={session?.user?.id} />
    )}
  </HasAuthSuspense>
);

// Loading skeletons

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

export default TicketsPage;
