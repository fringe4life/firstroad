"use client";

import { TicketX } from "lucide-react";
import Placeholder from "@/components/placeholder";
export default function TicketError({ error }: { error: Error }) {
  return (
    <Placeholder
      icon={<TicketX />}
      label={error.message || "please try again later"}
    />
  );
}
