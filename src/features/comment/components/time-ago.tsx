import { Suspense } from "react";
import type { TimeAgoProps } from "../types";
import TimeAgoClient from "./time-ago-client";
import TimeAgoFallback from "./time-ago-skeleton";

// Main component with Suspense boundary
const TimeAgo = ({ createdAt, updatedAt }: TimeAgoProps) => (
  <Suspense fallback={<TimeAgoFallback />}>
    <TimeAgoClient createdAt={createdAt} updatedAt={updatedAt} />
  </Suspense>
);

export { TimeAgo };
