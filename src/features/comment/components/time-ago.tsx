import { Suspense, ViewTransition } from "react";
import type { Time } from "../types";
import { TimeAgoClient } from "./time-ago-client";
import { TimeAgoFallback } from "./time-ago-skeleton";

// Main component with Suspense boundary
const TimeAgo = <T extends Time>({ createdAt, updatedAt }: T) => (
  <Suspense fallback={<TimeAgoFallback />}>
    <ViewTransition>
      <TimeAgoClient createdAt={createdAt} updatedAt={updatedAt} />
    </ViewTransition>
  </Suspense>
);

export { TimeAgo };
