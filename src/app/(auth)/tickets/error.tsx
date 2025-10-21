"use client";

import { TicketX } from "lucide-react";
import Placeholder from "@/components/placeholder";

const TicketError = ({ error }: { error: Error }) => (
  <Placeholder
    icon={<TicketX />}
    label={error.message || "please try again later"}
  />
);

export default TicketError;
