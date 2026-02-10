import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TICKET_ICONS,
  TICKET_STATUS_LABELS,
} from "@/features/ticket/constants";
import type { TicketStats } from "@/features/ticket/queries/get-user-ticket-stats";

interface TicketStatsCardProps {
  stats: TicketStats;
}

const TicketStatsCard = ({ stats }: TicketStatsCardProps) => {
  return (
    <Card className="md:row-span-2 md:grid md:grid-rows-subgrid">
      <CardHeader>
        <CardTitle>Ticket Statistics</CardTitle>
        <CardDescription>Your ticket activity overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Total Tickets */}
          <div className="flex items-center justify-between border-border border-b">
            <span className="font-semibold text-base">Total Tickets</span>
            <span className="font-bold text-2xl">{stats.total}</span>
          </div>

          {/* Status Breakdown */}
          <div className="flex flex-col gap-4">
            {/* Open */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-5 text-muted-foreground">
                  {TICKET_ICONS.OPEN}
                </span>
                <span className="text-sm">{TICKET_STATUS_LABELS.OPEN}</span>
              </div>
              <span className="font-semibold">{stats.open}</span>
            </div>

            {/* In Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-5 text-muted-foreground">
                  {TICKET_ICONS.IN_PROGRESS}
                </span>
                <span className="text-sm">
                  {TICKET_STATUS_LABELS.IN_PROGRESS}
                </span>
              </div>
              <span className="font-semibold">{stats.inProgress}</span>
            </div>

            {/* Done */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-5 text-muted-foreground">
                  {TICKET_ICONS.DONE}
                </span>
                <span className="text-sm">{TICKET_STATUS_LABELS.DONE}</span>
              </div>
              <span className="font-semibold">{stats.done}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { TicketStatsCard };
