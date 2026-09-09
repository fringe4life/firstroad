import type { Metadata } from "next";
import { Heading } from "@/components/heading";
import { Tickets } from "@/features/ticket/components/tickets";

export const metadata: Metadata = {
  description:
    "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
  openGraph: {
    description:
      "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
    title: "All Tickets | First Road",
  },
  title: "All Tickets",
};

const HomePage = ({ searchParams }: PageProps<"/">) => (
  <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
    <Tickets searchParams={searchParams} />
  </div>
);
export default HomePage;
