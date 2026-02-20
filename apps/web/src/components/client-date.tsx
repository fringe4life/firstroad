"use client";

import { useSyncExternalStore } from "react";

interface ClientDateProps {
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}

/**
 * "Client mounted" store: false on server and first client render, then true
 * after a microtask so server and initial client HTML match (placeholder).
 * Avoids setState-in-effect and satisfies React Compiler.
 */
let clientMounted = false;
const emptySubscribe = () => () => null;
function subscribe(callback: () => void) {
  if (clientMounted) {
    return emptySubscribe();
  }
  const schedule =
    typeof queueMicrotask !== "undefined"
      ? queueMicrotask
      : (fn: () => void) => setTimeout(fn, 0);
  schedule(() => {
    clientMounted = true;
    callback();
  });
  return emptySubscribe();
}
function getSnapshot() {
  return clientMounted;
}
function getServerSnapshot() {
  return false;
}

/**
 * Renders a date with the user's locale only after client mount to avoid hydration
 * mismatch (server and client can format dates differently).
 * Shows a fixed-size placeholder until then to avoid layout shift.
 */
const ClientDate = ({ date, options }: ClientDateProps) => {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

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
