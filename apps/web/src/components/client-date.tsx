"use client";

import { useEffect, useState } from "react";

interface ClientDateProps {
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}

/**
 * Renders a date with the user's locale only after mount to avoid hydration
 * mismatch (server and client can format dates differently).
 * Shows a fixed-size placeholder until then. Uses a span so it is valid inside <p>.
 */
const ClientDate = ({ date, options }: ClientDateProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-block h-3.5 w-34.5 animate-pulse rounded-md bg-accent"
      />
    );
  }

  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleString(undefined, options)}
    </time>
  );
};

export { ClientDate };
