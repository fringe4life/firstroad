import { Check, File, Pencil } from "lucide-react";
import type { SortOption } from "@/components/sort-select";
import type { Prisma } from "@/generated/prisma/client";

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

// Sort orders used in UI and parsers - matches Prisma.SortOrder
const SORT_ORDERS: Prisma.SortOrder[] = ["asc", "desc"] as const;
export { TICKET_ICONS, TICKET_STATUS_LABELS, SORT_ORDERS, TICKET_SORT_OPTIONS };
