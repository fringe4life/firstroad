"use client";

import { TicketX } from "lucide-react";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import type { ErrorProps } from "@/types";

const TicketError = ({ error, reset }: ErrorProps) => (
  <Placeholder
    button={
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    }
    icon={<TicketX />}
    label={error.message || "please try again later"}
  />
);

export default TicketError;
