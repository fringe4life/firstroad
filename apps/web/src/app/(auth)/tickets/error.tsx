"use client";

import { TicketX } from "lucide-react";
import type { ErrorInfo } from "next/error";
import { Placeholder } from "@/components/placeholder";
import { Button } from "@/components/ui/button";

const TicketError = ({ error, retry }: ErrorInfo) => (
  <Placeholder
    button={
      <Button onClick={retry} variant="outline">
        Try again
      </Button>
    }
    icon={<TicketX />}
    label={error instanceof Error ? error.message : "please try again later"}
  />
);

export default TicketError;
