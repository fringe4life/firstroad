import type { TicketInclude } from "@firstroad/db/client-types";
import { Check, File, Pencil } from "lucide-react";
import type { Metadata } from "next";
import type { SortOption } from "@/components/sort-select";

const TICKET_ICONS = {
  OPEN: <File />,
  DONE: <Check />,
  IN_PROGRESS: <Pencil />,
} as const;

const TICKET_STATUS_LABELS = {
  OPEN: "Open",
  DONE: "Done",
  IN_PROGRESS: "In Progress",
} as const;

const TICKET_SORT_OPTIONS: readonly SortOption[] = [
  {
    label: "Newest",
    sortKey: "createdAt",
    sortValue: "desc",
  },
  {
    label: "Bounty",
    sortKey: "bounty",
    sortValue: "desc",
  },
];

const TICKET_NOT_FOUND: Metadata = {
  title: "Ticket Not Found",
  description: "The requested ticket could not be found.",
};

const TICKET_WITH_USER_INCLUDE = {
  user: {
    select: {
      name: true,
    },
  },
} satisfies TicketInclude;
export {
  TICKET_ICONS,
  TICKET_STATUS_LABELS,
  TICKET_SORT_OPTIONS,
  TICKET_NOT_FOUND,
  TICKET_WITH_USER_INCLUDE,
};
