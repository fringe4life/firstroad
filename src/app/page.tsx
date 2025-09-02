import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";

export const metadata: Metadata = {
  title: "All Tickets",
  description:
    "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
};

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  return (
    <div className="flex flex-col gap-y-8">
      <Heading
        title="All Tickets"
        description="Tickets by everyone at one place"
      />
      <Suspense fallback={<Spinner />}>
        <TicketList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default HomePage;
