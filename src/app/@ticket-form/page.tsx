import { CardCompact } from "@/components/card-compact";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";

export default function TicketFormPage() {
  return (
    <HasAuthSuspense fallback={<TicketFormSkeleton />}>
      {(session) => {
        if (!session?.user) {
          return null; // No form for unauthenticated users
        }

        return (
          <CardCompact
            className="max-content-narrow self-center"
            content={<TicketUpsertForm upsertTicketAction={upsertTicket} />}
            description="A new ticket will be created"
            title="Create Ticket"
          />
        );
      }}
    </HasAuthSuspense>
  );
}

// Loading skeleton for the form
const TicketFormSkeleton = () => (
  <div className="max-content-narrow self-center">
    <div className="h-32 animate-pulse rounded-lg bg-muted" />
  </div>
);
