import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { getSession } from "@/features/auth/queries/get-session";
import TicketList from "@/features/ticket/components/ticket-list";

type TicketsProps = {
  searchParams?: Promise<SearchParams>;
};

const TicketsPage = ({ searchParams }: TicketsProps) => (
  <Suspense fallback={<TicketListSkeleton />}>
    <TicketListWithAuth searchParams={searchParams} />
  </Suspense>
);

// Tickets list with auth filtering
const TicketListWithAuth = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const session = await getSession();
  const userId = session?.user?.id;

  return <TicketList searchParams={searchParams} userId={userId} />;
};

// Loading skeletons

const TicketListSkeleton = () => (
  <div className="space-y-4">
    <div className="h-20 animate-pulse rounded-lg bg-muted" />
    <div className="h-20 animate-pulse rounded-lg bg-muted" />
    <div className="h-20 animate-pulse rounded-lg bg-muted" />
  </div>
);

export default TicketsPage;
