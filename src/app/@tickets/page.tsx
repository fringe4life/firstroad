import { Suspense, ViewTransition } from "react";
import Spinner from "@/components/spinner";
import TicketList from "@/features/ticket/components/ticket-list";

export default function Tickets({ searchParams }: PageProps<"/">) {
  return (
    <div className="grid items-center gap-y-4">
      <ViewTransition>
        <Suspense fallback={<Spinner />}>
          <TicketList searchParams={searchParams} />
        </Suspense>
      </ViewTransition>
    </div>
  );
}
