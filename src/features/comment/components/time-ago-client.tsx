"use client";

import { formatDistanceToNow } from "date-fns";
import type { TimeAgoProps } from "../types";

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
      {Boolean(isEdited) && (
        <>
          <span>•</span>
          <span>edited</span>
        </>
      )}
    </div>
  );
};

export default TimeAgoClient;
