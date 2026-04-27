"use client";

import { TicketX } from "lucide-react";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import type { ErrorInfo } from "next/error";

const TicketError = ({ error, unstable_retry }: ErrorInfo) => (
  <Placeholder
    button={
      <Button onClick={unstable_retry} variant="outline">
        Try again
      </Button>
    }
    icon={<TicketX />}
    label={error.message || "please try again later"}
  />
);

export default TicketError;
