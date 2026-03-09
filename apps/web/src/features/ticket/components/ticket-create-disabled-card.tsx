import { CardCompact } from "@/components/card-compact";

const TicketCreateDisabledCard = () => (
  <CardCompact
    className="max-content-narrow justify-self-center"
    content={
      <p className="text-muted-foreground text-sm">
        You do not have permission to create tickets for this organisation.
        Contact an administrator to request access, or switch to an organisation
        where you have create permissions.
      </p>
    }
    description="You currently cannot create tickets for this organisation."
    title="Ticket creation restricted"
  />
);

export { TicketCreateDisabledCard };
