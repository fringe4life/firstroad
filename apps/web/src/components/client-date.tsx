"use client";

import { useSyncExternalStore } from "react";

interface ClientDateProps {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
}

/**
 * Client locale/timezone as an external store.
 * Server snapshot is null (placeholder). Client snapshot reads navigator /
 * Intl — only runs in the browser after hydration, so HTML matches.
 */
function subscribe(onStoreChange: () => void) {
  window.addEventListener("languagechange", onStoreChange);
  return () => window.removeEventListener("languagechange", onStoreChange);
}

function getLocaleSnapshot(): string {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  return `${navigator.language}\0${timeZone}`;
}

function getServerLocaleSnapshot(): null {
  return null;
}

/**
 * Renders a date with the user's locale after hydration to avoid mismatch
 * (server vs browser locale/timezone). Placeholder until then avoids layout shift.
 *
 * Formats during render with an explicit locale + timeZone from the client
 * store — no setState-in-effect, and no undefined-locale toLocaleString.
 */
const ClientDate = ({ date, options }: ClientDateProps) => {
  const localeKey: string | null = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  if (localeKey === null) {
    return (
      <span
        aria-hidden
        className="inline-block h-4 w-34.5 animate-pulse rounded-sm bg-accent"
      />
    );
  }

  const separator = localeKey.indexOf("\0");
  const locale = localeKey.slice(0, separator);
  const timeZone = localeKey.slice(separator + 1);

  const dateValue = date instanceof Date ? date : new Date(date);

  return (
    <time dateTime={dateValue.toISOString()}>
      {dateValue.toLocaleString(locale, { ...options, timeZone })}
    </time>
  );
};

export { ClientDate };
