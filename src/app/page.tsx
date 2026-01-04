import type { Metadata } from "next";
import { Suspense } from "react";
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
  <>
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
    <Suspense fallback={<TicketListSkeleton />}>
      <TicketList searchParams={searchParams} />
    </Suspense>
  </>
);
export default HomePage;
