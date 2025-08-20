import Heading from "@/components/heading";
import { Suspense } from "react";
import TicketList from "@/features/ticket/ticket-list";
import Spinner from "@/components/Spinner";
import type { SearchParams } from "@/features/ticket/search-params";

const HomePage = async ({searchParams}: SearchParams) => {

  const params = await searchParams;
  console.log(params);
  
  return (
    <div className="flex flex-col gap-y-8">
      <Heading title="All Tickets" description="Tickets by everyone at one place" />
      <Suspense fallback={<Spinner />}>
          <TicketList search={params.search} />
      </Suspense>
    </div>
  );
};

export default HomePage;
