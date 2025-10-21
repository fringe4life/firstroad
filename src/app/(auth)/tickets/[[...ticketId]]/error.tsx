"use client";

import Placeholder from "@/components/placeholder";

const TicketError = ({
  error: _error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  // Log error for debugging in development
  if (process.env.NODE_ENV === "development") {
    // biome-ignore lint/suspicious/noConsole: just for debugging
    console.error("Ticket error:", _error);
  }

  return <Placeholder label={"please try again later"} />;
};

export default TicketError;
