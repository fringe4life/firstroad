"use client";

import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";
import TimeAgoFallback from "./time-ago-fallback";

type TimeAgoProps = {
  createdAt: string;
  updatedAt: string;
};

// Client component that handles the dynamic time calculation
const TimeAgoClient = ({ createdAt, updatedAt }: TimeAgoProps) => {
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);

  const timeAgo = Number.isNaN(createdDate.getTime())
    ? "Unknown time"
    : formatDistanceToNow(createdDate, { addSuffix: true });

  const isEdited =
    !Number.isNaN(updatedDate.getTime()) &&
    updatedDate.getTime() !== createdDate.getTime();

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <span>{timeAgo}</span>
      {isEdited && (
        <>
          <span>•</span>
          <span>edited</span>
        </>
      )}
    </div>
  );
};

// Main component with Suspense boundary
const TimeAgo = ({ createdAt, updatedAt }: TimeAgoProps) => (
  <Suspense fallback={<TimeAgoFallback />}>
    <TimeAgoClient createdAt={createdAt} updatedAt={updatedAt} />
  </Suspense>
);

export default TimeAgo;
