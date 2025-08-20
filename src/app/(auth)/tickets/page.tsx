import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CardCompact } from "@/components/card-compact";
import Heading from "@/components/heading";
import Placeholder from "@/components/placeholder";
import Spinner from "@/components/Spinner";
import TicketList from "@/features/ticket/ticket-list";
import TicketUpsertForm from "@/features/ticket/ticket-upsert-form";
import { auth } from "@/app/auth";

const TicketsPage = async () => {
  const session = await auth();
  
  return (
    <>
      <div className="flex-1 flex flex-col gap-y-8">
        <Heading title="My Tickets" description="All your tickets at one place" />
        <CardCompact
          className="w-full max-w-105 self-center"
          title="Create Ticket"
          description="A new ticket will be created"
          content={<TicketUpsertForm />}
        />
        <div className="flex-1 flex flex-col items-center gap-y-4">
          <ErrorBoundary
            fallback={<Placeholder label={"please try again later"} />}
          >
            <Suspense fallback={<Spinner />}>
              <TicketList userId={session?.user?.id} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      {/* <RedirectToast /> */}
    </>
  );
};

export default TicketsPage;
