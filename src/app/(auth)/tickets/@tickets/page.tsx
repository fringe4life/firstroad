import { connection } from "next/server";
import { ViewTransition } from "react";
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
      <ViewTransition>
        <AuthenticatedTicketList searchParams={searchParams} />
      </ViewTransition>
    </div>
  );
}
