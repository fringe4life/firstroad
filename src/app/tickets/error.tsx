"use client";

import { TicketX } from "lucide-react";
import Placeholder from "@/components/Placeholder";
export default function Error({ error }: { error: Error }) {
  return (
    <Placeholder
      icon={<TicketX />}
      label={error.message || "please try again later"}
    />
  );
}
