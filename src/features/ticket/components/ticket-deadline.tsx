import { Suspense, ViewTransition } from "react";
import { TicketDeadlineFallback } from "./skeletons/ticket-deadline-skeleton";
import { TicketDeadlineClient } from "./ticket-deadline-client";

const TicketDeadline = ({ deadline }: { deadline: Date | string }) => (
  <Suspense fallback={<TicketDeadlineFallback />}>
    <ViewTransition>
      <TicketDeadlineClient deadline={deadline} />
    </ViewTransition>
  </Suspense>
);

export { TicketDeadline };
