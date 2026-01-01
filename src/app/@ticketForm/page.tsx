import { CardCompact } from "@/components/card-compact";
import { getUser } from "@/features/auth/queries/get-user";
import { upsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { TicketUpsertForm } from "@/features/ticket/components/ticket-upsert-form";

const TicketFormPage = async () => {
  const { hasUser } = await getUser();

  if (!hasUser) {
    return null;
  }

  return (
    <CardCompact
      className="max-content-narrow self-center"
      content={<TicketUpsertForm upsertTicketAction={upsertTicket} />}
      description="A new ticket will be created"
      title="Create Ticket"
    />
  );
};

export default TicketFormPage;
