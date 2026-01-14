import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { Heading } from "@/components/heading";
import { TicketListSkeleton } from "@/features/ticket/components/skeletons/ticket-list-skeleton";
import { TicketList } from "@/features/ticket/components/ticket-list";

export const metadata: Metadata = {
  title: "All Tickets",
  description:
    "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
  openGraph: {
    title: "All Tickets | First Road",
    description:
      "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
  },
};

const HomePage = ({ searchParams }: PageProps<"/">) => (
  <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
    <Suspense fallback={<TicketListSkeleton />}>
      <ViewTransition>
        <TicketList searchParams={searchParams} />
      </ViewTransition>
    </Suspense>
  </div>
);
export default HomePage;
