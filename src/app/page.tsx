import type { Metadata } from "next";
import { unstable_cacheLife as cacheLife } from "node_modules/next/cache";
import Heading from "@/components/heading";

export const metadata: Metadata = {
  title: "All Tickets",
  description:
    "View and manage all tickets in the First Road system. Track progress, update status, and collaborate with your team.",
};

// biome-ignore lint/suspicious/useAwait: need for use cache
const HomePage = async () => {
  "use cache";
  cacheLife("max");
  return (
    <Heading
      description="Tickets by everyone at one place"
      title="All Tickets"
    />
  );
};

export default HomePage;
