import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import Heading from "@/components/heading";
import { getSession } from "@/features/auth/queries/get-session";
import TicketList from "@/features/ticket/components/ticket-list";

type TicketsProps = {
  searchParams?: Promise<SearchParams>;
};

export default function Tickets({ searchParams }: TicketsProps) {
  return (
    <div className="grid items-center gap-y-4">
      {/* Conditional header based on auth state */}
      <Suspense fallback={<HeaderSkeleton />}>
        <ConditionalHeader />
      </Suspense>

      {/* Tickets list with proper userId filtering */}
      <Suspense fallback={<TicketListSkeleton />}>
        <TicketListWithAuth searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Conditional header component
const ConditionalHeader = async () => {
  const session = await getSession();
  if (session?.user) {
    return (
      <Heading description="All your tickets at one place" title="My Tickets" />
    );
  }

  return (
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
  );
};

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
const HeaderSkeleton = () => (
  <div className="h-16 animate-pulse rounded-lg bg-muted" />
);

const TicketListSkeleton = () => (
  <div className="space-y-4">
    <div className="h-20 animate-pulse rounded-lg bg-muted" />
    <div className="h-20 animate-pulse rounded-lg bg-muted" />
    <div className="h-20 animate-pulse rounded-lg bg-muted" />
  </div>
);
