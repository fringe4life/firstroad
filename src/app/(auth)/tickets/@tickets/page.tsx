import { connection } from "next/server";
import { Suspense } from "react";
import Spinner from "src/components/spinner";
import { getSessionOrRedirect } from "@/features/auth/queries/get-session-or-redirect";
import TicketList from "@/features/ticket/components/ticket-list";

async function AuthenticatedTicketList({
  searchParams,
}: {
  searchParams: PageProps<"/tickets">["searchParams"];
}) {
  await connection();
  const session = await getSessionOrRedirect();

  return <TicketList searchParams={searchParams} userId={session.user.id} />;
}

export default function Tickets({ searchParams }: PageProps<"/tickets">) {
  return (
    <div className="flex flex-1 flex-col items-center gap-y-4">
      <Suspense fallback={<Spinner />}>
        <AuthenticatedTicketList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
