import { Check, File, Pencil } from "lucide-react";

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

export { TICKET_ICONS, TICKET_STATUS_LABELS };
