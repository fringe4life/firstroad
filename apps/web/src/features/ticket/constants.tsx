import { Check, File, Pencil } from "lucide-react";
import type { Metadata } from "next";
import type { SortOption } from "@/components/sort-select";

const TICKET_ICONS = {
  DONE: <Check />,
  IN_PROGRESS: <Pencil />,
  OPEN: <File />,
} as const;

const TICKET_STATUS_LABELS = {
  DONE: "Done",
  IN_PROGRESS: "In Progress",
  OPEN: "Open",
} as const;

const TICKET_SORT_OPTIONS: readonly SortOption[] = [
  {
    label: "Newest",
    sortKey: "createdAt",
    sortValue: "desc",
  },
  {
    label: "Due soon",
    sortKey: "deadline",
    sortValue: "asc",
  },
  {
    label: "Bounty",
    sortKey: "bounty",
    sortValue: "desc",
  },
];

const TICKET_NOT_FOUND: Metadata = {
  description: "The requested ticket could not be found.",
  title: "Ticket Not Found",
};

export {
  TICKET_ICONS,
  TICKET_NOT_FOUND,
  TICKET_SORT_OPTIONS,
  TICKET_STATUS_LABELS,
};
